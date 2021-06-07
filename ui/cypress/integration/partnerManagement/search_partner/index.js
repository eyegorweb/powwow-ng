import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import partnerPage from '../../../pageObjects/partnerPage';

Given('Je suis sur la page de gestion des partenaires', () => {
  partnerPage.init();
  cy.wait(400); // changer a 400, 2000 ou 3000 uniquement pour connexion lente et chargement long de la page
});

Given('Je choisis le filtre Raison sociale {string}', (partnerName) => {
  partnerPage.filterBar.socialReason.toggle();
  partnerPage.filterBar.socialReason.filter(partnerName);
  partnerPage.filterBar.socialReason.choose(1);
});

When('Je lance la recherche', () => {
  partnerPage.filterBar.apply();
  cy.wait(500); // actualisation de la page, a modifier selon le debit de connexion
});

Then('La table contient exactement {int} ligne', (nbrResult) => {
  partnerPage.getTotal((total) => {
    expect(total).to.equal(nbrResult);
  });
});
