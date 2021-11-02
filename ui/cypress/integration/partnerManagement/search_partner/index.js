import { When, Then } from 'cypress-cucumber-preprocessor/steps';
import partnerPage from '../../../pageObjects/partnerPage';

When('Je lance la recherche', () => {
  partnerPage.filterBar.apply();
  cy.wait(500); // actualisation de la page, a modifier selon le debit de connexion
});

Then('La table contient exactement {int} ligne', (nbrResult) => {
  partnerPage.getTotal((total) => {
    expect(total).to.equal(nbrResult);
  });
});
