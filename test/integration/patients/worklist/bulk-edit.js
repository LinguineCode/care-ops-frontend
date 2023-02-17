import _ from 'underscore';

import formatDate from 'helpers/format-date';
import { testTs, testTsSubtract } from 'helpers/test-timestamp';
import { testDateAdd } from 'helpers/test-date';

import fxFlows from 'fixtures/collections/flows';

const tomorrow = testDateAdd(1);

const testWorkspaces = [
  {
    id: '1',
    name: 'Group One',
  },
  {
    id: '2',
    name: 'Another Group',
  },
  {
    id: '3',
    name: 'Third Group',
  },
];

context('Worklist bulk editing', function() {
  specify('displaying common workspaces - flows', function() {
    cy
      .routeWorkspacesBootstrap(_.identity, testWorkspaces)
      .routeFlows(fx => {
        fx.data = _.sample(fx.data, 3);

        fx.data[0].relationships.patient = { data: { id: '1' } };
        fx.data[0].relationships.state = { data: { id: '22222' } };
        fx.data[0].attributes.created_at = testTs();
        fx.data[1].relationships.patient = { data: { id: '2' } };
        fx.data[1].relationships.state = { data: { id: '22222' } };
        fx.data[1].attributes.created_at = testTsSubtract(1);
        fx.data[2].relationships.patient = { data: { id: '3' } };
        fx.data[2].relationships.state = { data: { id: '22222' } };
        fx.data[2].attributes.created_at = testTsSubtract(2);

        fx.included = fx.included.concat([
          {
            id: '1',
            type: 'patients',
            attributes: {
              first_name: 'Patient',
              last_name: 'One',
            },
            relationships: {
              workspaces: {
                data: [testWorkspaces[0]],
              },
            },
          },
          {
            id: '2',
            type: 'patients',
            attributes: {
              first_name: 'Patient',
              last_name: 'Two',
            },
            relationships: {
              workspaces: {
                data: [testWorkspaces[0], testWorkspaces[1]],
              },
            },
          },
          {
            id: '3',
            type: 'patients',
            attributes: {
              first_name: 'Patient',
              last_name: 'Three',
            },
            relationships: {
              workspaces: {
                data: [testWorkspaces[2]],
              },
            },
          },
        ]);

        return fx;
      })
      .visit('/worklist/owned-by')
      .wait('@routeFlows');

    cy
      .get('.app-frame__content')
      .find('.table-list__item')
      .first()
      .find('.js-select')
      .click();

    cy
      .get('.app-frame__content')
      .find('.table-list__item')
      .eq(1)
      .find('.js-select')
      .click();

    cy
      .get('[data-filters-region]')
      .find('.js-bulk-edit')
      .click();

    cy
      .get('.modal--sidebar')
      .as('sidebar')
      .find('[data-owner-region]')
      .click();

    cy
      .get('.picklist')
      .find('.picklist__group')
      .should('have.length', 3)
      .first()
      .should('contain', 'Clinician McTester')
      .next()
      .find('.picklist__heading')
      .first()
      .should('contain', 'Group One');

    cy
      .get('.picklist')
      .find('.picklist__info')
      .should('not.exist');

    cy
      .get('@sidebar')
      .find('.js-close')
      .first()
      .click();

    cy
      .get('.app-frame__content')
      .find('.table-list__item')
      .last()
      .find('.js-select')
      .click();

    cy
      .get('[data-filters-region]')
      .find('.js-bulk-edit')
      .click();

    cy
      .get('@sidebar')
      .find('[data-owner-region]')
      .click();

    cy
      .get('.picklist')
      .find('.picklist__group')
      .should('have.length', 2)
      .first()
      .should('contain', 'Clinician McTester')
      .next()
      .find('.picklist__heading')
      .should('contain', 'Teams');

    cy
      .get('.picklist')
      .find('.picklist__info')
      .should('contain', 'Tip: To assign a clinician, filter the worklist to a specific group.');
  });

  specify('displaying common workspaces - actions', function() {
    cy
      .routeWorkspacesBootstrap(_.identity, testWorkspaces)
      .routeFlows()
      .routeActions(fx => {
        fx.data = _.sample(fx.data, 3);

        fx.data[0].relationships.patient = { data: { id: '1' } };
        fx.data[0].relationships.state = { data: { id: '22222' } };
        fx.data[0].attributes.created_at = testTs();
        fx.data[1].relationships.patient = { data: { id: '2' } };
        fx.data[1].relationships.state = { data: { id: '22222' } };
        fx.data[1].attributes.created_at = testTsSubtract(1);
        fx.data[2].relationships.patient = { data: { id: '3' } };
        fx.data[2].relationships.state = { data: { id: '22222' } };
        fx.data[2].attributes.created_at = testTsSubtract(2);

        fx.included = fx.included.concat([
          {
            id: '1',
            type: 'patients',
            attributes: {
              first_name: 'Patient',
              last_name: 'One',
            },
            relationships: {
              workspaces: {
                data: [testWorkspaces[0]],
              },
            },
          },
          {
            id: '2',
            type: 'patients',
            attributes: {
              first_name: 'Patient',
              last_name: 'Two',
            },
            relationships: {
              workspaces: {
                data: [testWorkspaces[0], testWorkspaces[1]],
              },
            },
          },
          {
            id: '3',
            type: 'patients',
            attributes: {
              first_name: 'Patient',
              last_name: 'Three',
            },
            relationships: {
              workspaces: {
                data: [testWorkspaces[2]],
              },
            },
          },
        ]);

        return fx;
      })
      .visit('/worklist/owned-by')
      .wait('@routeFlows');

    cy
      .get('.worklist-list__toggle')
      .contains('Actions')
      .click()
      .wait('@routeActions');

    cy
      .get('.app-frame__content')
      .find('.table-list__item')
      .first()
      .find('.js-select')
      .click();

    cy
      .get('.app-frame__content')
      .find('.table-list__item')
      .eq(1)
      .find('.js-select')
      .click();

    cy
      .get('[data-filters-region]')
      .find('.js-bulk-edit')
      .click();

    cy
      .get('.modal--sidebar')
      .as('sidebar')
      .find('[data-owner-region]')
      .click();

    cy
      .get('.picklist')
      .find('.picklist__group')
      .should('have.length', 3)
      .first()
      .should('contain', 'Clinician McTester')
      .next()
      .find('.picklist__heading')
      .first()
      .should('contain', 'Group One');

    cy
      .get('.picklist')
      .find('.picklist__info')
      .should('not.exist');

    cy
      .get('@sidebar')
      .find('.js-close')
      .first()
      .click();

    cy
      .get('.app-frame__content')
      .find('.table-list__item')
      .last()
      .find('.js-select')
      .click();

    cy
      .get('[data-filters-region]')
      .find('.js-bulk-edit')
      .click();

    cy
      .get('@sidebar')
      .find('[data-owner-region]')
      .click();

    cy
      .get('.picklist')
      .find('.picklist__group')
      .should('have.length', 2)
      .first()
      .should('contain', 'Clinician McTester')
      .next()
      .find('.picklist__heading')
      .should('contain', 'Teams');

    cy
      .get('.picklist')
      .find('.picklist__info')
      .should('contain', 'Tip: To assign a clinician, filter the worklist to a specific group.');
  });

  specify('date and time components', function() {
    cy
      .routeWorkspacesBootstrap(_.identity, testWorkspaces)
      .routeFlows()
      .routeActions(fx => {
        const flowInclude = {
          id: '1',
          type: 'flows',
          attributes: _.extend(_.sample(fxFlows), {
            name: 'Test Flow',
            id: '1',
          }),
        };

        fx.data = _.sample(fx.data, 4);

        fx.data[0].id = '1';
        fx.data[0].attributes.name = 'First In List';
        fx.data[0].attributes.due_date = testDateAdd(5);
        fx.data[0].attributes.created_at = testTsSubtract(1);
        fx.data[0].attributes.due_time = null;
        fx.data[0].relationships.state = { data: { id: '22222' } };

        fx.data[1].id = '3';
        fx.data[1].attributes.name = 'Last In List';
        fx.data[1].attributes.due_date = null;
        fx.data[1].attributes.created_at = testTsSubtract(3);
        fx.data[1].attributes.due_time = null;
        fx.data[1].relationships.state = { data: { id: '22222' } };

        fx.data[2].id = '2';
        fx.data[2].attributes.name = 'Second In List';
        fx.data[2].attributes.due_date = testDateAdd(3);
        fx.data[2].attributes.created_at = testTsSubtract(2);
        fx.data[2].attributes.due_time = '07:00:00';
        fx.data[2].relationships.state = { data: { id: '22222' } };

        fx.data[3].id = '4';
        fx.data[3].attributes.name = 'Third In List';
        fx.data[3].attributes.due_date = testDateAdd(3);
        fx.data[3].attributes.created_at = testTsSubtract(2);
        fx.data[3].attributes.due_time = '07:00:00';
        fx.data[3].relationships.state = { data: { id: '22222' } };


        fx.included.push(flowInclude);

        return fx;
      })
      .routeFlow()
      .routeFlowActions()
      .routePatientByFlow()
      .visit('/worklist/owned-by')
      .wait('@routeFlows');

    cy
      .get('.worklist-list__toggle')
      .contains('Actions')
      .click()
      .wait('@routeActions');

    cy
      .get('.app-frame__content')
      .find('.table-list__item')
      .eq(1)
      .find('.js-select')
      .click();

    cy
      .get('.app-frame__content')
      .find('.table-list__item')
      .eq(2)
      .find('.js-select')
      .click();

    cy
      .get('[data-filters-region]')
      .find('.js-bulk-edit')
      .click();

    cy
      .get('.modal--sidebar')
      .as('sidebar')
      .find('[data-due-date-region]')
      .should('contain', formatDate(testDateAdd(3), 'LONG'));

    cy
      .get('@sidebar')
      .find('[data-due-time-region]')
      .should('contain', '7:00 AM');

    cy
      .get('.modal--sidebar')
      .as('sidebar')
      .find('[data-due-date-region]')
      .click();

    cy
      .get('.datepicker')
      .find('.js-clear')
      .click();

    cy
      .get('@sidebar')
      .find('[data-due-time-region] button')
      .should('be.disabled');

    cy
      .get('@sidebar')
      .find('.js-close')
      .first()
      .click();

    cy
      .get('.app-frame__content')
      .find('.table-list__item')
      .eq(2)
      .find('.js-select')
      .click();

    cy
      .get('.app-frame__content')
      .find('.table-list__item')
      .eq(3)
      .find('.js-select')
      .click();

    cy
      .get('[data-filters-region]')
      .find('.js-bulk-edit')
      .click();

    cy
      .get('@sidebar')
      .find('[data-due-time-region] button')
      .should('be.disabled');

    cy
      .get('.modal--sidebar')
      .as('sidebar')
      .find('[data-due-date-region]')
      .click();

    cy
      .get('.datepicker')
      .find('.js-tomorrow')
      .click();

    cy
      .get('@sidebar')
      .find('[data-due-time-region]')
      .click();

    cy
      .get('.picklist')
      .find('.js-picklist-item')
      .contains('7:00 AM')
      .click();

    cy
      .get('@sidebar')
      .find('[data-due-time-region]')
      .click();

    cy
      .get('.picklist')
      .find('.js-clear')
      .click();


    cy
      .get('@sidebar')
      .find('.js-close')
      .first()
      .click();

    cy
      .get('.app-frame__content')
      .find('.table-list__item')
      .eq(1)
      .find('.js-select')
      .click();

    cy
      .get('.app-frame__content')
      .find('.table-list__item')
      .first()
      .find('.js-select')
      .click();

    cy
      .get('[data-filters-region]')
      .find('.js-bulk-edit')
      .click();
  });

  specify('bulk flows editing', function() {
    cy
      .routeWorkspacesBootstrap(_.identity, testWorkspaces)
      .routeFlows(fx => {
        fx.data = _.sample(fx.data, 3);
        fx.data[0] = {
          id: '1',
          type: 'flows',
          attributes: {
            name: 'First In List',
            details: null,
            created_at: testTs(),
          },
          relationships: {
            owner: {
              data: {
                id: '11111',
                type: 'teams',
              },
            },
            state: { data: { id: '22222' } },
            patient: { data: { id: '1' } },
            form: { data: { id: '1' } },
            flow: { data: { id: '1' } },
          },
          meta: {
            progress: {
              complete: 0,
              total: 2,
            },
          },
        };

        fx.data[1].id = '3';
        fx.data[1].relationships.state = { data: { id: '33333' } };
        fx.data[1].relationships.owner = {
          data: {
            id: '22222',
            type: 'teams',
          },
        };
        fx.data[1].meta.progress = { complete: 2, total: 2 };
        fx.data[1].attributes.name = 'Last In List';
        fx.data[1].attributes.created_at = testTsSubtract(2);

        fx.data[2] = {
          id: '2',
          type: 'flows',
          attributes: {
            name: 'Second In List',
            details: null,
            created_at: testTsSubtract(1),
          },
          relationships: {
            owner: {
              data: {
                id: '11111',
                type: 'teams',
              },
            },
            state: { data: { id: '22222' } },
            patient: { data: { id: '1' } },
            form: { data: { id: '1' } },
          },
          meta: {
            progress: {
              complete: 2,
              total: 10,
            },
          },
        };

        fx.included.push({
          id: '1',
          type: 'patients',
          attributes: {
            first_name: 'Test',
            last_name: 'Patient',
          },
          relationships: {
            workspaces: {
              data: [testWorkspaces[0]],
            },
          },
        });

        return fx;
      })
      .routeActions()
      .routeFlow()
      .routeFlowActions()
      .routePatientByFlow()
      .visit('/worklist/owned-by')
      .wait('@routeFlows');

    cy
      .get('.app-frame__content')
      .find('.table-list__item')
      .first()
      .as('firstRow')
      .find('.js-select')
      .click();

    cy
      .get('[data-select-all-region] button:enabled')
      .click();

    cy
      .get('[data-filters-region]')
      .find('.js-bulk-edit')
      .click();

    cy
      .get('.modal--sidebar')
      .as('bulkEditSidebar')
      .find('.modal__header--sidebar')
      .should('contain', 'Edit 3 Flows');

    cy
      .intercept('PATCH', '/api/flows/*', {
        statusCode: 204,
        body: {},
      })
      .as('patchFlow');

    cy
      .get('@bulkEditSidebar')
      .find('.js-submit')
      .click()
      .wait(['@patchFlow', '@patchFlow', '@patchFlow']);

    cy
      .get('@firstRow')
      .find('.js-select')
      .click();

    cy
      .get('[data-select-all-region] button:enabled')
      .click();

    cy
      .get('[data-filters-region]')
      .find('.js-bulk-edit')
      .click();

    cy
      .get('@bulkEditSidebar')
      .find('[data-state-region]')
      .should('contain', 'Multiple States...');

    cy
      .get('@bulkEditSidebar')
      .find('[data-owner-region]')
      .should('contain', 'Multiple Owners...');

    cy
      .get('@bulkEditSidebar')
      .find('.js-apply-owner')
      .should('be.disabled');

    cy
      .get('@bulkEditSidebar')
      .find('[data-state-region]')
      .click();

    cy
      .get('.picklist')
      .find('.js-picklist-item')
      .contains('To Do')
      .click();

    cy
      .get('@bulkEditSidebar')
      .find('[data-state-region]')
      .click();

    cy
      .get('.picklist')
      .find('.js-picklist-item')
      .contains('Done')
      .click();

    cy
      .get('.modal--small')
      .should('contain', 'Set Flows to Done?')
      .find('.js-submit')
      .click();

    cy
      .get('@bulkEditSidebar')
      .find('[data-owner-region]')
      .click();

    cy
      .get('.picklist')
      .find('.picklist__group')
      .first()
      .should('contain', 'Clinician McTester')
      .next()
      .find('.js-picklist-item')
      .contains('Nurse')
      .click();

    cy
      .get('@bulkEditSidebar')
      .find('.js-apply-owner')
      .click();

    cy
      .intercept('PATCH', '/api/flows/1', {
        statusCode: 204,
        body: {},
      })
      .as('patchFlow1')
      .intercept('PATCH', '/api/flows/2', {
        statusCode: 204,
        body: {},
      })
      .as('patchFlow2')
      .intercept('PATCH', '/api/flows/3', {
        statusCode: 204,
        body: {},
      })
      .as('patchFlow3');

    cy
      .intercept('PATCH', '/api/flows/1/relationships/actions', {
        statusCode: 204,
        body: {},
      })
      .as('patchOwner1')
      .intercept('PATCH', '/api/flows/2/relationships/actions', {
        statusCode: 204,
        body: {},
      })
      .as('patchOwner2')
      .intercept('PATCH', '/api/flows/3/relationships/actions', {
        statusCode: 204,
        body: {},
      })
      .as('patchOwner3');

    cy
      .get('@bulkEditSidebar')
      .find('.js-submit')
      .click();

    cy
      .wait('@patchFlow1')
      .its('request.body')
      .should(({ data }) => {
        expect(data.relationships.state.data.id).to.equal('55555');
        expect(data.relationships.owner.data.id).to.equal('22222');
      });

    cy
      .wait('@patchFlow2')
      .its('request.body')
      .should(({ data }) => {
        expect(data.relationships.state.data.id).to.equal('55555');
        expect(data.relationships.owner.data.id).to.equal('22222');
      });

    cy
      .wait('@patchFlow3')
      .its('request.body')
      .should(({ data }) => {
        expect(data.relationships.state.data.id).to.equal('55555');
        expect(data.relationships.owner.data.id).to.equal('22222');
      });

    cy
      .wait('@patchOwner1')
      .its('request.body')
      .should(({ data }) => {
        expect(data.relationships.owner.data.id).to.equal('22222');
      });

    cy
      .wait('@patchOwner2')
      .its('request.body')
      .should(({ data }) => {
        expect(data.relationships.owner.data.id).to.equal('22222');
      });

    cy
      .wait('@patchOwner3')
      .its('request.body')
      .should(({ data }) => {
        expect(data.relationships.owner.data.id).to.equal('22222');
      });

    cy
      .get('.alert-box')
      .should('contain', '3 Flows have been updated');

    cy
      .get('.app-frame__content')
      .find('.table-list__item .fa-circle-check')
      .should('have.length', 3);

    cy
      .get('.app-frame__content')
      .find('.table-list__item')
      .last()
      .find('.js-select')
      .click();

    cy
      .get('[data-filters-region]')
      .as('filterRegion')
      .find('.js-bulk-edit')
      .click();

    cy
      .get('@bulkEditSidebar')
      .find('[data-state-region]')
      .click();

    cy
      .get('.picklist')
      .find('.js-picklist-item')
      .contains('Done')
      .click();

    cy
      .get('@bulkEditSidebar')
      .find('.js-submit')
      .click();

    cy
      .get('@firstRow')
      .find('.js-select')
      .click();

    cy
      .get('[data-select-all-region] button:enabled')
      .click();

    cy
      .get('@filterRegion')
      .find('.js-bulk-edit')
      .click();

    cy
      .intercept('DELETE', '/api/flows/1', {
        statusCode: 204,
        body: {},
      })
      .intercept('DELETE', '/api/flows/2', {
        statusCode: 204,
        body: {},
      })
      .intercept('DELETE', '/api/flows/3', {
        statusCode: 204,
        body: {},
      });

    cy
      .get('@bulkEditSidebar')
      .find('.js-menu')
      .click();

    cy
      .get('.picklist')
      .find('.js-picklist-item')
      .contains('Delete Flows')
      .click();

    cy
      .get('.modal--small')
      .should('contain', 'Delete Flows?')
      .should('contain', 'Are you sure you want to delete the selected Flows? This cannot be undone.')
      .find('.js-submit')
      .click();

    cy
      .get('.alert-box')
      .should('contain', '3 Flows have been deleted');

    cy
      .get('.modal--small')
      .should('not.exist');

    cy
      .get('.modal--sidebar')
      .should('not.exist');

    cy
      .get('@filterRegion')
      .find('.js-bulk-edit')
      .should('not.exist');

    cy
      .get('.app-frame__content')
      .find('.table-list__item')
      .should('have.length', 0);

    cy
      .get('[data-select-all-region]')
      .find('button')
      .should('be.disabled');
  });

  specify('bulk actions editing', function() {
    cy
      .routeWorkspacesBootstrap(_.identity, testWorkspaces)
      .routeFlows()
      .routeActions(fx => {
        const flowInclude = {
          id: '1',
          type: 'flows',
          attributes: _.extend(_.sample(fxFlows), {
            name: 'Test Flow',
            id: '1',
          }),
        };

        fx.data = _.sample(fx.data, 4);
        fx.data[0] = {
          id: '1',
          type: 'actions',
          attributes: {
            name: 'First In List',
            details: null,
            duration: 0,
            due_date: null,
            due_time: null,
            created_at: testTs(),
          },
          relationships: {
            owner: {
              data: {
                id: '11111',
                type: 'clinicians',
              },
            },
            state: { data: { id: '22222' } },
            patient: { data: { id: '1' } },
            form: { data: { id: '1' } },
            flow: { data: { id: '1' } },
          },
        };

        fx.data[1].id = '3';
        fx.data[1].relationships.state = { data: { id: '22222' } };
        fx.data[1].attributes.name = 'Last In List';
        fx.data[1].attributes.due_date = testDateAdd(5);
        fx.data[1].attributes.created_at = testTsSubtract(3);
        fx.data[1].relationships.patient = { data: { id: '2' } };

        fx.data[2] = {
          id: '2',
          type: 'actions',
          attributes: {
            name: 'Second In List',
            details: null,
            duration: 0,
            due_date: testDateAdd(3),
            due_time: null,
            created_at: testTsSubtract(1),
          },
          relationships: {
            owner: {
              data: {
                id: '11111',
                type: 'teams',
              },
            },
            state: { data: { id: '22222' } },
            patient: { data: { id: '1' } },
            form: { data: { id: '1' } },
          },
        };

        fx.data[3].id = '4';
        fx.data[3].attributes.created_at = testTsSubtract(2);
        fx.data[3].relationships.state = { data: { id: '33333' } };

        fx.included.push(flowInclude);

        return fx;
      })
      .routeFlow()
      .routeFlowActions()
      .routePatientByFlow()
      .visit('/worklist/owned-by')
      .wait('@routeFlows');

    cy
      .intercept('PATCH', '/api/actions/*', {
        statusCode: 204,
        body: {},
      })
      .as('patchAction');

    cy
      .get('.worklist-list__toggle')
      .contains('Actions')
      .click()
      .wait('@routeActions');

    cy
      .get('.app-frame__content')
      .find('.table-list__item')
      .first()
      .as('firstRow')
      .find('.js-select')
      .click();

    cy
      .get('[data-select-all-region] button:enabled')
      .click();

    cy
      .get('[data-filters-region]')
      .find('.js-bulk-edit')
      .click();

    cy
      .get('.modal--sidebar')
      .as('bulkEditSidebar')
      .find('.js-submit')
      .click()
      .wait(['@patchAction', '@patchAction', '@patchAction', '@patchAction']);

    cy
      .get('@firstRow')
      .find('.js-select')
      .click();

    cy
      .get('[data-select-all-region] button:enabled')
      .click();

    cy
      .get('[data-filters-region]')
      .find('.js-bulk-edit')
      .click();

    cy
      .get('@bulkEditSidebar')
      .find('.sidebar__heading')
      .should('contain', 'Edit 4 Actions');

    cy
      .get('@bulkEditSidebar')
      .find('[data-state-region]')
      .should('contain', 'Multiple States...');

    cy
      .get('@bulkEditSidebar')
      .find('[data-owner-region]')
      .should('contain', 'Multiple Owners...');

    cy
      .get('@bulkEditSidebar')
      .find('[data-due-date-region]')
      .should('contain', 'Multiple Dates...');

    cy
      .get('@bulkEditSidebar')
      .find('[data-due-time-region]')
      .should('contain', 'Multiple Times...');

    cy
      .get('@bulkEditSidebar')
      .find('[data-duration-region]')
      .should('contain', 'Multiple Durations...');

    cy
      .intercept('PATCH', '/api/actions/1', {
        statusCode: 204,
        body: {},
      })
      .as('patchAction1')
      .intercept('PATCH', '/api/actions/2', {
        statusCode: 204,
        body: {},
      })
      .as('patchAction2')
      .intercept('PATCH', '/api/actions/3', {
        statusCode: 204,
        body: {},
      })
      .as('patchAction3')
      .intercept('PATCH', '/api/actions/4', {
        statusCode: 204,
        body: {},
      })
      .as('patchAction4');

    cy
      .get('@bulkEditSidebar')
      .find('[data-state-region]')
      .click();

    cy
      .get('.picklist')
      .find('.js-picklist-item')
      .contains('To Do')
      .click();

    cy
      .get('@bulkEditSidebar')
      .find('[data-owner-region]')
      .click();

    cy
      .get('.picklist')
      .find('.picklist__group')
      .first()
      .should('contain', 'Clinician McTester')
      .next()
      .find('.js-picklist-item')
      .contains('Nurse')
      .click();

    cy
      .get('@bulkEditSidebar')
      .find('[data-due-date-region]')
      .click();

    cy
      .get('.datepicker')
      .find('.datepicker__header .js-prev')
      .click();

    cy
      .get('.datepicker')
      .find('li:not(.is-other-month)')
      .first()
      .click();

    cy
      .get('@bulkEditSidebar')
      .find('[data-due-time-region]')
      .click();

    cy
      .get('.picklist')
      .find('.js-picklist-item')
      .contains('10:00 AM')
      .click();

    cy
      .get('@bulkEditSidebar')
      .find('[data-due-date-region]')
      .find('.is-overdue');

    cy
      .get('@bulkEditSidebar')
      .find('[data-due-time-region]')
      .find('.is-overdue');

    cy
      .get('@bulkEditSidebar')
      .find('[data-due-date-region]')
      .click();

    cy
      .get('.datepicker')
      .find('.js-tomorrow')
      .click();

    cy
      .get('@bulkEditSidebar')
      .find('[data-due-date-region]')
      .find('.is-overdue')
      .should('not.exist');

    cy
      .get('@bulkEditSidebar')
      .find('[data-due-time-region]')
      .find('.is-overdue')
      .should('not.exist');

    cy
      .get('@bulkEditSidebar')
      .find('[data-duration-region]')
      .click();

    cy
      .get('.picklist')
      .find('.js-picklist-item')
      .contains('5 mins')
      .click();

    cy
      .get('@bulkEditSidebar')
      .find('.js-submit')
      .click();

    cy
      .wait('@patchAction1')
      .its('request.body')
      .should(({ data }) => {
        expect(data.attributes.duration).to.equal(5);
        expect(data.attributes.due_time).to.equal('10:00:00');
        expect(data.attributes.due_date).to.equal(tomorrow);
        expect(data.relationships.state.data.id).to.equal('22222');
        expect(data.relationships.owner.data.id).to.equal('22222');
      });

    cy
      .wait('@patchAction2')
      .its('request.body')
      .should(({ data }) => {
        expect(data.attributes.duration).to.equal(5);
        expect(data.attributes.due_time).to.equal('10:00:00');
        expect(data.attributes.due_date).to.equal(tomorrow);
        expect(data.relationships.state.data.id).to.equal('22222');
        expect(data.relationships.owner.data.id).to.equal('22222');
      });

    cy
      .wait('@patchAction3')
      .its('request.body')
      .should(({ data }) => {
        expect(data.attributes.duration).to.equal(5);
        expect(data.attributes.due_time).to.equal('10:00:00');
        expect(data.attributes.due_date).to.equal(tomorrow);
        expect(data.relationships.state.data.id).to.equal('22222');
        expect(data.relationships.owner.data.id).to.equal('22222');
      });

    cy
      .wait('@patchAction4')
      .its('request.body')
      .should(({ data }) => {
        expect(data.attributes.duration).to.equal(5);
        expect(data.attributes.due_time).to.equal('10:00:00');
        expect(data.attributes.due_date).to.equal(tomorrow);
        expect(data.relationships.state.data.id).to.equal('22222');
        expect(data.relationships.owner.data.id).to.equal('22222');
      });

    cy
      .get('.alert-box')
      .should('contain', '4 Actions have been updated');

    cy
      .get('.app-frame__content')
      .find('.table-list__item .fa-circle-exclamation')
      .should('have.length', 4);

    cy
      .get('.table-list')
      .find('.table-list__item .js-select')
      .click({ multiple: true });

    cy
      .get('.table-list')
      .find('.table-list__item .js-select')
      .last()
      .click();

    cy
      .get('[data-filters-region]')
      .as('filterRegion')
      .find('.js-bulk-edit')
      .click();

    cy
      .intercept('DELETE', '/api/actions/*', {
        statusCode: 204,
        body: {},
      });

    cy
      .get('.modal--sidebar')
      .find('.modal__header--sidebar')
      .should('contain', 'Edit 3 Actions')
      .find('.js-menu')
      .click();

    cy
      .get('.picklist')
      .find('.js-picklist-item')
      .contains('Delete Actions')
      .click();

    cy
      .get('.modal--small')
      .should('contain', 'Delete Actions?')
      .should('contain', 'Are you sure you want to delete the selected Actions? This cannot be undone.')
      .find('.js-submit')
      .click();

    cy
      .get('.alert-box')
      .should('contain', '3 Actions have been deleted');

    cy
      .get('.modal--small')
      .should('not.exist');

    cy
      .get('.modal--sidebar')
      .should('not.exist');

    cy
      .get('@filterRegion')
      .find('.js-bulk-edit')
      .should('not.exist');

    cy
      .get('.app-frame__content')
      .find('.table-list__item')
      .should('have.length', 1)
      .first()
      .find('.js-select')
      .click();

    cy
      .get('@filterRegion')
      .find('.js-bulk-edit')
      .click();

    cy
      .intercept('PATCH', '/api/actions/*', {
        statusCode: 404,
        body: {},
      })
      .as('failedPatchAction');

    cy
      .get('@bulkEditSidebar')
      .find('[data-due-time-region]')
      .click();

    cy
      .get('.picklist')
      .find('.js-picklist-item')
      .contains('10:00 AM')
      .click();

    cy
      .get('@bulkEditSidebar')
      .find('[data-due-date-region]')
      .click();

    cy
      .get('.datepicker')
      .find('.js-clear')
      .click();

    cy
      .get('@bulkEditSidebar')
      .find('.js-submit')
      .click();

    cy
      .get('.alert-box')
      .should('contain', 'Something went wrong. Please try again.');
  });

  specify('bulk flow editing completed', function() {
    cy
      .routeSettings(fx => {
        const requiredDoneFlow = _.find(fx.data, setting => setting.id === 'require_done_flow');
        requiredDoneFlow.attributes.value = true;

        return fx;
      })
      .routeWorkspacesBootstrap(_.identity, testWorkspaces)
      .routeFlows(fx => {
        fx.data = _.sample(fx.data, 2);
        fx.data[0].id = '1';
        fx.data[0].relationships.state = { data: { id: '22222' } };

        fx.data[1].id = '3';
        fx.data[1].relationships.state = { data: { id: '55555' } };
        fx.data[1].meta = {
          progress: {
            complete: 2,
            total: 10,
          },
        };

        fx.included.push({
          id: '1',
          type: 'patients',
          attributes: {
            first_name: 'Test',
            last_name: 'Patient',
          },
          relationships: {
            workspaces: {
              data: [testWorkspaces[0]],
            },
          },
        });

        return fx;
      })
      .routeActions()
      .routeFlow()
      .routeFlowActions()
      .routePatientByFlow()
      .visit('/worklist/owned-by')
      .wait('@routeFlows');

    cy
      .get('.app-frame__content')
      .find('.table-list__item')
      .first()
      .as('firstRow')
      .find('.js-select');

    cy
      .get('[data-select-all-region] button:enabled')
      .click();

    cy
      .get('[data-filters-region]')
      .find('.js-bulk-edit')
      .click();

    cy
      .get('.modal--sidebar')
      .as('bulkEditSidebar');

    cy
      .get('@bulkEditSidebar')
      .find('[data-state-region]')
      .click();

    cy
      .get('.picklist')
      .find('.js-picklist-item')
      .contains('Done')
      .click();

    cy
      .get('.modal--small')
      .should('contain', 'Flow Actions Must Be Done')
      .find('.js-submit')
      .click();

    cy
      .get('@bulkEditSidebar')
      .find('[data-owner-region] button')
      .should('be.disabled');
  });

  specify('bulk action editing completed', function() {
    cy
      .routeWorkspacesBootstrap(_.identity, testWorkspaces)
      .routeFlows()
      .routeActions(fx => {
        const flowInclude = {
          id: '1',
          type: 'flows',
          attributes: _.extend(_.sample(fxFlows), {
            name: 'Test Flow',
            id: '1',
          }),
        };

        fx.data = _.sample(fx.data, 2);
        fx.data[0].id = '1';
        fx.data[0].relationships.state = { data: { id: '22222' } };

        fx.data[1].id = '3';
        fx.data[1].relationships.state = { data: { id: '55555' } };

        fx.included.push(flowInclude);

        return fx;
      })
      .routeFlow()
      .routeFlowActions()
      .routePatientByFlow()
      .visit('/worklist/owned-by')
      .wait('@routeFlows');

    cy
      .get('.worklist-list__toggle')
      .contains('Actions')
      .click()
      .wait('@routeActions');

    cy
      .get('.app-frame__content')
      .find('.table-list__item')
      .first()
      .as('firstRow')
      .find('.js-select');

    cy
      .get('[data-select-all-region] button:enabled')
      .click();

    cy
      .get('[data-filters-region]')
      .find('.js-bulk-edit')
      .click();

    cy
      .get('.modal--sidebar')
      .as('bulkEditSidebar')
      .find('[data-owner-region] button')
      .should('be.disabled');

    cy
      .get('@bulkEditSidebar')
      .find('[data-due-date-region] button')
      .should('be.disabled');

    cy
      .get('@bulkEditSidebar')
      .find('[data-due-time-region] button')
      .should('be.disabled');

    cy
      .get('@bulkEditSidebar')
      .find('[data-duration-region] button')
      .should('be.disabled');
  });
});
