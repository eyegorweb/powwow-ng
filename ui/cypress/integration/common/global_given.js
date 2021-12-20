import layout from '../../pageObjects/layout';
import alarmsPage from '../../pageObjects/alarmsPage';
import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

Given(`en tant que BO`, () => {
  cy.startAsBO();
});

Given(`en tant que partenaire {word}`, (partnerName) => {
  switch (partnerName) {
    case 'lyra':
      //token non fonctionnel, redirection vers page de login
      /*if (partnerName === 'lyra') {
        cy.testVars.userPartner = 'LYRA NETWORK';
        cy.startAsPartnerLyra();
      }*/
      cy.login('lyra', 'admin');
      break;
    case 'auchan':
      cy.testVars.userPartner = 'LYRA NETWORK';
      cy.startAsPartnerAuchan();
      break;
    default:
      break;
  }
});

Given('en tant que compte groupe', () => {
  cy.startAsGroupAccount();
});

Given('je clique sur le bouton {string}', (buttonName) => {
  cy.waitGet('#main-sliding-panel').then(($panel) => {
    if ($panel.hasClass('cd-panel--is-visible')) {
      cy.waitGet('.cd-panel button')
        .contains(buttonName)
        .click({ force: true });
    } else {
      cy.waitGet('button')
        .contains(buttonName)
        .click({ force: true });
    }
  });
});

When('je clique sur le bouton {string}', (buttonName) => {
  cy.waitGet('#main-sliding-panel').then(($panel) => {
    if ($panel.hasClass('cd-panel--is-visible')) {
      cy.waitGet('.cd-panel button')
        .contains(buttonName)
        .click({ force: true });
    } else {
      cy.waitGet('button')
        .contains(buttonName)
        .click({ force: true });
    }
  });
});

Then('je clique sur le bouton {string}', (buttonName) => {
  cy.waitGet('#main-sliding-panel').then(($panel) => {
    if ($panel.hasClass('cd-panel--is-visible')) {
      cy.waitGet('.cd-panel button')
        .contains(buttonName)
        .click({ force: true });
    } else {
      cy.waitGet('button')
        .contains(buttonName)
        .click({ force: true });
    }
  });
});

/* Navigation sur les pages */

Given('Je vais sur la page des alarmes', () => {
  layout.menu.alarms();
  cy.wait(800);
});

Given('Je vais sur la page des alarmes mutualisées', () => {
  alarmsPage.sharedAlarms.goTo();
  cy.wait(800);
});

Given('Je vais sur la page des factures', () => {
  layout.menu.bills();
  cy.wait(800);
});

Given('Je vais sur la page du dashboard', () => {
  layout.menu.dashboard();
  cy.wait(800);
});

Given('Je vais sur la page de gestion des documents', () => {
  layout.menu.document();
  cy.wait(800);
});

Given('Je vais sur la page des rapports', () => {
  layout.menu.report();
  cy.wait(800);
});

Given('Je vais sur la page des commandes', () => {
  layout.menu.getSim();
  cy.wait(800);
});

Given('Je vais sur la page des lignes', () => {
  layout.menu.lines();
  cy.wait(800);
});

Given('Je vais sur la page des actes de gestion', () => {
  layout.menu.massActions();
  cy.wait(800);
});

Then('Je vais sur la page des actes de gestion', () => {
  layout.menu.massActions();
  cy.wait(800);
});

Given('Je vais sur la page des partenaires', () => {
  layout.menu.partnerManagement();
  cy.wait(800);
});

Given('Je vais sur la page des réservations', () => {
  layout.menu.getSim();
  cy.wait(800);
  cy.waitGet('#app > div.container > div.mt-4 > div.tabs > ol > li:nth-child(2) > a').click();
  cy.wait(800);
});

Given('Je vais sur la page des utilisateurs', () => {
  layout.menu.userManagement();
  cy.wait(800);
});
