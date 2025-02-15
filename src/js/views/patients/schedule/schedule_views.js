import { debounce, every } from 'underscore';
import Radio from 'backbone.radio';
import { View, CollectionView } from 'marionette';
import dayjs from 'dayjs';
import hbs from 'handlebars-inline-precompile';

import { alphaSort } from 'js/utils/sorting';
import intl from 'js/i18n';
import buildMatchersArray from 'js/utils/formatting/build-matchers-array';

import 'scss/modules/buttons.scss';
import 'scss/modules/list-pages.scss';
import 'scss/modules/table-list.scss';

import PreloadRegion from 'js/regions/preload_region';

import Tooltip from 'js/components/tooltip';

import { CheckComponent, DetailsTooltip } from 'js/views/patients/shared/actions_views';

import LayoutTemplate from './layout.hbs';

import './schedule-list.scss';

const LayoutView = View.extend({
  className: 'flex-region',
  template: LayoutTemplate,
  regions: {
    filters: '[data-filters-region]',
    table: '[data-table-region]',
    list: {
      el: '[data-list-region]',
      regionClass: PreloadRegion,
    },
    selectAll: '[data-select-all-region]',
    title: {
      el: '[data-title-region]',
      replaceElement: true,
    },
    dateFilter: '[data-date-filter-region]',
    search: '[data-search-region]',
  },
});

const ScheduleTitleView = View.extend({
  regions: {
    owner: '[data-owner-filter-region]',
  },
  className: 'flex list-page__title-filter',
  template: hbs`
    <span class="list-page__title-icon">{{far "calendar-star"}}</span>
    {{#if showOwnerDroplist}}
      <div class="u-text--nowrap">
        {{ @intl.patients.schedule.scheduleViews.scheduleTitleView.label }}
      </div>
      <div data-owner-filter-region></div>
    {{else}}
      {{formatMessage (intlGet "patients.schedule.scheduleViews.scheduleTitleView.title") owner=name}}
    {{/if}}
    <span class="list-page__header-icon js-title-info">{{far "circle-info"}}</span>
  `,
  ui: {
    tooltip: '.js-title-info',
  },
  templateContext() {
    return {
      showOwnerDroplist: this.getOption('showOwnerDroplist'),
    };
  },
  onRender() {
    new Tooltip({
      message: intl.patients.schedule.scheduleViews.scheduleTitleView.tooltip,
      uiView: this,
      ui: this.ui.tooltip,
      orientation: 'vertical',
    });
  },
});

const AllFiltersButtonView = View.extend({
  tagName: 'button',
  className: 'button--link-large',
  template: hbs`{{far "sliders"}}<span>{{ @intl.patients.schedule.scheduleViews.allFiltersButtonView.allFiltersButton }}</span> {{#if filtersCount}}({{filtersCount}}){{/if}}`,
  triggers: {
    'click': 'click',
  },
  modelEvents: {
    'change': 'render',
  },
  templateContext() {
    return {
      filtersCount: this.model.getFiltersCount(),
    };
  },
});

const SelectAllView = View.extend({
  tagName: 'button',
  className: 'button--checkbox',
  attributes() {
    if (this.getOption('isDisabled')) return { disabled: 'disabled' };
  },
  triggers: {
    'click': 'click',
  },
  getTemplate() {
    if (this.getOption('isSelectAll')) return hbs`{{fas "square-check"}}`;
    if (this.getOption('isSelectNone') || this.getOption('isDisabled')) return hbs`{{fal "square"}}`;

    return hbs`{{fas "square-minus"}}`;
  },
});

const TableHeaderView = View.extend({
  template: hbs`
    <td class="schedule-list__header schedule-list__header-due-date">{{ @intl.patients.schedule.scheduleViews.tableHeaderView.dueDateHeader }}</td>
    <td class="schedule-list__header schedule-list__header-state-patient">{{ @intl.patients.schedule.scheduleViews.tableHeaderView.patientHeader }}</td>
    <td class="schedule-list__header schedule-list__header-action">{{ @intl.patients.schedule.scheduleViews.tableHeaderView.actionHeader }}</td>
    <td class="schedule-list__header schedule-list__header-form">{{ @intl.patients.schedule.scheduleViews.tableHeaderView.formheader }}</td>
  `,
  tagName: 'tr',
});

const DayItemView = View.extend({
  tagName: 'tr',
  className() {
    const className = 'schedule-list__day-list-row';

    if (this.getOption('state').get('isReduced')) return `${ className } is-reduced`;

    return className;
  },
  template: hbs`
    <td class="schedule-list__action-list-cell schedule-list__due-time {{#if isOverdue}}is-overdue{{/if}}">
      {{#unless isReduced}}<span class="u-margin--r-8" data-check-region></span>{{/unless}}
      {{#if due_time}}
        {{formatDateTime due_time "TIME" inputFormat="HH:mm:ss"}}&#8203;
      {{else}}
        <span class="schedule-list__no-time">{{ @intl.patients.schedule.scheduleViews.dayItemView.noTime }}</span>&#8203;
      {{/if}}
    </td>
    <td class="schedule-list__action-list-cell schedule-list__patient">
      <div class="schedule-list__patient-details">
        <span class="schedule-list__patient-sidebar-icon">
          <button class="js-patient-sidebar-button">
            {{far "address-card"}}
          </button>
        </span>&#8203;{{~ remove_whitespace ~}}
        <span class="schedule-list__patient-name {{#if isReduced}}is-reduced{{else}}js-patient{{/if}}">{{ patient.first_name }} {{ patient.last_name }}</span>&#8203;
      </div>
    </td>
    <td class="schedule-list__action-list-cell">
      <div class="schedule-list__action-state-name">
        <span class="schedule-list__action-state action--{{ stateOptions.color }}">{{fa stateOptions.iconType stateOptions.icon}}</span><span class="schedule-list__search-helper">{{ state }}</span>&#8203;{{~ remove_whitespace ~}}
        <span class="{{#unless isReduced}}js-action{{/unless}}">{{ name }}</span>&#8203;{{~ remove_whitespace ~}}
        <span class="schedule-list__search-helper">{{ flow }}</span>&#8203;{{~ remove_whitespace ~}}
      </div>
    </td>
    <td class="schedule-list__action-list-cell schedule-list__action-details" data-details-region></td>
    <td class="schedule-list__action-list-cell schedule-list__action-form">
      {{#if form}}<span class="js-form schedule-list__action-form-icon">{{#if hasOutreach}}{{far "share-from-square"}}{{else}}{{far "square-poll-horizontal"}}{{/if}}</span>{{/if}}
    </td>
  `,
  regions: {
    check: '[data-check-region]',
    details: '[data-details-region]',
  },
  templateContext() {
    const state = this.model.getState();

    return {
      isOverdue: this.model.isOverdue(),
      state: state.get('name'),
      stateOptions: state.get('options'),
      patient: this.model.getPatient().attributes,
      form: this.model.getForm(),
      flow: this.model.getFlow() && this.model.getFlow().get('name'),
      hasOutreach: this.model.hasOutreach(),
      isReduced: this.isReduced,
    };
  },
  ui: {
    'actionName': '.js-action',
  },
  triggers: {
    'click .js-form': 'click:form',
    'click .js-patient-sidebar-button': 'click:patientSidebarButton',
    'click .js-patient': 'click:patient',
    'click': 'click',
  },
  modelEvents: {
    'change': 'render',
  },
  initialize({ state }) {
    this.state = state;
    this.flow = this.model.getFlow();
    this.isReduced = state.get('isReduced');

    this.listenTo(state, {
      'select:multiple': this.showCheck,
      'select:none': this.showCheck,
    });
  },
  onRender() {
    this.showCheck();
    this.showDetailsTooltip();
  },
  toggleSelected(isSelected) {
    this.$el.toggleClass('is-selected', isSelected);
  },
  showCheck() {
    if (this.isReduced) return;

    const isSelected = this.state.isSelected(this.model);
    this.toggleSelected(isSelected);
    const checkComponent = new CheckComponent({ state: { isSelected } });

    this.listenTo(checkComponent, {
      'select'(domEvent) {
        this.triggerMethod('select', this, !!domEvent.shiftKey);
      },
      'change:isSelected': this.toggleSelected,
    });

    this.showChildView('check', checkComponent);
  },
  onClickPatientSidebarButton() {
    const patient = this.model.getPatient();
    Radio.request('sidebar', 'start', 'patient', { patient });
  },
  onClickPatient() {
    Radio.trigger('event-router', 'patient:dashboard', this.model.get('_patient'));
  },
  onClickForm() {
    Radio.trigger('event-router', 'form:patientAction', this.model.id, this.model.getForm().id);
  },
  onClick() {
    if (this.isReduced) return;

    if (this.flow) {
      Radio.trigger('event-router', 'flow:action', this.flow.id, this.model.id);
      return;
    }

    Radio.trigger('event-router', 'patient:action', this.model.get('_patient'), this.model.id);
  },
  showDetailsTooltip() {
    if (!this.model.get('details')) return;

    this.showChildView('details', new DetailsTooltip({ model: this.model }));
  },
});

const DayListView = CollectionView.extend({
  childView: DayItemView,
  childViewOptions() {
    return {
      state: this.state,
    };
  },
  tagName: 'tr',
  className: 'schedule-list__list-row',
  template: hbs`
    <td class="schedule-list__list-cell">
      <div class="schedule-list__row-header">
        <span class="schedule-list__date {{#if isToday}}is-today{{/if}}">{{formatDateTime date "D"}}</span>
        <span class="schedule-list__month-day">{{formatDateTime date "MMM, ddd"}}</span>
      </div>
      <div class="schedule-list__day-list">
        <table class="schedule-list__day-list-table w-100" data-actions-region></table>
      </div>
    </td>
  `,
  templateContext() {
    const date = dayjs(this.model.get('date'));
    const today = dayjs();

    return {
      isToday: date.isSame(today, 'day'),
    };
  },
  childViewContainer: '[data-actions-region]',
  viewComparator(viewA, viewB) {
    // nullVal of 24 to ensure null due_time is last in list and due_time never exceeds 23:59:59
    return alphaSort('asc', viewA.model.get('due_time'), viewB.model.get('due_time'), '24');
  },
  initialize({ state }) {
    this.state = state;

    this.listenTo(state, 'change:searchQuery', this.searchList);
  },
  childViewTriggers: {
    'render': 'listItem:render',
    'select': 'select',
  },
  onSelect(selectedView, isShiftKeyPressed) {
    this.triggerMethod('select:list:item', selectedView, isShiftKeyPressed);
  },
  onListItemRender(view) {
    const date = dayjs(this.model.get('date'));
    view.searchString = `${ date.format('D') } ${ date.format('MMM, ddd') } ${ view.$el.text() }`;
  },
  searchList(state, searchQuery) {
    if (!searchQuery) {
      this.removeFilter();
      return;
    }

    const matchers = buildMatchersArray(searchQuery);

    this.setFilter(function({ searchString }) {
      return every(matchers, function(matcher) {
        return matcher.test(searchString);
      });
    });
  },
});

const EmptyView = View.extend({
  tagName: 'tr',
  template: hbs`
    <td class="table-empty-list">
      <h2>{{ @intl.patients.schedule.scheduleViews.emptyView.noScheduledActions }}</h2>
    </td>
  `,
});

const EmptyFindInListView = View.extend({
  tagName: 'tr',
  template: hbs`
    <td class="table-empty-list">
      <h2>{{ @intl.patients.schedule.scheduleViews.emptyFindInListView.noResults }}</h2>
    </td>
  `,
});

const ScheduleListView = CollectionView.extend({
  tagName: 'table',
  className: 'schedule-list__table',
  childView: DayListView,
  childViewOptions(model) {
    if (!model) return;

    return {
      collection: model.get('actions'),
      state: this.state,
    };
  },
  childViewTriggers: {
    'select:list:item': 'select',
  },
  childViewEvents: {
    'render:children': 'onChildFilter',
  },
  emptyView() {
    if (this.state.get('searchQuery')) {
      return EmptyFindInListView;
    }

    return EmptyView;
  },
  viewComparator(viewA, viewB) {
    return alphaSort('asc', viewA.model.get('date'), viewB.model.get('date'));
  },
  viewFilter(view) {
    if (this.state.get('searchQuery')) {
      return !view.isEmpty();
    }

    // 'null' string is a key from groupBy
    if (view.model.get('date') === 'null') {
      return false;
    }

    return true;
  },
  initialize({ state, originalCollection }) {
    this.state = state;
    this.originalCollection = originalCollection;
  },
  onRenderChildren() {
    this.setVisibleChildren();
  },
  onChildFilter: debounce(function() {
    this.filter();
  }, 10),
  setVisibleChildren() {
    const visibleActions = this.children.reduce((models, cv) => {
      return models.concat(cv.children.pluck('model'));
    }, []);
    this.triggerMethod('filtered', visibleActions);
  },
  onSelect(selectedView, isShiftKeyPressed) {
    const isSelected = this.state.isSelected(selectedView.model);

    const sortedCollection = this.getSortedCollection();
    const indexOfSelectedAction = sortedCollection.findIndex(selectedView.model);

    const lastSelectedIndex = this.state.get('lastSelectedIndex');

    if (isShiftKeyPressed && lastSelectedIndex !== null && !isSelected) {
      this.handleClickShiftMultiSelect(sortedCollection, indexOfSelectedAction, lastSelectedIndex);
      return;
    }

    this.state.toggleSelected(selectedView.model, !isSelected, indexOfSelectedAction);
  },
  handleClickShiftMultiSelect(sortedArrayOfActions, indexOfSelectedAction, lastSelectedIndex) {
    const minIndex = Math.min(indexOfSelectedAction, lastSelectedIndex);
    const maxIndex = Math.max(indexOfSelectedAction, lastSelectedIndex);

    const selectedIds = sortedArrayOfActions.map(action => action.id).slice(minIndex, maxIndex + 1);

    this.state.selectMultiple(selectedIds, indexOfSelectedAction);
  },
  getSortedCollection() {
    const sortedCollection = this.originalCollection;

    sortedCollection.comparator = function(a, b) {
      const dueDateA = a.get('due_date');
      const dueDateB = b.get('due_date');

      if (dueDateA === dueDateB) {
        return alphaSort('asc', a.get('due_time'), b.get('due_time'), '24');
      }

      return alphaSort('asc', dueDateA, dueDateB);
    };

    return sortedCollection.sort();
  },
});

export {
  LayoutView,
  ScheduleTitleView,
  AllFiltersButtonView,
  TableHeaderView,
  ScheduleListView,
  SelectAllView,
};
