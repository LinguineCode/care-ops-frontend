import Radio from 'backbone.radio';
import hbs from 'handlebars-inline-precompile';

import { View } from 'marionette';

import PreloadRegion from 'js/regions/preload_region';

import './dashboard.scss';

const ContextTrailView = View.extend({
  className: 'dashboard__context-trail',
  template: hbs`
    <a class="js-back dashboard__context-link">
      {{fas "chevron-left"}}{{ @intl.admin.dashboard.dashboardViews.contextTrailView.contextBackBtn }}
    </a>
    {{fas "chevron-right"}}{{ name }}
  `,
  triggers: {
    'click .js-back': 'click:back',
  },
  onClickBack() {
    Radio.trigger('event-router', 'dashboards:all');
  },
});

const IframeView = View.extend({
  className: 'flex-grow',
  template: hbs`<iframe src="{{ embed_url }}"></iframe>`,
});

const LayoutView = View.extend({
  className: 'dashboard__frame',
  template: hbs`
  <div class="dashboard__layout">
    <div data-context-trail-region></div>
    <div class="dashboard__iframe flex" data-dashboard-region></div>
  </div>
  `,
  regions: {
    contextTrail: {
      el: '[data-context-trail-region]',
      replaceElement: true,
    },
    dashboard: {
      el: '[data-dashboard-region]',
      regionClass: PreloadRegion,
    },
  },
});

export {
  LayoutView,
  ContextTrailView,
  IframeView,
};
