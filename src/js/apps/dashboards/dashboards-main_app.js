import RouterApp from 'js/base/routerapp';

import DashboardsAllApp from 'js/apps/dashboards/dashboards-all_app';
import DashboardApp from 'js/apps/dashboards/dashboard_app';

export default RouterApp.extend({
  routerAppName: 'DashboardsApp',

  childApps: {
    dashboardsAll: DashboardsAllApp,
    dashboard: DashboardApp,
  },

  eventRoutes: {
    'dashboards:all': {
      action: 'showDashboardsAll',
      route: 'dashboards',
      isList: true,
    },
    'dashboard': {
      action: 'showDashboard',
      route: 'dashboards/:id',
    },
  },

  showDashboardsAll() {
    this.startCurrent('dashboardsAll');
  },
  showDashboard(dashboardId) {
    this.startCurrent('dashboard', { dashboardId });
  },
});
