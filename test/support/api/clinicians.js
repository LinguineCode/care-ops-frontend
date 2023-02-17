import _ from 'underscore';
import dayjs from 'dayjs';
import { getResource, getIncluded, getRelationship } from 'helpers/json-api';

import fxTestClinicians from 'fixtures/test/clinicians.json';
import fxTestTeams from 'fixtures/test/teams.json';
import fxTestRoles from 'fixtures/test/roles.json';

import fxWorkspaces from 'fixtures/collections/workspaces.json';
import fxClinicians from 'fixtures/collections/clinicians.json';

Cypress.Commands.add('routeCurrentClinician', (mutator = _.identity) => {
  const clinician = getResource(_.find(fxTestClinicians, { id: '11111' }), 'clinicians');

  clinician.attributes.last_active_at = dayjs.utc().format();

  const workspaces = _.sample(fxWorkspaces, 2);
  workspaces[0].id = '11111';
  workspaces[1].id = '22222';

  clinician.relationships.workspaces = {
    data: getRelationship(workspaces, 'workspaces'),
  };

  clinician.relationships.team = {
    data: getRelationship(_.find(fxTestTeams, { id: '22222' }), 'teams'),
  };

  clinician.relationships.role = {
    data: getRelationship(_.find(fxTestRoles, { id: '11111' }), 'roles'),
  };

  cy.intercept('GET', '/api/clinicians/me', {
    body: mutator({
      data: clinician,
      included: getIncluded([], workspaces, 'workspaces'),
    }),
  })
    .as('routeCurrentClinician');
});

Cypress.Commands.add('routeClinicians', (mutator = _.identity, clinicians) => {
  const workspaces = _.sample(fxWorkspaces, 2);
  clinicians = clinicians || _.sample(fxClinicians, 9);
  clinicians = getResource(clinicians, 'clinicians');

  _.each(clinicians, (clinician, i) => {
    if (clinician.relationships.team || clinician.id === '11111') return;
    const teamIndex = (i >= fxTestTeams.length) ? i - fxTestTeams.length : i;
    clinician.relationships.team = {
      data: getRelationship(fxTestTeams[teamIndex], 'teams'),
    };
    clinician.relationships.workspaces = {
      data: getRelationship(workspaces, 'workspaces'),
    };
    clinician.relationships.role = {
      data: getRelationship(_.sample(fxTestRoles), 'roles'),
    };
  });

  cy.intercept('GET', '/api/clinicians', {
    body: mutator({
      data: clinicians,
      included: getIncluded([], workspaces, 'workspaces'),
    }),
  })
    .as('routeClinicians');
});

Cypress.Commands.add('routeClinician', (mutator = _.identity) => {
  const workspaces = _.sample(fxWorkspaces, 2);
  const clinician = getResource(_.sample(fxClinicians), 'clinicians');

  clinician.relationships.team = {
    data: getRelationship(_.sample(fxTestTeams), 'teams'),
  };

  clinician.relationships.workspaces = {
    data: getRelationship(workspaces, 'workspaces'),
  };

  clinician.relationships.role = {
    data: getRelationship(_.sample(fxTestRoles), 'roles'),
  };

  cy.intercept('GET', /\/api\/clinicians\/[^me]+/, {
    body: mutator({
      data: clinician,
      included: getIncluded([], workspaces, 'workspaces'),
    }),
  });
});
