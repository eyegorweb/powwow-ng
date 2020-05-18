import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

import orderCreationPanel from '../../../pageObjects/orderCreationPanel';

Given(`je suis sur la page de choix d'une offre dans la création de commande`, () => {
  orderCreationPanel.init();
});

Given(`Je choisis l'activation et une offre`, () => {
  orderCreationPanel.choosePartner('Auchan');
  orderCreationPanel.next();
  orderCreationPanel.chooseProduct(1);
  orderCreationPanel.setProductQuantity(1);
  orderCreationPanel.next();

  orderCreationPanel.toggleActivation();
  orderCreationPanel.chooseOffer('AUCHAN_OFFRE_DATA2');
});

When(`quand les services s'affichent`, () => {
  cy.get('.servicesChoice').should('exist');
});

Then(`les noms doivent apparaitre en regard des toggles`, () => {
  orderCreationPanel.getServicesNames(services => {
    expect(services.length).to.be.greaterThan(0);
  });
});
