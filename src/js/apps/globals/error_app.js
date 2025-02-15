import { bind, contains } from 'underscore';
import Radio from 'backbone.radio';

import RouterApp from 'js/base/routerapp';

import getRootRoute from 'js/utils/root-route';

import { ErrorView } from 'js/views/globals/error/error_views';

const legacyRoots = [
  'worklist',
  'patient',
  'patient-action',
  'flow',
  'schedule',
  'clinicians',
  'dashboards',
  'form',
  'program',
  'programs',
  'program-flow',
];

export default RouterApp.extend({
  eventRoutes: {
    'notFound': {
      action: 'show404',
      route: '404',
      root: true,
    },
    'error': {
      action: 'show500',
      route: '500',
      root: true,
    },
  },

  initialize() {
    this.router.route('*unknown', '404', bind(this.handleUnknown, this));
  },

  viewEvents: {
    'click:back': 'stop',
  },

  onBeforeStop() {
    this.getRegion().empty();
  },

  handleUnknown() {
    const rootRoute = getRootRoute();
    if (contains(legacyRoots, rootRoute)) {
      const workspace = Radio.request('bootstrap', 'currentWorkspace');
      this.replaceUrl(`/${ workspace.get('slug') }${ location.pathname }`);
      return;
    }

    this.start();
    this.show404();
  },
  show404() {
    this.showView(new ErrorView({ is404: true }));
  },
  show500() {
    this.showView(new ErrorView({ is500: true }));
  },
});

