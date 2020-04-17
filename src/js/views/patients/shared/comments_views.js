import _ from 'underscore';
import hbs from 'handlebars-inline-precompile';
import { View } from 'marionette';

import 'sass/modules/comments.scss';

import intl from 'js/i18n';

import InputWatcherBehavior from 'js/behaviors/input-watcher';


const PostCommentView = View.extend({
  className: 'u-margin--t-8 u-text-align--right',
  template: hbs`
    {{#unless isNew}}<button class="button--text u-float--left comment__delete js-delete"><span class="u-margin--r-4">{{far "trash-alt"}}</span>{{ @intl.patients.shared.commentsViews.postCommentView.deleteBtn }}</button>{{/unless}}
    <button class="button--text u-margin--r-4 js-cancel">{{ @intl.patients.shared.commentsViews.postCommentView.cancelBtn }}</button>
    <button class="button--green js-post" {{#if isDisabled}}disabled{{/if}}>
      {{#if isNew}}
        {{ @intl.patients.shared.commentsViews.postCommentView.postBtn }}
      {{else}}
      {{ @intl.patients.shared.commentsViews.postCommentView.saveBtn }}
      {{/if}}
    </button>
  `,
  templateContext() {
    const isDisabled = !this.model.isValid() || !this.model.hasChanged('message');
    const isNew = this.model.isNew();

    return {
      isDisabled,
      isNew,
    };
  },
  triggers: {
    'click .js-cancel': 'cancel',
    'click .js-post': 'post',
    'click .js-delete': 'delete',
  },
});

const CommentFormView = View.extend({
  behaviors: [InputWatcherBehavior],
  ui: {
    input: '.js-input',
    spacer: '.js-spacer',
  },
  template: hbs`
    <div class="flex">
      <span class="comment__author-label">{{ initials }}</span>
      <div class="flex-grow pos--relative">
        <textarea class="input-secondary textarea-flex__input js-input" placeholder="{{ @intl.patients.shared.commentsViews.commentFormView.placeholder }}">{{ message }}</textarea>
        <div class="textarea-flex__container input-secondary comment__input js-spacer">{{ message }}</div>
      </div>
    </div>
    <div data-post-region></div>
  `,
  regions: {
    post: '[data-post-region]',
  },
  childViewTriggers: {
    'post': 'post:comment',
    'cancel': 'cancel:comment',
    'delete': 'confirm:delete',
  },
  templateContext() {
    const clinician = this.model.getClinician();
    return {
      initials: clinician.getInitials(),
    };
  },
  initialize() {
    this.listenTo(this.model, 'change:message', this.showPostView);
  },
  onRender() {
    this.showPostView();
  },
  onWatchChange(text) {
    this.ui.input.val(text);
    this.ui.spacer.text(text || ' ');

    this.model.set('message', _.trim(text));
  },
  showPostView() {
    this.showChildView('post', new PostCommentView({ model: this.model }));
  },
  onConfirmDelete() {
    const modal = Radio.request('modal', 'show:small', {
      bodyText: intl.patients.shared.commentsViews.commentFormView.deleteModal.bodyText,
      headingText: intl.patients.shared.commentsViews.commentFormView.deleteModal.headingText,
      submitText: intl.patients.shared.commentsViews.commentFormView.deleteModal.submitText,
      buttonClass: 'button--red',
      onSubmit: () => {
        modal.destroy();
        this.triggerMethod('delete:comment', this.model);
      },
    });
  },
});

export {
  CommentFormView,
};
