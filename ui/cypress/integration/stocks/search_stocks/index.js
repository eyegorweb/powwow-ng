import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

import stocks from '../../../pageObjects/stocksPage';

Given('Je suis sur la page de gestion des stocks', () => {
  stocks.init();

  cy.wait(500);
});

Given('Je choisis le filtre partenaire {string}', (partnerName) => {
  stocks.filterBar.partner.toggle();
  stocks.filterBar.partner.filter(partnerName);
  stocks.filterBar.partner.choose(1);
});

When('Je lance la recherche', () => {
  stocks.filterBar.apply();
  cy.wait(500);
});

Then('La table contient plus de {int} resultat', (nbrResult) => {
  stocks.getTotal((total) => {
    expect(total).to.be.above(nbrResult);
  });
});
