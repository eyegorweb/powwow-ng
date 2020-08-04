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

Given(`je choisis l'offre {string}`, offer => {
  orderPage.filterBar.offer.toggle();
  orderPage.filterBar.offer.filter(offer);
  orderPage.filterBar.offer.choose(1);
});

Given(`je choisis le statut {string}`, orderStatus => {
  orderPage.filterBar.status.toggle();
  orderPage.filterBar.status.choose(orderStatus);
});

Given(`je choisis le type {string}`, simType => {
  orderPage.filterBar.type.toggle();
  orderPage.filterBar.type.filter(simType);
  orderPage.filterBar.type.choose(1);
});

Given(`je choisis le compte de facturation {string}`, billingAccount => {
  orderPage.filterBar.billingAccount.toggle();
  orderPage.filterBar.billingAccount.filter(billingAccount);
  orderPage.filterBar.billingAccount.choose(1);
});

When(`je lance la recherche`, () => {
  orderPage.filterBar.apply();
});

Then(`la table contient {int} resultat`, nbrResult => {
  orderPage.getTotal(total => {
    expect(total).to.equal(nbrResult);
  });
});

Then(`la table contient plus de {int} resultat`, nbrResult => {
  orderPage.getTotal(total => {
    expect(total).to.be.above(nbrResult);
  });
});

Then(`la table contient moins de {int} resultat`, nbrResult => {
  orderPage.getTotal(total => {
    expect(total).to.be.below(nbrResult);
  });
});

Then(`la table contient moins de {int} resultat`, nbrResult => {
  orderPage.getTotal(total => {
    expect(total).to.be.below(nbrResult);
  });
});
