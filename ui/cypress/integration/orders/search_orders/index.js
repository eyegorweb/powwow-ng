import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

import orderPage from '../../../pageObjects/orderPage';

Given(`je suis sur la page recherche de commandes`, () => {
  cy.server();
  cy.route('POST', '/api/graphql').as('gql-call');

  orderPage.init();
});

Given(`je choisis le partenaire {string}`, partnerName => {
  orderPage.filterBar.partner.toggle();
  orderPage.filterBar.partner.filter(partnerName);
  orderPage.filterBar.partner.choose(1);
  orderPage.filterBar.partner.chosenItems().should('have.length', 1);

});

When(`je lance la recherche`, () => {
  orderPage.filterBar.apply();
});

Then(`la table contient le resultat de ma recherche`, () => {
  orderPage.getTotal(total => {
    expect(total).to.be.above(0);
  });
});
