import hbs from 'handlebars-inline-precompile';
import Backbone from 'backbone';
import Radio from 'backbone.radio';
import { CollectionView, View } from 'marionette';

import Droplist from 'js/components/droplist';

import intl from 'js/i18n';
import { ACCESS_TYPES } from 'js/static';

import './clinician-access.scss';
import './clinician-groups.scss';

const i18n = intl.admin.shared.cliniciansComponents;

const AccessItemTemplate = hbs`<div>{{ name }}</div><div class="clinician-access__details">{{ details }}</div>`;

const AccessComponent = Droplist.extend({
  isCompact: false,
  popWidth() {
    const isCompact = this.getOption('isCompact');

    return isCompact ? null : this.getView().$el.outerWidth();
  },
  picklistOptions: {
    headingText: i18n.accessComponent.headingText,
    itemTemplate: AccessItemTemplate,
  },
  viewOptions() {
    const isCompact = this.getOption('isCompact');

    return {
      modelEvents: {
        'change:access': 'render',
      },
      className() {
        if (isCompact) {
          return 'button-secondary';
        }

        return 'button-secondary w-100';
      },
      template: hbs`{{far "shield"}} {{ name }}`,
    };
  },
  initialize({ model }) {
    this.collection = new Backbone.Collection(ACCESS_TYPES);

    this.setState({ selected: this.collection.get(model.get('access')) });
  },
  onChangeSelected(selected) {
    this.triggerMethod('change:access', selected.id);
  },
});

const RoleItemTemplate = hbs`<a{{#if isSelected}} class="is-selected"{{/if}}>{{matchText name query}} <span class="clinician__role">{{matchText short query}}</span></a>`;

const RoleComponent = Droplist.extend({
  isCompact: false,
  getTemplate() {
    if (this.getOption('isCompact')) {
      return hbs`{{far "user-circle"}}{{ short }}`;
    }

    return hbs`{{far "user-circle"}}{{ name }}{{#unless name}}{{ @intl.admin.shared.cliniciansComponents.roleComponent.defaultText }}{{/unless}}`;
  },
  popWidth() {
    const isCompact = this.getOption('isCompact');

    return isCompact ? null : this.getView().$el.outerWidth();
  },
  picklistOptions: {
    headingText: i18n.roleComponent.headingText,
    itemTemplate: RoleItemTemplate,
    isSelectlist: true,
    attr: 'name',
  },
  viewOptions() {
    const isCompact = this.getOption('isCompact');
    const selected = this.getState('selected');
    return {
      modelEvents: {
        'change:_role': 'render',
      },
      className() {
        if (!selected && isCompact) {
          return 'button-secondary--compact is-icon-only';
        }

        if (isCompact) {
          return 'button-secondary--compact';
        }

        return 'button-secondary w-100';
      },
      template: this.getTemplate(),
    };
  },
  initialize({ model }) {
    const currentOrg = Radio.request('bootstrap', 'currentOrg');
    const roles = currentOrg.getRoles();

    this.collection = roles;

    this.setState({ selected: roles.get(model.get('_role')) });
  },
  onChangeSelected(selected) {
    this.triggerMethod('change:role', selected);
  },
});

const GroupsItemView = View.extend({
  tagName: 'li',
  className: 'clinician-groups__item',
  template: hbs`<span class="clinician-groups__item-icon">{{far "users"}}</span>{{name}}<button class="button--icon clinician-groups__remove js-remove">{{far "trash-alt"}}</button>`,
  triggers: {
    'click .js-remove': 'remove',
  },
});

const ClinicianGroupsView = CollectionView.extend({
  tagName: 'ul',
  childView: GroupsItemView,
  childViewTriggers: {
    'remove': 'remove',
  },
  onRemove(child) {
    this.triggerMethod('remove:clinician', child.model);
  },
});

const GroupsDropList = Droplist.extend({
  initialize() {
    this.listenTo(this.collection, 'update', this.show);
  },
  viewOptions: {
    className: 'button-secondary clinician-groups__droplist',
    template: hbs`{{far "users"}}{{ @intl.admin.shared.cliniciansComponents.groupsDroplist.addGroup }}`,
  },
  picklistOptions: {
    attr: 'name',
  },
  onShow() {
    if (this.getOption('clinician').isNew()) {
      this.setState({ isDisabled: true });
      return;
    }

    this.setState({ isDisabled: this.collection.length === 0 });
  },
  onPicklistSelect({ model }) {
    this.triggerMethod('add:clinician', model);
    this.popRegion.empty();
  },
});

const GroupsComponent = View.extend({
  template: hbs`
    <div data-groups-region></div>
    <div data-droplist-region></div>
  `,
  regions: {
    groups: '[data-groups-region]',
    droplist: '[data-droplist-region]',
  },
  initialize({ clinician }) {
    this.currentClinician = Radio.request('bootstrap', 'currentUser');
    this.clinician = clinician;
    this.clinicianGroups = this.clinician.getGroups();
    this.groups = this.currentClinician.getGroups();

    this.groups.remove(this.clinicianGroups.models);

    this.listenTo(this.clinicianGroups, {
      'add': this.onAddClinicianGroup,
      'remove': this.onRemoveClinicianGroup,
    });
  },
  onRender() {
    this.showGroups();
    this.showDroplist();
  },
  showGroups() {
    const groupsView = this.showChildView('groups', new ClinicianGroupsView({
      collection: this.clinicianGroups,
    }));

    this.listenTo(groupsView, 'remove:clinician', this.removeClinicianGroup);
  },
  showDroplist() {
    const droplist = this.showChildView('droplist', new GroupsDropList({
      collection: this.groups,
      clinician: this.clinician,
    }));

    this.listenTo(droplist, 'add:clinician', this.addClinicianGroup);
  },
  addClinicianGroup(group) {
    this.clinicianGroups.add(group);
    this.groups.remove(group);
    group.addClinician(this.clinician);
  },
  removeClinicianGroup(group) {
    this.clinicianGroups.remove(group);
    this.groups.add(group);
    group.removeClinician(this.clinician);
  },
});

export {
  AccessComponent,
  GroupsComponent,
  RoleComponent,
};
