import $ from 'jquery';
import { extend } from 'underscore';
import Radio from 'backbone.radio';
import Store from 'backbone.store';
import dayjs from 'dayjs';

import BaseCollection from 'js/base/collection';
import BaseModel from 'js/base/model';
import JsonApiMixin from 'js/base/jsonapi-mixin';

import { alphaSort } from 'js/utils/sorting';
import trim from 'js/utils/formatting/trim';

const TYPE = 'patient-actions';
const { parseRelationship } = JsonApiMixin;

const _parseRelationship = function(relationship, key) {
  if (!relationship || key === 'owner') return relationship;

  return parseRelationship(relationship, key);
};

const _Model = BaseModel.extend({
  urlRoot() {
    if (this.isNew()) return `/api/patients/${ this.get('_patient') }/relationships/actions`;

    return '/api/actions';
  },
  type: TYPE,
  validate({ name }) {
    if (!trim(name)) return 'Action name required';
  },
  getForm() {
    const formId = this.get('_form');
    if (!formId) return;
    return Radio.request('entities', 'forms:model', formId);
  },
  getFormResponses() {
    return Radio.request('entities', 'formResponses:collection', this.get('_form_responses'), {
      comparator(responseA, responseB) {
        return alphaSort('desc', responseA.get('_created_at'), responseB.get('_created_at'));
      },
    });
  },
  getPatient() {
    return Radio.request('entities', 'patients:model', this.get('_patient'));
  },
  getOwner() {
    const owner = this.get('_owner');
    return Radio.request('entities', `${ owner.type }:model`, owner.id);
  },
  getFlow() {
    if (!this.get('_flow')) return;

    return Radio.request('entities', 'flows:model', this.get('_flow'));
  },
  getState() {
    return Radio.request('entities', 'states:model', this.get('_state'));
  },
  isDone() {
    const state = this.getState();
    return state.get('status') === 'done';
  },
  isOverdue() {
    if (this.isDone()) return false;

    const date = this.get('due_date');
    const time = this.get('due_time');
    const dueDateTime = dayjs(`${ date } ${ time }`);

    if (!time) return dueDateTime.isBefore(dayjs(), 'day');

    return dueDateTime.isBefore(dayjs(), 'day') || dueDateTime.isBefore(dayjs(), 'minute');
  },
  saveDueDate(date) {
    if (!date) {
      return this.save({ due_date: null, due_time: null });
    }
    return this.save({ due_date: date.format('YYYY-MM-DD') });
  },
  saveDueTime(time) {
    if (!time) {
      return this.save({ due_time: null });
    }
    return this.save({ due_time: time });
  },
  saveState(state) {
    return this.save({ _state: state.id }, {
      relationships: {
        state: this.toRelation(state),
      },
    });
  },
  saveOwner(owner) {
    return this.save({ _owner: owner }, {
      relationships: {
        owner: this.toRelation(owner),
      },
    });
  },
  saveAll(attrs) {
    if (this.isNew()) attrs = extend({}, this.attributes, attrs);

    const relationships = {
      'form': this.toRelation(attrs._form, 'forms'),
      'owner': this.toRelation(attrs._owner),
      'state': this.toRelation(attrs._state, 'states'),
      'program-action': this.toRelation(attrs._program_action, 'program-actions'),
    };

    return this.save(attrs, { relationships }, { wait: true });
  },
  parseRelationship: _parseRelationship,
});

const Model = Store(_Model, TYPE);
const Collection = BaseCollection.extend({
  url: '/api/actions',
  model: Model,
  parseRelationship: _parseRelationship,
  save(attrs) {
    const saves = this.invoke('saveAll', attrs);

    return $.when(...saves);
  },
  getPatients() {
    return Radio.request('entities', 'patients:collection', this.invoke('getPatient'));
  },
});

export {
  _Model,
  Model,
  Collection,
};
