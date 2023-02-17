import _ from 'underscore';
import { getResource } from 'helpers/json-api';

import fxTestForms from 'fixtures/test/forms';
import fxTestFormDefinition from 'fixtures/test/form-definition';
import fxTestFormResponse from 'fixtures/test/form-response';
import fxTestFormFields from 'fixtures/test/form-fields';

import fxForms from 'fixtures/collections/forms';

Cypress.Commands.add('routeForms', (mutator = _.identity) => {
  cy.intercept('/api/forms', {
    body: mutator({
      data: getResource(_.union(fxTestForms, _.sample(fxForms, 5)), 'forms'),
      included: [],
    }),
  })
    .as('routeForms');
});

Cypress.Commands.add('routeForm', (mutator = _.identity, formId = '11111') => {
  cy.intercept('GET', '/api/forms/*', {
    body: mutator({
      data: getResource(_.find(fxTestForms, { id: formId }), 'forms'),
      included: [],
    }),
  })
    .as('routeForm');
});

Cypress.Commands.add('routeFormDefinition', (mutator = _.identity) => {
  cy.intercept('GET', '/api/forms/*/definition', {
    body: mutator(fxTestFormDefinition),
  })
    .as('routeFormDefinition');
});

Cypress.Commands.add('routeFormActionDefinition', (mutator = _.identity) => {
  cy.intercept('GET', '/api/actions/*/form/definition', {
    body: mutator(fxTestFormDefinition),
  })
    .as('routeFormActionDefinition');
});

Cypress.Commands.add('routeFormResponse', (mutator = _.identity) => {
  cy.intercept('GET', '/api/form-responses/*/response', {
    body: mutator(fxTestFormResponse),
  })
    .as('routeFormResponse');
});

Cypress.Commands.add('routeFormFields', (mutator = _.identity) => {
  cy.intercept('GET', '/api/forms/**/fields*', {
    body: mutator({
      data: getResource(_.sample(fxTestFormFields), 'form-fields'),
      included: [],
    }),
  })
    .as('routeFormFields');
});

Cypress.Commands.add('routeFormActionFields', (mutator = _.identity) => {
  cy.intercept('GET', '/api/actions/**/form/fields*', {
    body: mutator({
      data: getResource(_.sample(fxTestFormFields), 'form-fields'),
      included: [],
    }),
  })
    .as('routeFormActionFields');
});

Cypress.Commands.add('routeLatestFormResponseByPatient', (mutator = _.identity) => {
  cy.intercept('GET', '/api/patients/**/form-responses/latest*', {
    body: mutator(fxTestFormResponse),
  })
    .as('routeLatestFormResponseByPatient');
});
