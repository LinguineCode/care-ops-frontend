import Backbone from 'backbone';
import Radio from 'backbone.radio';

import App from 'js/base/app';

import { LayoutView } from 'js/views/patients/sidebar/action/action-sidebar_views';
import { CommentFormView } from 'js/views/patients/shared/comments_views';
import { ActivitiesView, TimestampsView } from 'js/views/patients/sidebar/action/action-sidebar-activity-views';

export default App.extend({
  onBeforeStart({ action, isShowingForm }) {
    this.action = action;

    this.showView(new LayoutView({
      action: this.action,
      isShowingForm,
    }));

    if (!this.action.isNew()) this.getRegion('activity').startPreloader();
  },
  beforeStart() {
    if (this.action.isNew()) return;

    return [
      Radio.request('entities', 'fetch:actionEvents:collection', this.action.id),
      Radio.request('entities', 'fetch:comments:collection:byAction', this.action.id),
      Radio.request('entities', 'fetch:program:model:byAction', this.action.id),
    ];
  },
  onStart(options, [activity] = [], [comments] = []) {
    if (!this.action.isNew()) {
      this.activityCollection = new Backbone.Collection([...activity.models, ...comments.models]);
      this.showActivity();
    }

    this.showNewCommentForm();
  },
  showActivity() {
    this.showChildView('activity', new ActivitiesView({
      collection: this.activityCollection,
      model: this.action,
    }));
    const createdEvent = this.activityCollection.find({ type: 'ActionCreated' });

    this.showChildView('timestamps', new TimestampsView({ model: this.action, createdEvent }));
  },
  showNewCommentForm() {
    const clinician = Radio.request('bootstrap', 'currentUser');

    const newCommentFormView = this.showChildView('comment', new CommentFormView({
      model: Radio.request('entities', 'comments:model', {
        _action: this.action.id,
        _clinician: clinician.id,
      }),
    }));

    this.listenTo(newCommentFormView, {
      'post:comment': this.onPostNewComment,
      'cancel:comment': this.onCancelNewComment,
    });
  },
  viewEvents: {
    'save': 'onSave',
    'close': 'stop',
    'delete': 'onDelete',
    'click:form': 'onClickForm',
  },
  onSave({ model }) {
    if (model.isNew()) {
      this.action.saveAll(model.attributes).done(() => {
        Radio.trigger('event-router', 'patient:action', this.action.get('_patient'), this.action.id);
      });
      return;
    }

    this.action.save(model.pick('name', 'details'));
  },
  onDelete() {
    this.action.destroy();
    this.stop();
  },
  onStop() {
    this.action.trigger('editing', false);
    if (this.action && this.action.isNew()) this.action.destroy();

    Radio.request('sidebar', 'close');
  },
  onClickForm(form) {
    Radio.trigger('event-router', 'form:patientAction', this.action.id, form.id);
  },
  onPostNewComment({ model }) {
    model.save();
    this.activityCollection.add(model);
    this.showNewCommentForm();
  },
  onCancelNewComment() {
    this.showNewCommentForm();
  },
});
