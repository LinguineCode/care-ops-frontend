import _ from 'underscore';
import { getResource, getRelationship } from 'helpers/json-api';

import fxComments from 'fixtures/collections/comments';
import fxClinicians from 'fixtures/collections/clinicians';

Cypress.Commands.add('routeActionComments', (mutator = _.identity) => {
  const data = getResource(_.sample(fxComments, 5), 'comments');

  _.each(data, comment => {
    comment.relationships = {
      clinician: { data: getRelationship(_.sample(fxClinicians), 'clinicians') },
    };
  });

  cy.intercept('GET', '/api/actions/**/relationships/comments', {
    body: mutator({
      data,
      included: [],
    }),
  })
    .as('routeActionComments');
});
