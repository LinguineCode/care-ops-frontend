import hbs from 'handlebars-inline-precompile';
import { View } from 'marionette';

import IframeFormBehavior from 'js/behaviors/iframe-form';

import { auth0Config } from 'js/config';

import 'scss/modules/buttons.scss';
import 'scss/outreach-core.scss';
import './outreach.scss';

const DialogView = View.extend({
  template: hbs`
    <div><h1 class="site-title">{{ name }}</h1></div>
    <div class="dialog" data-content-region>
      <div class="dialog__icon--success">{{fas "circle-check"}}</div>
      <div>You’ve submitted the form. Nice job.</div>
    </div>
  `,
  templateContext() {
    return {
      name: auth0Config.name,
    };
  },
  regions: {
    content: '[data-content-region]',
  },
});

const iFrameFormView = View.extend({
  behaviors: [IframeFormBehavior],
  regions: {
    formAction: '[data-action-region]',
  },
  template: hbs`
  <div class="form__header">
    <div class="form__title">{{ name }}</div>
    <div data-action-region></div>
  </div>
  <div class="form__content">
    <iframe src="/formapp/"></iframe>
  </div>
  `,
});

const SaveView = View.extend({
  isDisabled: false,
  tagName: 'button',
  className: 'button--green',
  attributes() {
    return {
      disabled: this.getOption('isDisabled'),
    };
  },
  template: hbs`Save`,
  triggers: {
    'click': 'click',
  },
  onClick() {
    this.$el.prop('disabled', true);
  },
});

const LoginView = View.extend({
  ui: {
    date: '.js-date',
    submit: '.js-submit',
  },
  triggers: {
    'change @ui.date': 'change:date',
    'blur @ui.date': 'blur:date',
    'click @ui.submit': 'click:submit',
  },
  modelEvents: {
    'change:hasError': 'render',
  },
  template: hbs`
    <div class="dialog__icon">{{far "lock-keyhole"}}</div>
    <div>Enter your date of birth to access this form.</div>
    <div><input type="date" class="js-date dialog__input{{#if hasError}} has-error{{/if}}" required pattern="\d{4}-\d{2}-\d{2}" placeholder="Your Date of Birth" value="{{ dob }}"></div>
    {{#if hasError}}<div class="dialog__error">That date of birth does not match our records. Please try again.</div>{{/if}}
    <div><button class="button--green dialog__button js-submit" {{#unless dob}}disabled{{/unless}}>Continue to Form {{fas "right-to-bracket"}}</button></div>
  `,
  onChangeDate() {
    const dob = this.ui.date.val();
    this.model.set({ dob });
    this.ui.submit.prop('disabled', !dob);
  },
  onBlurDate() {
    this.model.set({ hasError: false });
  },
});

const ResponseErrorView = View.extend({
  template: hbs`
    <div class="dialog__icon--success">{{fas "circle-check"}}</div>
    <div>This form has already been submitted.</div>
  `,
});

const NotAvailableView = View.extend({
  template: hbs`
    <div class="dialog__icon--warn">{{far "octagon-minus"}}</div>
    <div>This form is no longer shared. Nothing else to do here.</div>
  `,
});

const ErrorView = View.extend({
  template: hbs`
    <div class="dialog__icon--error">{{far "circle-exclamation"}}</div>
    <div>Uh-oh, there was an error. Try reloading the page.</div>
  `,
});

export {
  DialogView,
  iFrameFormView,
  SaveView,
  LoginView,
  ResponseErrorView,
  NotAvailableView,
  ErrorView,
};
