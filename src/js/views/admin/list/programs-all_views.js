import moment from 'moment';

import hbs from 'handlebars-inline-precompile';
import { View, CollectionView } from 'marionette';

import PreloadRegion from 'js/regions/preload_region';

import 'sass/modules/list-pages.scss';
import 'sass/modules/table-list.scss';
import './programs-list.scss';

const EmptyView = View.extend({
  tagName: 'tr',
  template: hbs`
    <td class="table-empty-list">
      <h2>{{ @intl.programs.list.programsAllViews.emptyView }}</h2>
    </td>
  `,
});

const ItemView = View.extend({
  className: 'table-list__item',
  tagName: 'tr',
  template: hbs`
    <td class="table-list__cell w-60">{{ name }}</td>
    <td class="table-list__cell w-20 program--published">
    {{#if published}}<span class="program--on">{{fas "toggle-on"}}<span class="program--words">{{ @intl.programs.list.programsAllViews.itemView.on }}</span></span>
    {{else}}{{far "toggle-off"}}<span class="program--words">{{ @intl.programs.list.programsAllViews.itemView.off }}</span>{{/if}}
    </td>
    <td class="table-list__cell w-20">{{formatMoment updated_at "TIME_OR_DAY"}}</td>
  `,
});

const LayoutView = View.extend({
  className: 'flex-region',
  template: hbs`
    <div class="list-page__header">
      <div class="list-page__title">{{ @intl.programs.list.programsAllViews.layoutView.title }}</div>
    </div>
    <div class="flex-region list-page__list" data-list-region></div>
  `,
  regions: {
    list: {
      el: '[data-list-region]',
      regionClass: PreloadRegion,
    },
  },
});

const ListView = CollectionView.extend({
  className: 'table-list',
  tagName: 'table',
  childView: ItemView,
  viewComparator({ model }) {
    return - moment(model.get('updated_at')).format('X');
  },
  emptyView: EmptyView,
});

export {
  LayoutView,
  ListView,
};
