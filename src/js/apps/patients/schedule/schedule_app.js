import { clone, extend } from 'underscore';
import Radio from 'backbone.radio';
import store from 'store';

import App from 'js/base/app';

import intl, { renderTemplate } from 'js/i18n';

import StateModel from './schedule_state';

import FiltersApp from './filters_app';
import BulkEditActionsApp from 'js/apps/patients/sidebar/bulk-edit-actions_app';

import DateFilterComponent from 'js/views/patients/shared/components/date-filter';
import { LayoutView, ScheduleTitleView, TableHeaderView, SelectAllView, ScheduleListView } from 'js/views/patients/schedule/schedule_views';
import { BulkEditButtonView, BulkEditActionsSuccessTemplate, BulkDeleteActionsSuccessTemplate } from 'js/views/patients/shared/bulk-edit/bulk-edit_views';

export default App.extend({
  StateModel,
  childApps: {
    filters: {
      AppClass: FiltersApp,
      regionName: 'filters',
      restartWithParent: false,
      getOptions: ['currentClinician'],
    },
    bulkEditActions: BulkEditActionsApp,
  },
  stateEvents: {
    'change:filters change:dateFilters': 'restart',
    'change:selectedActions': 'onChangeSelected',
  },
  initListState() {
    const currentUser = Radio.request('bootstrap', 'currentUser');
    const storedState = store.get(`schedule_${ currentUser.id }`);
    const filters = this.getState('filters');

    // NOTE: Allows for new defaults to get added to stored filters
    if (storedState) storedState.filters = extend({}, filters, storedState.filters);

    this.setState(extend({ id: `schedule_${ currentUser.id }` }, storedState));
  },
  onBeforeStart() {
    if (this.isRestarting()) {
      this.showScheduleTitle();
      this.getRegion('list').startPreloader();
      return;
    }

    this.initListState();
    this.showView(new LayoutView({
      state: this.getState(),
    }));

    this.getRegion('list').startPreloader();

    this.showScheduleTitle();
    this.showDisabledSelectAll();
    this.startFiltersApp();
    this.showDateFilter();
    this.showTableHeaders();
  },
  beforeStart() {
    const filter = this.getState().getEntityFilter();
    return Radio.request('entities', 'fetch:actions:collection', { filter });
  },
  onStart(options, collection) {
    this.collection = collection;
    this.selected = this.getState().getSelected(this.collection);

    this.showScheduleList();
    this.showSelectAll();
    this.toggleBulkSelect();
  },
  onChangeSelected() {
    this.toggleBulkSelect();
  },
  onClickBulkSelect() {
    if (this.selected.length === this.collection.length) {
      this.getState().clearSelected();
      return;
    }

    this.getState().selectAll(this.collection);
  },
  onClickBulkEdit() {
    const app = this.startChildApp('bulkEditActions', {
      state: { collection: this.selected },
    });

    this.listenTo(app, {
      'save'(saveData) {
        this.selected.save(saveData)
          .done(() => {
            Radio.request('alert', 'show:success', renderTemplate(BulkEditActionsSuccessTemplate, { itemCount: this.selected.length }));
            app.stop();
            this.getState().clearSelected();
          })
          .fail(() => {
            Radio.request('alert', 'show:error', intl.patients.schedule.scheduleApp.bulkEditFailure);
            this.getState().clearSelected();
            this.restart();
          });
      },
      'delete'() {
        const itemCount = this.selected.length;
        this.selected.destroy().then(() => {
          Radio.request('alert', 'show:success', renderTemplate(BulkDeleteActionsSuccessTemplate, { itemCount }));
          app.stop();
          this.getState().clearSelected();
          this.showScheduleList();
        });
      },
    });
  },
  onClickBulkCancel() {
    this.getState().clearSelected();
  },
  showScheduleList() {
    const collectionView = new ScheduleListView({
      collection: this.collection.groupByDate(),
      state: this.getState(),
    });

    this.showChildView('list', collectionView);
  },
  showScheduleTitle() {
    const filters = this.getState().get('filters');
    const owner = Radio.request('entities', 'clinicians:model', filters.clinicianId);

    this.showChildView('title', new ScheduleTitleView({
      model: owner,
    }));
  },
  startFiltersApp() {
    const filtersApp = this.startChildApp('filters', {
      state: this.getState().getFilters(),
    });

    this.listenTo(filtersApp.getState(), 'change', ({ attributes }) => {
      this.setState({ filters: clone(attributes) });
    });
  },
  showDateFilter() {
    const dateTypes = ['due_date'];

    const dateFilterComponent = new DateFilterComponent({
      dateTypes,
      state: this.getState().getDateFilters(),
      region: this.getRegion('dateFilter'),
    });

    this.listenTo(dateFilterComponent.getState(), {
      'change'({ attributes }) {
        this.setState({ dateFilters: clone(attributes) });
      },
    });

    dateFilterComponent.show();
  },
  showTableHeaders() {
    const tableHeadersView = new TableHeaderView();

    this.showChildView('table', tableHeadersView);
  },
  showSelectAll() {
    if (!this.collection.length) {
      this.showDisabledSelectAll();
      return;
    }
    const isSelectAll = this.selected.length === this.collection.length;
    const selectAllView = new SelectAllView({ isSelectAll });

    this.listenTo(selectAllView, 'click', this.onClickBulkSelect);

    this.showChildView('selectAll', selectAllView);
  },
  showDisabledSelectAll() {
    this.showChildView('selectAll', new SelectAllView({ isDisabled: true }));
  },
  showBulkEditButtonView() {
    const bulkEditButtonView = this.showChildView('filters', new BulkEditButtonView({
      collection: this.selected,
    }));

    this.listenTo(bulkEditButtonView, {
      'click:cancel': this.onClickBulkCancel,
      'click:edit': this.onClickBulkEdit,
    });
  },
  toggleBulkSelect() {
    this.selected = this.getState().getSelected(this.collection);

    this.showSelectAll();

    if (this.selected.length) {
      this.getChildApp('filters').stop();
      this.showBulkEditButtonView();
      return;
    }

    this.startFiltersApp();
  },
});
