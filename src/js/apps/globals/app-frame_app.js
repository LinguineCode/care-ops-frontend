import { partial, invoke, defer, some } from 'underscore';
import Radio from 'backbone.radio';
import Backbone from 'backbone';

import App from 'js/base/app';

import SidebarService from 'js/services/sidebar';

import NavApp from './nav_app';
import FormsApp from 'js/apps/forms/forms-main_app';
import PatientsMainApp from 'js/apps/patients/patients-main_app';
import ReducedPatientsMainApp from 'js/apps/patients/reduced-patients-main_app.js';
import CliniciansMainApp from 'js/apps/clinicians/clinicians-main_app';
import DashboardsMainApp from 'js/apps/dashboards/dashboards-main_app';
import ProgramsMainApp from 'js/apps/programs/programs-main_app';

export default App.extend({
  routers: [],
  onBeforeStart() {
    this.currentWorkspace = Radio.request('bootstrap', 'currentWorkspace');
    this.getRegion('content').empty();

    if (this.isRestarting()) return;

    new NavApp({ region: this.getRegion('nav') });
    new SidebarService({ region: this.getRegion('sidebar') });

    this.listenTo(Radio.channel('bootstrap'), 'change:workspace', this.restart);
  },
  beforeStart() {
    return [
      Radio.request('entities', 'fetch:clinicians:byWorkspace', this.currentWorkspace.id),
      Radio.request('entities', 'fetch:states:collection'),
      Radio.request('entities', 'fetch:forms:collection'),
    ];
  },
  onStart(options, clinicians) {
    this.currentWorkspace.updateClinicians(clinicians);

    const currentUser = Radio.request('bootstrap', 'currentUser');

    this.startPatientsMain(currentUser);

    if (currentUser.can('dashboards:view')) {
      this.initRouter(DashboardsMainApp);
    }

    if (currentUser.can('clinicians:manage')) {
      this.initRouter(CliniciansMainApp);
    }

    if (currentUser.can('programs:manage')) {
      this.initRouter(ProgramsMainApp);
    }

    this.initFormsApp();

    // Handles the route after the async app-frame start
    defer(() => {
      Backbone.history.loadUrl();
      if (!some(this.routers, router => router.isRunning())) {
        Radio.trigger('event-router', 'notFound');
      }
    });
  },
  onStop() {
    invoke(this.routers, 'destroy');
    this.routers = [];
  },
  initRouter(RouterApp) {
    const router = new RouterApp({ region: this.getRegion('content') });
    this.routers.push(router);
    return router;
  },
  startPatientsMain(currentUser) {
    if (currentUser.can('app:schedule:reduced')) {
      this.initRouter(ReducedPatientsMainApp);
      return;
    }

    this.initRouter(PatientsMainApp);
  },
  initFormsApp() {
    const formsApp = this.initRouter(FormsApp);

    this.listenTo(formsApp, {
      start: partial(this.toggleNav, false),
      stop: partial(this.toggleNav, true),
    });
  },
  toggleNav(shouldShow) {
    if (!this.isRunning()) return;

    this.getView().toggleNav(!!shouldShow);
  },
});
