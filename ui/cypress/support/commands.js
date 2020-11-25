import 'cypress-wait-until';
import 'cypress-waitfor';

Cypress.Commands.add('login', (username, password) => {
  cy.visit(Cypress.env('APP_URL'));
  cy.get('#username').type(username);
  cy.get('#password').type(password);
  cy.get('#login-submit').click();
  cy.wait(100);
  cy.visit(Cypress.env('APP_URL'));
});

Cypress.Commands.add('startAsBO', () => {
  cy.userIsMonoPartner = false;
  cy.visit(Cypress.env('APP_URL') + 'p/callback#access_token=' + Cypress.env('BO_TOKEN'));
});

Cypress.Commands.add('startAsPartner', () => {
  cy.userIsMonoPartner = true;
  cy.visit(Cypress.env('APP_URL') + 'p/callback#access_token=' + Cypress.env('PARTNER_TOKEN'));
});

Cypress.Commands.add('waitGet', path => {
  return cy.get(path, { timeout: 10000 });
});

Cypress.Commands.add('slowType', string => {
  return cy.type(string, { delay: 20 });
});

Cypress.Commands.add('observeGQL', queryName => {
  cy.route({
    method: 'POST',
    url: '**/graphql',
    onResponse: ({ request, response }) => {
      if (request.body && request.body.query.includes(queryName)) {
        // window.Cypress.emit('gql:' + queryName, response);
        window.Cypress.emit('gql', response);
      }
    },
  });
});

Cypress.Commands.add('waitForGQL', queryName => {
  return new Cypress.Promise(resolve => {
    cy.on('gql', ({ request, response }) => {
      if (request.body && request.body.query && request.body.query.includes(queryName)) {
        resolve(response);
      }
    });
  });
});

Cypress.Commands.add('startObservationGql', () => {
  cy.server().route({
    method: 'POST',
    url: '**/graphql',
    onResponse: ({ request, response }) => {
      window.Cypress.emit('gql', { request, response });
    },
  });
});

Cypress.Commands.add('waitForIt', nb => {
  return Cypress.Promise(resolve => {
    setTimeout(() => resolve(), nb);
  });
});
