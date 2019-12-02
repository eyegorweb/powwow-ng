Cypress.Commands.add('login', (username, password) => {
  cy.visit(Cypress.env('APP_URL'));
  cy.get('#username').type(username);
  cy.get('#password').type(password);
  cy.get('#login-submit').click();
  cy.wait(100);
  cy.visit(Cypress.env('APP_URL'));
});

Cypress.Commands.add('startAsBO', () => {
  cy.visit(Cypress.env('APP_URL') + 'p/callback#access_token=' + Cypress.env('BO_TOKEN'));
});

Cypress.Commands.add('startAsPartner', () => {
  cy.visit(Cypress.env('APP_URL') + 'p/callback#access_token=' + Cypress.env('PARTNER_TOKEN'));
});
