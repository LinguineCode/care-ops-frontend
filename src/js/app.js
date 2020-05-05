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
import BootstrapService from 'js/services/bootstrap';
import HistoryService from 'js/services/history';
import LastestListService from 'js/services/latest-list';
import ModalService from 'js/services/modal';

import AppFrameApp from 'js/apps/globals/app-frame_app';
import ErrorApp from 'js/apps/globals/error_app';

import { RootView } from 'js/views/globals/root_views';
import { PreloaderView } from 'js/views/globals/prelogin/prelogin_views';

const $document = $(document);

const Application = App.extend({
  initialize() {
    initPlatform();
  },

  // Before the application starts make sure:
  // - A root layout is attached
  // - Global services are started
  onBeforeStart({ name }) {
    new BootstrapService({ name });
    this.setView(new RootView());
    this.configComponents();
    this.startServices();
    this.setListeners();
    // Ensure Error is the first app initialized
    new ErrorApp({ region: this.getRegion('error') });
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
    this.setHotkeyListeners();
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

  setHotkeyListeners() {
    // https://github.com/jeresig/jquery.hotkeys
    $document.on('keydown.app', null, '/', function(evt) {
      Radio.trigger('hotkey', 'search', evt);
    });

    $document.on('keydown.app', null, 'esc', function(evt) {
      Radio.trigger('hotkey', 'close', evt);
    });
  },

  beforeStart() {
    return Radio.request('bootstrap', 'fetch');
  },

  onStart(options, currentUser) {
    if (!currentUser.isActive()) {
      this.getRegion('preloader').show(new PreloaderView({ notSetup: true }));
      return;
    }

    this.emptyRegion('preloader');
    this.addChildApp('appFrame', AppFrameApp);
    this.startChildApp('appFrame', { view: this.getView().appView });

    Backbone.history.start({ pushState: true });

    new HistoryService();
  },

  emptyRegion(name) {
    return this.getRegion(name).empty();
  },
});

export default new Application();
