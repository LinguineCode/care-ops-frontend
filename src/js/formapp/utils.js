/* global Formio, FormioUtils */
import { extend, reduce } from 'underscore';
import { datadogRum } from '@datadog/browser-rum';

// Note: Allows for setting the submission at form instantiation
// https://github.com/formio/formio.js/pull/4580
const webformInit = Formio.Displays.displays.webform.prototype.init;

Formio.Displays.displays.webform.prototype.init = function() {
  if (this.options.data) {
    const data = extend({}, this.options.data);
    this._submission = { data };
    this._data = data;
  }
  webformInit.call(this);
};

// NOTE: Evaluator should throw errors
// https://github.com/formio/formio.js/issues/4613
const evaluator = Formio.Evaluator.evaluator;
Formio.Evaluator.evaluator = function(func, ...params) {
  try {
    return evaluator(func, ...params);
  } catch (e) {
    datadogRum.addError(e);
    /* eslint-disable-next-line no-console */
    if (_DEVELOP_) console.error(e);
  }
};

// NOTE: Evaluate should also throw errors
const evaluate = Formio.Evaluator.evaluate;
Formio.Evaluator.evaluate = function(func, ...params) {
  try {
    return evaluate(func, ...params);
  } catch (e) {
    datadogRum.addError(e);
    /* eslint-disable-next-line no-console */
    if (_DEVELOP_) console.error(e);
  }
};

function getScriptContext(contextScripts, baseContext) {
  return Formio.createForm(document.createElement('div'), {}).then(form => {
    const context = reduce(contextScripts, (memo, script) => {
      return extend({}, memo, FormioUtils.evaluate(script, form.evalContext(memo)));
    }, baseContext);

    form.destroy();

    return context;
  });
}

function getSubmission(formData, formSubmission, reducers, evalContext) {
  return Formio.createForm(document.createElement('div'), {}, { evalContext }).then(form => {
    const submission = reduce(reducers, (memo, reducer) => {
      return FormioUtils.evaluate(reducer, form.evalContext({ formSubmission: memo, formData })) || memo;
    }, formSubmission);

    form.destroy();

    return submission;
  });
}

const hasChangedFunction = 'return function hasChanged(key) { return !_.isEqual(_.get(formSubmission, key), _.get(prevSubmission, key)); }';

function getChangeReducers(form, changeReducers, curSubmission, prevSubmission) {
  return reduce(changeReducers, (memo, reducer) => {
    const context = form.evalContext({ formSubmission: memo, prevSubmission });
    context.hasChanged = FormioUtils.evaluate(hasChangedFunction, context);
    return FormioUtils.evaluate(reducer, context) || memo;
  }, curSubmission);
}

export {
  getScriptContext,
  getSubmission,
  getChangeReducers,
};
