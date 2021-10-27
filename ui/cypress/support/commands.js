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
  if (cy.currentUserType !== 'BO') {
    cy.userIsMonoPartner = false;
    cy.visit(Cypress.env('APP_URL') + 'p/callback#access_token=' + Cypress.env('BO_TOKEN'));
    cy.get('#app-loader').should('not.be.visible');
    cy.url().should('eq', Cypress.env('APP_URL') + 'p/');
    cy.currentUserType = 'BO';
  } else {
    cy.get('.logoPart > a').click({
      force: true,
    });
  }
});

Cypress.Commands.add('startAsPartnerLyra', () => {
  if (cy.currentUserType !== 'partnerLyra') {
    cy.userIsMonoPartner = false;
    cy.visit(Cypress.env('APP_URL') + 'p/callback#access_token=' + Cypress.env('PARTNER_LYRA_TOKEN'));
    cy.get('#app-loader').should('not.be.visible');
    cy.url().should('eq', Cypress.env('APP_URL') + 'p/');
    cy.currentUserType = 'partnerLyra';
  } else {
    cy.get('.logoPart > a').click({
      force: true,
    });
  }
});

Cypress.Commands.add('startAsPartnerAuchan', () => {
  if (cy.currentUserType !== 'partnerAuchan') {
    cy.userIsMonoPartner = false;
    cy.visit(Cypress.env('APP_URL') + 'p/callback#access_token=' + Cypress.env('PARTNER_AUCHAN_TOKEN'));
    cy.get('#app-loader').should('not.be.visible');
    cy.url().should('eq', Cypress.env('APP_URL') + 'p/');
    cy.currentUserType = 'partnerAuchan';
  } else {
    cy.get('.logoPart > a').click({
      force: true,
    });
  }
});

Cypress.Commands.add('startAsGroupAccount', () => {
  /*if (cy.currentUserType !== 'groupAccount') {
    cy.userIsMonoPartner = false;
    cy.visit(
      Cypress.env('APP_URL') + 'p/callback#access_token=' + Cypress.env('GROUP_ACCOUNT_TOKEN')
    );
    cy.get('#app-loader').should('not.be.visible');
    cy.url().should('eq', Cypress.env('APP_URL') + 'p/');
    cy.currentUserType = 'groupAccount';
  } else {
    cy.get('.logo').click({
      force: true,
    });
    cy.wait(400);
    //quickfix temporaire
    cy.login('userPartyGroup', 'admin');
  }*/
  cy.userIsMonoPartner = false;
    cy.visit(
      Cypress.env('APP_URL') + 'p/callback#access_token=' + Cypress.env('GROUP_ACCOUNT_TOKEN')
    );
    cy.get('#app-loader').should('not.be.visible');
    cy.url().should('eq', Cypress.env('APP_URL') + 'p/');
    cy.currentUserType = 'groupAccount';
});

Cypress.Commands.add('waitGet', (path) => {
  return cy.get(path, { timeout: 10000 });
});

Cypress.Commands.add('waitForIt', (nb) => {
  return Cypress.Promise((resolve) => {
    setTimeout(() => resolve(), nb);
  });
});
