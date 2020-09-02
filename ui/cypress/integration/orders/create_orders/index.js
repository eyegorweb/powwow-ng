import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

import orderCreationPanel from '../../../pageObjects/orderCreationPanel';

Given(`je suis sur la page de choix d'une offre dans la création de commande`, () => {
  orderCreationPanel.init();
});

Given(`je crée une nouvelle commande`, () => {
  orderCreationPanel.init();
});

Given(`je choisis l'activation et une offre`, () => {
  orderCreationPanel.client.choosePartner('Auchan');
  orderCreationPanel.next();
  orderCreationPanel.product.selectSimType(1);
  orderCreationPanel.product.setProductQuantity(1);
  orderCreationPanel.next();

  orderCreationPanel.services.toggleActivation();
  orderCreationPanel.services.chooseOffer('AUCHAN_OFFRE_DATA2');
});

Given(`je choisis le partenaire de commande {string}`, orderPartner => {
  orderCreationPanel.client.choosePartner(orderPartner);
  orderCreationPanel.next();
});

Given(`je choisis la commande par défaut`, () => {
  orderCreationPanel.client.choosePartner('Auchan');
  orderCreationPanel.next();
  orderCreationPanel.product.selectSimType(1);
  orderCreationPanel.product.setProductQuantity(1);
  orderCreationPanel.next();
  orderCreationPanel.services.toggleActivation();
  orderCreationPanel.services.chooseOffer('AUCHAN_OFFRE_DATA2');
  orderCreationPanel.next();
  orderCreationPanel.shipping.selectLastShippingAdress();
  orderCreationPanel.next();
});

Given(`je choisis comme partenaire de commande {string}`, orderPartner => {
  orderCreationPanel.client.choosePartner(orderPartner);
});

Given(`je sélectionne l'offre {string}`, offerName => {
  orderCreationPanel.services.chooseOffer(offerName);
});

Given(`je vais à la prochaine étape`, () => {
  orderCreationPanel.next();
});

Given(`je choisis comme CF de commande {string}`, billingAccount => {
  orderCreationPanel.client.chooseBillingAccount(billingAccount);
});

Given(`je choisis le type de SIM {int}`, indexSim => {
  orderCreationPanel.product.displayAllSimTypes();
  orderCreationPanel.product.selectSimType(indexSim);
});

Given(`je choisis la quantité {int}`, NbrSim => {
  orderCreationPanel.product.setProductQuantity(NbrSim);
});

Given(`je souhaite la préactivation`, () => {
  orderCreationPanel.services.togglePreactivation();
});

Given(`je souhaite l'activation`, () => {
  orderCreationPanel.services.toggleActivation();
});

Given(`je choisis la dernière adresse de livraison`, () => {
  orderCreationPanel.shipping.selectLastShippingAdress();
});

When(`quand les services s'affichent`, () => {
  cy.get('.servicesChoice').should('exist');
});

When(`j'enregistre la commande`, () => {
  orderCreationPanel.saveOrder();
});

Then(`ma commande a été enregistrée`, () => {
  orderCreationPanel.lastOrder.getLastOrder();
  orderCreationPanel.lastOrder.statusIsUnvalid();
});

Then(`les noms doivent apparaitre en regard des toggles`, () => {
  orderCreationPanel.getServicesNames(services => {
    expect(services.length).to.be.greaterThan(0);
  });
});
