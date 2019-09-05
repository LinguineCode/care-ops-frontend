import 'js/base/setup';
import 'js/i18n';

import $ from 'jquery';
import Backbone from 'backbone';
import Radio from 'backbone.radio';

import 'sass/provider-core.scss';

import initPlatform from 'js/utils/platform';

import App from 'js/base/app';

import Datepicker from 'js/components/datepicker';
import Droplist from 'js/components/droplist';
import Optionlist from 'js/components/optionlist';
import Tooltip from 'js/components/tooltip';

import 'js/entities-service';

import AlertService from 'js/services/alert';
import AuthService from 'js/services/auth';
import HistoryService from 'js/services/history';
import LastestListService from 'js/services/latest-list';
import ModalService from 'js/services/modal';

import AppFrameApp from 'js/apps/globals/app-frame_app';
import ErrorApp from 'js/apps/globals/error_app';

import { RootView } from 'js/views/globals/root_views';

const $document = $(document);

const Application = App.extend({
  initialize({ token, user }) {
    initPlatform();
  },

  // Before the application starts make sure:
  // - A root layout is attached
  // - Global services are started
  onBeforeStart({ token, user }) {
    new AuthService({ token, user });
    this.setView(new RootView());
    this.getView().appView.getRegion('content').startPreloader();
    this.configComponents();
    this.startServices();
    this.setListeners();
  },

  configComponents() {
    Tooltip.setRegion(this.getRegion('tooltip'));
    const popRegion = this.getRegion('pop');
    Datepicker.setRegion(popRegion);
    Droplist.setPopRegion(popRegion);
    Optionlist.setRegion(popRegion);
  },

  startServices() {
    new AlertService({ region: this.getRegion('alert') });
    new LastestListService();
    new ModalService({
      modalRegion: this.getRegion('modal'),
      modalSmallRegion: this.getRegion('modalSmall'),
    });
  },

  setListeners() {
    $(window).on('resize.app', function() {
      Radio.trigger('user-activity', 'window:resize');
    });

    $document.on('keydown.app', function(evt) {
      Radio.trigger('user-activity', 'document:keydown', evt);
    });

    this.setMouseListeners();
  },

  setMouseListeners() {
    $document.on('mouseover.app', function(evt) {
      Radio.trigger('user-activity', 'document:mouseover', evt);
    });

    /* istanbul ignore next: No need to test jquery functionality */
    $document.on('mouseleave.app', function(evt) {
      Radio.trigger('user-activity', 'document:mouseleave', evt);
    });

    $('body').on('mousedown.app touchstart.app', function(evt) {
      Radio.trigger('user-activity', 'body:down', evt);
    });
  },

  beforeStart() {
    return Radio.request('auth', 'bootstrap');
  },

  onStart() {
    // Ensure Error is the first app initialized
    new ErrorApp({ region: this.getRegion('error') });

    this.addChildApp('appFrame', AppFrameApp);
    this.startChildApp('appFrame', { view: this.getView().appView });

    Backbone.history.start({ pushState: true });

    new HistoryService();
  },

  /* istanbul ignore next: not currently used, but useful API */
  emptyRegion(name) {
    return this.getRegion(name).empty();
  },
});

export default new Application();
