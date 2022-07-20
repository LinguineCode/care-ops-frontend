import { every } from 'underscore';
import Radio from 'backbone.radio';
import hbs from 'handlebars-inline-precompile';
import { View, CollectionView } from 'marionette';

import { alphaSort } from 'js/utils/sorting';
import intl, { renderTemplate } from 'js/i18n';
import underscored from 'js/utils/formatting/underscored';
import buildMatchersArray from 'js/utils/formatting/build-matchers-array';

import 'sass/modules/buttons.scss';
import 'sass/modules/list-pages.scss';
import 'sass/modules/table-list.scss';

import PreloadRegion from 'js/regions/preload_region';

import Droplist from 'js/components/droplist';
import Tooltip from 'js/components/tooltip';

import { ActionTooltipTemplate, ActionEmptyView, ActionItemView } from './action_views';
import { FlowTooltipTemplate, FlowEmptyView, FlowItemView } from './flow_views';
import LayoutTemplate from './layout.hbs';
import TableHeaderTemplate from './table-header.hbs';

import './worklist-list.scss';

const i18n = intl.patients.worklist.worklistViews;

const LayoutView = View.extend({
  className: 'flex-region',
  template: LayoutTemplate,
  regions: {
    dateFilter: '[data-date-filter-region]',
    filters: '[data-filters-region]',
    toggle: '[data-toggle-region]',
    sort: '[data-sort-region]',
    table: '[data-table-region]',
    list: {
      el: '[data-list-region]',
      regionClass: PreloadRegion,
    },
    selectAll: '[data-select-all-region]',
    title: '[data-title-region]',
    search: '[data-search-region]',
  },
  childViewEvents: {
    'update:listDom': 'fixWidth',
  },
  triggers: {
    'click @ui.select': 'click:select',
  },
  ui: {
    listHeader: '.js-list-header',
    list: '.js-list',
    select: '.js-select',
  },
  initialize() {
    const userActivityCh = Radio.channel('user-activity');
    this.listenTo(userActivityCh, 'window:resize', this.fixWidth);
  },
  fixWidth() {
    /* istanbul ignore if */
    if (!this.isRendered()) return;

    const headerWidth = this.ui.listHeader.width();
    const listWidth = this.ui.list.contents().width();
    const listPadding = parseInt(this.ui.list.css('paddingRight'), 10);
    const scrollbarWidth = headerWidth - listWidth;

    this.ui.list.css({ paddingRight: `${ listPadding - scrollbarWidth }px` });
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
    if (this.getOption('isSelectAll')) return hbs`{{fas "check-square"}}`;
    if (this.getOption('isSelectNone') || this.getOption('isDisabled')) return hbs`{{fal "square"}}`;

    return hbs`{{fas "minus-square"}}`;
  },
});

const TypeToggleView = View.extend({
  template: hbs`
    <button class="{{#unless isFlowList}}button--blue{{/unless}} button-filter button__group js-toggle-actions">{{far "file-alt"}}<span>{{ @intl.patients.worklist.worklistViews.typeToggleView.actionsButton }}</span></button>{{~ remove_whitespace ~}}
    <button class="{{#if isFlowList}}button--blue{{/if}} button-filter button__group js-toggle-flows">{{fas "folder"}}<span>{{ @intl.patients.worklist.worklistViews.typeToggleView.flowsButton }}</span></button>
  `,
  templateContext() {
    return {
      isFlowList: this.getOption('isFlowList'),
    };
  },
  triggers: {
    'click .js-toggle-actions': 'click:toggleActions',
    'click .js-toggle-flows': 'click:toggleFlows',
  },
  ui: {
    buttons: 'button',
  },
  onClickToggleActions() {
    this.triggerMethod('toggle:listType', 'actions');
  },
  onClickToggleFlows() {
    this.triggerMethod('toggle:listType', 'flows');
  },
});

const ListTitleView = View.extend({
  template: hbs`
    <span class="list-page__title-icon">{{far "list"}}</span>{{formatMessage (intlGet "patients.worklist.worklistViews.listTitleView.listTitles") title=worklistId role=role owner=owner}}{{~ remove_whitespace ~}}
    <span class="list-page__header-icon js-title-info">{{fas "info-circle"}}</span>
  `,
  ui: {
    tooltip: '.js-title-info',
  },
  templateContext() {
    return {
      role: this.getOption('role').get('name'),
      owner: this.getOption('owner').get('name'),
      worklistId: underscored(this.getOption('worklistId')),
      isFlowList: this.getOption('isFlowList'),
    };
  },
  onRender() {
    const tooltipTemplate = this.getOption('isFlowList') ? FlowTooltipTemplate : ActionTooltipTemplate;
    new Tooltip({
      message: renderTemplate(tooltipTemplate, this.templateContext()),
      uiView: this,
      ui: this.ui.tooltip,
      orientation: 'vertical',
    });
  },
});

const TableHeaderView = View.extend({
  template: TableHeaderTemplate,
  tagName: 'tr',
  templateContext() {
    return {
      isFlowList: this.getOption('isFlowList'),
    };
  },
});

const EmptyFindInListView = View.extend({
  tagName: 'tr',
  template: hbs`
    <td class="table-empty-list">
      <h2>{{ @intl.patients.worklist.worklistViews.emptyFindInListView.noResults }}</h2>
    </td>
  `,
});

const ListView = CollectionView.extend({
  className: 'table-list',
  tagName: 'table',
  childView() {
    return this.isFlowList ? FlowItemView : ActionItemView;
  },
  emptyView() {
    if (this.state.get('searchQuery')) {
      return EmptyFindInListView;
    }

    return this.isFlowList ? FlowEmptyView : ActionEmptyView;
  },
  childViewOptions() {
    return {
      state: this.state,
    };
  },
  childViewTriggers: {
    'render': 'listItem:render',
    'click:patientSidebarButton': 'click:patientSidebarButton',
    'click:shiftMultiSelect': 'click:shiftMultiSelect',
  },
  onListItemRender(view) {
    view.searchString = view.$el.text();
  },
  initialize({ state }) {
    this.state = state;
    this.isFlowList = state.isFlowType();

    this.listenTo(state, 'change:searchQuery', this.searchList);
  },
  onAttach() {
    this.triggerMethod('update:listDom', this);
  },
  /* istanbul ignore next: future proof */
  onRenderChildren() {
    if (!this.isAttached()) return;
    this.triggerMethod('update:listDom', this);
    this.triggerMethod('filtered', this.children.map('model'));
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
  onClickShiftMultiSelect(selectedModelId) {
    const lastSelectedId = this.state.get('lastSelectedId');

    const selectedCollection = this.collection.clone();
    selectedCollection.reset(this.children.map('model'));

    const selectedIndex = selectedCollection.findIndex({ id: selectedModelId });
    const lastSelectedIndex = selectedCollection.findIndex({ id: lastSelectedId });

    const minIndex = Math.min(selectedIndex, lastSelectedIndex);
    const maxIndex = Math.max(selectedIndex, lastSelectedIndex);

    selectedCollection.reset(selectedCollection.slice(minIndex, maxIndex + 1));

    this.state.selectMultiple(selectedCollection, selectedModelId);
  },
});

const sortDueOptions = [
  {
    id: 'sortDueAsc',
    text: i18n.sortDueOptions.asc,
    comparator(a, b) {
      const dueA = a.model.get('due_date');
      const dueB = b.model.get('due_date');
      if (dueA === dueB) {
        return alphaSort('asc', a.model.get('due_time'), b.model.get('due_time'));
      }
      return alphaSort('asc', dueA, dueB);
    },
  },
  {
    id: 'sortDueDesc',
    text: i18n.sortDueOptions.desc,
    comparator(a, b) {
      const dueA = a.model.get('due_date');
      const dueB = b.model.get('due_date');
      if (dueA === dueB) {
        return alphaSort('desc', a.model.get('due_time'), b.model.get('due_time'));
      }
      return alphaSort('desc', dueA, dueB);
    },
  },
];

const sortPatientOptions = [
  {
    id: 'sortPatientAsc',
    text: i18n.sortPatientOptions.asc,
    comparator(a, b) {
      return alphaSort('asc', a.model.getPatient().getSortName(), b.model.getPatient().getSortName());
    },
  },
  {
    id: 'sortPatientDesc',
    text: i18n.sortPatientOptions.desc,
    comparator(a, b) {
      return alphaSort('desc', a.model.getPatient().getSortName(), b.model.getPatient().getSortName());
    },
  },
];

const sortUpdateOptions = [
  {
    id: 'sortUpdateAsc',
    text: i18n.sortUpdateOptions.asc,
    comparator(a, b) {
      return alphaSort('asc', a.model.get('updated_at'), b.model.get('updated_at'));
    },
  },
  {
    id: 'sortUpdateDesc',
    text: i18n.sortUpdateOptions.desc,
    comparator(a, b) {
      return alphaSort('desc', a.model.get('updated_at'), b.model.get('updated_at'));
    },
  },
];

const sortCreatedOptions = [
  {
    id: 'sortCreatedAsc',
    text: i18n.sortCreatedOptions.asc,
    comparator(a, b) {
      return alphaSort('asc', a.model.get('created_at'), b.model.get('created_at'));
    },
  },
  {
    id: 'sortCreatedDesc',
    text: i18n.sortCreatedOptions.desc,
    comparator(a, b) {
      return alphaSort('desc', a.model.get('created_at'), b.model.get('created_at'));
    },
  },
];

const SortDroplist = Droplist.extend({
  align: 'right',
  popWidth: 248,
  picklistOptions: {
    headingText: i18n.sortDroplist.headingText,
  },
  viewOptions: {
    className: 'button-filter',
    template: hbs`{{far "sort-alt"}}{{text}}{{far "angle-down"}}`,
  },
});

export {
  LayoutView,
  ListTitleView,
  SelectAllView,
  ListView,
  TableHeaderView,
  SortDroplist,
  TypeToggleView,
  sortCreatedOptions,
  sortDueOptions,
  sortPatientOptions,
  sortUpdateOptions,
};
