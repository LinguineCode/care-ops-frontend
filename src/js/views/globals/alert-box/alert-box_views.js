import _ from 'underscore';
import { View } from 'marionette';

import anime from 'animejs';

import './alert-box.scss';

import AlertTemplate from './alert-box.hbs';

const OPTIONS = ['type', 'text', 'html', 'hasUndo'];

const icons = {
  success: 'check-circle',
  info: 'info-circle',
  error: 'times-circle',
};

const AlertView = View.extend({
  className: 'alert-box',
  type: 'info',
  template: AlertTemplate,
  triggers: {
    'click .js-dismiss': 'click:dismiss',
    'click .js-undo': 'click:undo',
  },
  initialize(options) {
    this.mergeOptions(options, OPTIONS);
  },
  onAttach() {
    anime({
      targets: this.el,
      duration: 900,
      translateY: [-10, 0],
      opacity: [0, 1],
      easing: 'easeInOutQuad',
    });
  },
  onDestroy() {
    if (this.isDismissed) return;

    this.triggerMethod('dismiss', this);
  },
  onClickDismiss() {
    this.dismiss();
  },
  onClickUndo() {
    this._dismiss();

    this.triggerMethod('undo', this);
  },
  _dismiss() {
    this.isDismissed = true;

    anime({
      targets: this.el,
      opacity: [1, 0],
      duration: 800,
      easing: 'easeInSine',
      complete: _.bind(this.destroy, this),
    });
  },
  dismiss() {
    if (this.isDismissed || this.isDestroyed()) return;

    this._dismiss();

    this.triggerMethod('dismiss', this);
  },
  templateContext() {
    return {
      type: this.type,
      text: this.text,
      html: this.html,
      hasUndo: this.hasUndo,
      iconType: icons[this.type],
    };
  },
});

export { AlertView };
