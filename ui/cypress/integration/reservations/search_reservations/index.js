import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

import reservations from '../../../pageObjects/reservationsPage';

When('Je lance la recherche', () => {
  reservations.filterBar.apply();
  cy.wait(500);
});

Then('La table contient plus de {int} resultat', (nbrResult) => {
  console.log('🚀 ~ file: index.js ~ line 82 ~ Then ~ nbrResult', nbrResult);
  reservations.getTotal((total) => {
    expect(total).to.be.above(nbrResult);
  });
});
