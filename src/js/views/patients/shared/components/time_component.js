import _ from 'underscore';
import moment from 'moment';
import Backbone from 'backbone';
import hbs from 'handlebars-inline-precompile';

import 'sass/modules/buttons.scss';

import intl from 'js/i18n';

import Droplist from 'js/components/droplist';

import './time-component.scss';

const i18n = intl.patients.shared.components.timeComponent;

// Every 15 mins for 24 hours starting at 7am
const start = moment({ hour: 6, minute: 45, second: 0 });

const times = _.times(96, function() {
  return { id: start.add(15, 'minutes').format('HH:mm:ss') };
});

const NoTimeCompactTemplate = hbs`{{far "clock"}}`;

const TimeTemplate = hbs`{{far "clock"}} {{formatMoment id "LT" inputFormat="HH:mm:ss" defaultHtml=(intlGet "patients.shared.components.timeComponent.placeholderText")}}`;

export default Droplist.extend({
  collection: new Backbone.Collection(times),
  align: 'right',
  popWidth: 192,
  isCompact: false,
  isSelectlist: true,
  getClassName(time, isCompact) {
    if (!time && isCompact) {
      return 'button-secondary--compact time-component is-icon-only';
    }
    if (isCompact) {
      return 'button-secondary--compact time-component ';
    }

    return 'button-secondary time-component w-100';
  },
  getTemplate(time, isCompact) {
    if (!time && isCompact) {
      return NoTimeCompactTemplate;
    }

    return TimeTemplate;
  },
  viewOptions() {
    const isCompact = this.getOption('isCompact');
    const selected = this.getState('selected');
    const time = selected ? selected.id : null;

    return {
      className: this.getClassName(time, isCompact),
      template: this.getTemplate(time, isCompact),
    };
  },
  picklistOptions: {
    canClear: true,
    clearText: i18n.clear,
    headingText: i18n.headingText,
    placeholderText: i18n.placeholderText,
    isSelectlist: true,
    itemTemplateContext() {
      return {
        text: moment(this.model.id, 'HH:mm:ss').format('LT'),
      };
    },
  },
  initialize({ time }) {
    const selected = this.collection.get(time);

    this.setState({ selected });
  },
  onChangeSelected(selected) {
    const time = selected ? selected.id : null;

    this.triggerMethod('change:time', time);
  },
});
