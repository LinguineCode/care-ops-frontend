import _ from 'underscore';
import { getResource, getRelationship } from 'helpers/json-api';

import fxTestTeams from 'fixtures/test/teams';

import fxWorkspaces from 'fixtures/collections/workspaces';
import fxClinicians from 'fixtures/collections/clinicians';
import fxPatients from 'fixtures/collections/patients';

function makeResources(workspaces, clinicians) {
  clinicians = getResource(clinicians, 'clinicians');
  workspaces = getResource(workspaces, 'workspaces');

  _.each(clinicians, (clinician, i) => {
    if (clinician.relationships.team || clinician.id === '11111') return;
    clinician.relationships.workspaces = { data: [] };
    const teamIndex = (i >= fxTestTeams.length) ? i - fxTestTeams.length : i;
    const team = getRelationship(fxTestTeams[teamIndex], 'teams');
    clinician.relationships.team = { data: team };
    clinician.relationships.role = { data: { id: '11111', type: 'roles' } };
  });

  mutateWorkspace(workspaces[0], clinicians);

  if (workspaces[1]) {
    mutateWorkspace(workspaces[1], _.first(clinicians, 5), fxPatients);
  }

  if (workspaces[2]) {
    mutateWorkspace(workspaces[2], _.last(clinicians, 5), fxPatients);
  }

  return { workspacesData: workspaces, cliniciansData: clinicians };
}

function mutateWorkspace(workspace, clinicians) {
  const workspaceRelation = getRelationship(workspace, 'workspaces');
  workspace.relationships = getWorkspaceRelations(clinicians);
  _.each(clinicians, clinician => {
    if (clinician.id === '11111') return;
    clinician.relationships.workspaces.data.push(workspaceRelation);
  });
}

function getWorkspaceRelations(clinicians) {
  return {
    patients: { data: getRelationship(_.sample(fxPatients, 2), 'patients') },
    clinicians: { data: getRelationship(clinicians, 'clinicians') },
  };
}

Cypress.Commands.add('routeWorkspaces', (mutator = _.identity) => {
  cy.intercept('GET', '/api/workspaces', {
    body: mutator({
      data: getResource(_.sample(fxWorkspaces, 4), 'workspaces'),
      included: [],
    }),
  })
    .as('routeWorkspaces');
});

Cypress.Commands.add('routeWorkspacesBootstrap', (workspacesMutator = _.identity, workspaces, cliniciansMutator = _.identity) => {
  cy
    .wrap(null)
    .then(function() {
      // Get an odd number of clinicians for workspace assignment.
      // The active clinician is the "halfway" one, so number 4 here
      const clinicians = _.sample(fxClinicians, 9);
      clinicians[4] = { id: '11111' };
      workspaces = workspaces || _.sample(fxWorkspaces, 4);

      const { workspacesData, cliniciansData } = makeResources(workspaces, clinicians);

      cy.routeWorkspaces(fx => {
        fx.data = workspacesData;

        return workspacesMutator(fx);
      });

      cy.routeClinicians(fx => {
        fx.data = cliniciansData;

        return cliniciansMutator(fx);
      });
    });
});
