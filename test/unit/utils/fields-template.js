import Radio from 'backbone.radio';
import 'js/entities-service';
import patientTemplate from 'js/utils/fields-template';

context('patientTemplate', function() {
  let patient;
  beforeEach(function() {
    const field = Radio.request('entities', 'patientFields:model', { id: 'test', name: 'that', value: { is: { a: { test: 21 } } } });
    patient = Radio.request('entities', 'patients:model', { first_name: 'Joe', _patient_fields: [{ id: field.id }] });
  });

  specify('field data', function() {
    const template = patientTemplate('<p>Test: {{ fields.that.is.a.test }}</p>');

    expect(template(patient)).to.equal('<p>Test: 21</p>');
  });

  specify('patient data', function() {
    const template = patientTemplate('<p>Test: {{ patient.first_name }}</p>');

    expect(template(patient)).to.equal('<p>Test: Joe</p>');
  });

  specify('invalid templates', function() {
    const template = '{{ fields.....test }}';
    expect(function() {
      patientTemplate(template);
    }).to.throw().with.property('source');
  });
});
