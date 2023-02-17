import _ from 'underscore';
import { getResource, getIncluded, getRelationship } from 'helpers/json-api';

import fxTestTeams from 'fixtures/test/teams';
import fxTestStates from 'fixtures/test/states';

import fxFlows from 'fixtures/collections/flows';
import fxActions from 'fixtures/collections/actions';
import fxClinicians from 'fixtures/collections/clinicians';
import fxPatients from 'fixtures/collections/patients';
import fxProgramFlows from 'fixtures/collections/program-flows';
import fxPrograms from 'fixtures/collections/programs';
import fxProgramActions from 'fixtures/collections/program-actions';

function generateData(patients = _.sample(fxPatients, 1)) {
  const data = getResource(_.sample(fxFlows, 10), 'flows');
  let included = [];

  _.each(data, flow => {
    const patient = _.sample(patients);
    const programFlow = _.sample(fxProgramFlows);
    const programActions = _.sample(fxProgramActions, 10);
    const program = _.sample(fxPrograms);
    programFlow.relationships = {};
    programFlow.relationships.program = { data: { id: programFlow.id } };
    programFlow.relationships['program-actions'] = { data: getRelationship(programActions, 'program-actions') };

    included = getIncluded(included, patient, 'patients');
    included = getIncluded(included, programFlow, 'program-flows');
    included = getIncluded(included, program, 'programs');
    included = getIncluded(included, programActions, 'program-actions');

    flow.relationships = {
      'program-flow': { data: getRelationship(programFlow, 'program-flows') },
      'patient': { data: getRelationship(patient, 'patients') },
      'actions': { data: getRelationship(_.sample(fxActions, 10), 'patient-actions') },
      'state': { data: getRelationship(_.sample(fxTestStates), 'states') },
      'owner': { data: null },
    };

    flow.meta = {
      progress: { complete: 0, total: 5 },
    };

    if (_.random(1)) {
      const clinician = _.sample(fxClinicians);

      // NOTE: Uses includes for testing relationships
      included = getIncluded(included, clinician, 'clinicians');

      flow.relationships.owner = {
        data: getRelationship(clinician, 'clinicians'),
      };
    } else {
      flow.relationships.owner = {
        data: getRelationship(_.sample(fxTestTeams), 'teams'),
      };
    }
  });

  return {
    data,
    included,
  };
}

Cypress.Commands.add('routeFlow', (mutator = _.identity) => {
  const apiData = generateData();
  apiData.data = _.sample(apiData.data);

  cy.intercept('GET', '/api/flows/*', {
    body: mutator(apiData),
  })
    .as('routeFlow');
});

Cypress.Commands.add('routePatientFlows', (mutator = _.identity, patientId = '1') => {
  const patient = _.sample(fxPatients);
  patient.id = patientId;

  cy.intercept('GET', '/api/patients/**/relationships/flows*', {
    body: mutator(generateData([patient])),
  })
    .as('routePatientFlows');
});


Cypress.Commands.add('routeFlows', (mutator = _.identity) => {
  cy.intercept('GET', '/api/flows?*', {
    body: mutator(generateData(_.sample(fxPatients, 5))),
  })
    .as('routeFlows');
});
