import { clone, extend, keys, omit, reduce, each, filter, contains } from 'underscore';
import store from 'store';
import Backbone from 'backbone';
import Radio from 'backbone.radio';
import dayjs from 'dayjs';
import { NIL as NIL_UUID } from 'uuid';

import { RELATIVE_DATE_RANGES } from 'js/static';

const relativeRanges = new Backbone.Collection(RELATIVE_DATE_RANGES);

export const STATE_VERSION = 'v4';

export default Backbone.Model.extend({
  defaults() {
    return {
      isFiltering: false,
      filters: {
        states: [],
      },
      clinicianId: this.currentClinician.id,
      dateFilters: {
        dateType: 'due_date',
        selectedDate: null,
        selectedMonth: null,
        selectedWeek: null,
        relativeDate: null,
      },
      lastSelectedIndex: null,
      selectedActions: {},
      searchQuery: '',
    };
  },
  preinitialize() {
    this.currentOrg = Radio.request('bootstrap', 'currentOrg');
    this.states = this.currentOrg.getStates();

    this.currentClinician = Radio.request('bootstrap', 'currentUser');
    this.groups = this.currentClinician.getGroups();
  },
  initialize() {
    this.on('change', this.onChange);
  },
  onChange() {
    store.set(`schedule_${ this.currentClinician.id }-${ STATE_VERSION }`, omit(this.attributes, 'searchQuery', 'isFiltering'));
  },
  getFilters() {
    return clone(this.get('filters'));
  },
  getDefaultStatesFilter() {
    return this.states;
  },
  setDefaultFilterStates() {
    const notDoneStates = this.states.groupByDone().notDone;
    this.set({ filters: { states: notDoneStates.map('id') } });
  },
  getSelectedStates() {
    const defaultStatesFilterIds = this.getDefaultStatesFilter().map('id');
    const selectedStates = this.getFilters().states;

    // remove any invalid state ids (i.e. ids that don't belong to any default states)
    return filter(selectedStates, id => contains(defaultStatesFilterIds, id)).join();
  },
  getDateFilters() {
    return clone(this.get('dateFilters'));
  },
  getEntityDateFilter() {
    const { selectedDate, selectedMonth, selectedWeek, relativeDate } = this.getDateFilters();

    if (selectedDate) {
      return {
        due_date: this.formatDateRange(selectedDate, 'day'),
      };
    }

    if (selectedMonth) {
      return {
        due_date: this.formatDateRange(selectedMonth, 'month'),
      };
    }

    if (selectedWeek) {
      return {
        due_date: this.formatDateRange(selectedWeek, 'week'),
      };
    }

    const { prev, unit } = relativeRanges.get(relativeDate || 'thismonth').pick('prev', 'unit');
    const relativeRange = dayjs().subtract(prev, unit);

    return {
      due_date: this.formatDateRange(relativeRange, unit),
    };
  },
  getEntityFilter() {
    const filtersState = this.getFilters();
    const clinicianId = this.get('clinicianId');
    const customFilters = omit(filtersState, 'groupId', 'states');
    const selectedStates = this.getSelectedStates();

    const dateFilter = this.getEntityDateFilter();

    const filters = extend({
      clinician: clinicianId,
      state: selectedStates,
    }, dateFilter);

    filters.state = selectedStates || NIL_UUID;

    if (this.groups.length) {
      filters.group = filtersState.groupId || this.groups.pluck('id').join(',');
    }

    each(customFilters, (selected, slug) => {
      if (selected === null) return;

      filters[`@${ slug }`] = selected;
    });

    return filters;
  },
  formatDateRange(date, rangeType) {
    const dateFormat = 'YYYY-MM-DD';

    return `${ dayjs(date).startOf(rangeType).format(dateFormat) },${ dayjs(date).endOf(rangeType).format(dateFormat) }`;
  },
  toggleSelected(model, isSelected, selectedIndex) {
    const currentSelectedList = clone(this.get('selectedActions'));
    const newSelectedList = extend(currentSelectedList, {
      [model.id]: isSelected,
    });

    this.set({
      selectedActions: newSelectedList,
      lastSelectedIndex: isSelected ? selectedIndex : null,
    });
  },
  isSelected(model) {
    return !!this.get('selectedActions')[model.id];
  },
  getSelected(collection) {
    const list = this.get('selectedActions');
    const collectionSelected = reduce(keys(list), (selected, item) => {
      if (list[item] && collection.get(item)) {
        selected.push({
          id: item,
        });
      }

      return selected;
    }, []);

    return Radio.request('entities', 'actions:collection', collectionSelected);
  },
  clearSelected() {
    this.set({
      selectedActions: {},
      lastSelectedIndex: null,
    });

    this.trigger('select:none');
  },
  selectMultiple(selectedIds, newLastSelectedIndex = null) {
    const currentSelectedList = this.get('selectedActions');

    const newSelectedList = selectedIds.reduce((selected, id) => {
      selected[id] = true;
      return selected;
    }, clone(currentSelectedList));

    this.set({
      selectedActions: newSelectedList,
      lastSelectedIndex: newLastSelectedIndex,
    });

    this.trigger('select:multiple');
  },
});
