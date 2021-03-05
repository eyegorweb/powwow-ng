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

Cypress.Commands.add('waitForIt', nb => {
  return Cypress.Promise(resolve => {
    setTimeout(() => resolve(), nb);
  });
});
