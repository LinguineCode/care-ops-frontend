import _ from 'underscore';
import { getResource, getIncluded, getRelationship } from 'helpers/json-api';

import fxTestTeams from 'fixtures/test/teams';
import fxTestStates from 'fixtures/test/states';

import fxActions from 'fixtures/collections/actions';
import fxClinicians from 'fixtures/collections/clinicians';
import fxPatients from 'fixtures/collections/patients';
import fxPrograms from 'fixtures/collections/programs';
import fxFlows from 'fixtures/collections/flows';

function generateData(patients = _.sample(fxPatients, 1)) {
  const data = getResource(_.sample(fxActions, 20), 'patient-actions');
  let included = [];

  _.each(data, action => {
    const patient = _.sample(patients);

    included = getIncluded(included, patient, 'patients');

    action.relationships = {
      'patient': { data: getRelationship(patient, 'patients') },
      'program': { data: getRelationship(_.sample(fxPrograms), 'program') },
      'state': { data: getRelationship(_.sample(fxTestStates), 'states') },
      'owner': { data: null },
      'form': { data: null },
      'form-responses': { data: null },
      'flow': { data: null },
    };

    if (_.random(1)) {
      const clinician = _.sample(fxClinicians);

      // NOTE: Uses includes for testing relationships
      included = getIncluded(included, clinician, 'clinicians');

      action.relationships.owner = {
        data: getRelationship(clinician, 'clinicians'),
      };
    } else {
      action.relationships.owner = {
        data: getRelationship(_.sample(fxTestTeams), 'teams'),
      };
    }
  });

  return {
    data,
    included,
  };
}

Cypress.Commands.add('routeAction', (mutator = _.identity) => {
  const apiData = generateData();
  apiData.data = _.sample(apiData.data);

  cy.intercept('GET', '/api/actions/*', {
    body: mutator(apiData),
  })
    .as('routeAction');
});

Cypress.Commands.add('routePatientActions', (mutator = _.identity, patientId = '1') => {
  const patient = _.sample(fxPatients);
  patient.id = patientId;

  cy.intercept('GET', '/api/patients/**/relationships/actions*', {
    body: mutator(generateData([patient])),
  })
    .as('routePatientActions');
});

Cypress.Commands.add('routeFlowActions', (mutator = _.identity, flowId = '1') => {
  const apiData = generateData();
  const data = apiData.data;
  const flow = _.sample(fxFlows);
  flow.id = flowId;

  apiData.included = getIncluded(apiData.included, flow, 'flows');

  _.each(data, action => {
    action.relationships.flow = {
      data: getRelationship(flow, 'flows'),
    };
  });

  cy.intercept('GET', '/api/flows/**/relationships/actions', {
    body: mutator(apiData),
  })
    .as('routeFlowActions');
});

Cypress.Commands.add('routeActions', (mutator = _.identity) => {
  cy.intercept('GET', '/api/actions?*', {
    body: mutator(generateData(_.sample(fxPatients, 5))),
  })
    .as('routeActions');
});

