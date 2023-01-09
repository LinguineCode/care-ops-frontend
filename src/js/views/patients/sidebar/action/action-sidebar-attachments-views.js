import hbs from 'handlebars-inline-precompile';
import { View, CollectionView } from 'marionette';

import { alphaSort } from 'js/utils/sorting';

import 'scss/modules/sidebar.scss';

import './action-sidebar.scss';

const AttachmentView = View.extend({
  className: 'u-margin--t-16',
  modelEvents: {
    'change: _progress': 'render',
    'change: _download': 'render',
  },
  downloadTemplate: hbs`
    <a class="action-sidebar__attachment-filename" target="_blank" href="{{_view}}">{{filename}}</a>
    <div>
      <a class="action-sidebar__attachment-download" href="{{_download}}" download>
        {{far "download"}} <span>{{ @intl.patients.sidebar.action.actionSidebarAttachmentsViews.attachmentView.downloadText }}</span>
      </a>
    </div>
  `,
  uploadTemplate: hbs`
    <div class="action-sidebar__attachment-filename">{{filename}}</div>
    <progress value="_progress" max="100" class="action-sidebar__attachment-progress"></progress>
  `,
  getTemplate() {
    if (this.get('_download')) {
      return this.downloadTemplate;
    }
    return this.uploadTemplate;
  },
  templateContext() {
    return {
      filename: this.model.getFilename(),
    };
  },
});

const AttachmentsView = CollectionView.extend({
  className: 'u-margin--t-24',
  template: hbs`
    <div class="sidebar__attachments">
      <h3 class="sidebar__heading">
        {{far "paperclip"}}<span class="u-margin--l-8">{{ @intl.patients.sidebar.action.actionSidebarAttachmentsViews.attachmentsViews.attachmentsHeadingText }}</span>
      </h3>
      <div data-attachments-files-region></div>
      <button class="button-primary u-margin--t-16 js-add">{{far "paperclip"}}<span>{{ @intl.patients.sidebar.action.actionSidebarAttachmentsViews.attachmentsViews.addAttachment }}</span></button>
    </div>
  `,
  childViewContainer: '[data-attachments-files-region]',
  childView: AttachmentView,
  viewComparator(viewA, viewB) {
    return alphaSort('desc', viewA.model.get('created_at'), viewB.model.get('created_at'));
  },
  viewFilter({ model }) {
    return !model.isNew() || !model.get('_download');
  },
  triggers: {
    'click .js-add': 'click:add',
  },
});

export {
  AttachmentsView,
};
