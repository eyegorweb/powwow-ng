import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

import orderPage from '../../../pageObjects/orderPage';
import orderCreationPanel from '../../../pageObjects/orderCreationPanel';
import get from 'lodash.get';

Given(`je suis sur la page recherche de commandes`, () => {
  cy.resetGQLCache();
  orderPage.init();
  cy.wait(400);
});

Given('Je créé une commande par défaut pour le partenaire AUCHAN', () => {
  orderCreationPanel.init();
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
  orderCreationPanel.saveOrder();
});

When(`je lance un Export`, () => {
  orderPage.exportFile.openChoice();
  orderPage.exportFile.chooseFormat('csv');
});

When(`je lance la recherche`, () => {
  orderPage.filterBar.apply();
  cy.wrap(null).then(() => {
    return cy.waitUntiGQLIsSent('orders').then(() => {});
  });
});

When(`je lance la recherche par ID {string}`, (id) => {
  orderPage.idSearch.typeId(id);
  orderPage.idSearch.applySearch();
  cy.wrap(null).then(() => {
    return cy.waitUntiGQLIsSent('orders').then(() => {});
  });
});

Then(`le fichier est bien téléchargé`, () => {
  cy.wrap(null).then(() => {
    return cy.waitForGQL('ordersExport').then((response) => {
      const downloadUri = get(response, 'body.data.ordersExport.downloadUri');
      expect(downloadUri).to.not.be.undefined;
    });
  });
});

Then(`la table contient {int} resultat`, (nbrResult) => {
  orderPage.getTotal((total) => {
    expect(total).to.equal(nbrResult);
  });
});

Then(`la table contient plus de {int} resultat`, (nbrResult) => {
  orderPage.getTotal((total) => {
    expect(total).to.be.above(nbrResult);
  });
});

Then(`la table contient moins de {int} resultat`, (nbrResult) => {
  orderPage.getTotal((total) => {
    expect(total).to.be.below(nbrResult);
  });
});

Then('Je supprime les filtres', () => {
  orderPage.filterBar.deleteFilter();
});
