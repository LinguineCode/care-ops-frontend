import RouterApp from 'js/base/routerapp';

import FormApp from 'js/apps/forms/form/form_app';

export default RouterApp.extend({
  routerAppName: 'FormsApp',

  childApps: {
    form: FormApp,
  },

  eventRoutes: {
    'form:patientAction': {
      action: 'showFormAction',
      route: 'patient-action/:id/form/:id',
    },
  },
  showFormAction(patientActionId, formId) {
    this.startCurrent('form', { formId, patientActionId });
  },
});
