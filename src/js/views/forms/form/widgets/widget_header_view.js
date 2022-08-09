import { View } from 'marionette';
import hbs from 'handlebars-inline-precompile';

import 'scss/modules/widgets.scss';

import { WidgetCollectionView } from 'js/views/patients/widgets/widgets_views';

import './form-widgets.scss';

const FormWidgetsHeaderView = View.extend({
  className: 'form-widgets flex',
  template: hbs`<div data-widgets-region></div>`,
  regions: {
    widgets: '[data-widgets-region]',
  },
  onRender({ model, collection }) {
    this.showChildView('widgets', new WidgetCollectionView({
      model: model,
      collection: collection,
      className: 'flex flex-wrap',
      itemClassName: 'form-widgets__section',
    }));
  },
});

export {
  FormWidgetsHeaderView,
};
