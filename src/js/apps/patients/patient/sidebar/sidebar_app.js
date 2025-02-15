import { map } from 'underscore';
import Radio from 'backbone.radio';

import App from 'js/base/app';

import { SidebarView } from 'js/views/patients/patient/sidebar/sidebar_views';

export default App.extend({
  viewEvents: {
    'click:patientEdit': 'showPatientModal',
    'click:patientView': 'showPatientModal',
  },
  onBeforeStart({ patient }) {
    this.showView(new SidebarView({ model: patient }));

    this.getRegion('widgets').startPreloader();
  },
  beforeStart({ patient }) {
    return map(Radio.request('bootstrap', 'sidebarWidgets:fields'), fieldName => {
      return Radio.request('entities', 'fetch:patientFields:model', patient.id, fieldName);
    });
  },
  onStart({ patient }) {
    this.patient = patient;

    const widgets = Radio.request('bootstrap', 'sidebarWidgets');

    this.showView(new SidebarView({
      model: this.patient,
      collection: widgets,
    }));
  },
  showPatientModal() {
    Radio.request('nav', 'patient', this.patient);
  },
});
