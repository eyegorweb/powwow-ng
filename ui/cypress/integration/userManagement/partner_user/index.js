import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import partnerPage from '../../../pageObjects/partnerPage';
import partnerDetailPage from '../../../pageObjects/partnerDetailPage';

let nbrUserPartner;
let nbrUserTotal;

Given('Je vais sur la page de detail du partenaire LYRA', () => {
  partnerPage.init();
  cy.wait(800); // changer a 400, 2000 ou 3000 uniquement pour connexion lente et chargement long de la page
  partnerDetailPage.goToPartnerDetail();
});

/* Navigation */

Given("Je vais sur l'onglet {string} et vérifie l'URL {string}", (tabName, tabUrl) => {
  partnerDetailPage.tabs.goToTab(tabName, tabUrl);
});

Given("Je vais dans la section {string} et vérifie l'URL {string}", (sectionName, sectionUrl) => {
  partnerDetailPage.tabs.goToSection(sectionName, sectionUrl);
});

Given("Je récupère le nombre d'utilisateurs dans le partenaire", () => {
  cy.get('.cards')
    .find('.cardBloc')
    .then((cardBloc) => {
      nbrUserPartner = Cypress.$(cardBloc).length;
    });
});

Given('Je me connecte en tant que partenaire lyra', () => {
  cy.visit(Cypress.env('APP_URL'));
  cy.get('#username').type('LYRA');
  cy.get('#password').type('admin');
  cy.get('#login-submit').click();
  cy.wait(100);
  cy.visit(Cypress.env('APP_URL'));
});

When("Je récupère le nombre d'utilisateurs", () => {
  cy.wait(1000);
  cy.waitGet('.mb-3 > :nth-child(1) > .text-gray').then((e) => {
    const parts = e
      .text()
      .trim()
      .split(' ');
    nbrUserTotal = parseInt(parts[0]);
  });
});

Then('Les deux nombres correspondent', () => {
  expect(nbrUserPartner).to.be.equal(nbrUserTotal);
});
