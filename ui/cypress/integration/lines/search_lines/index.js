import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import linesPage from '../../../pageObjects/linesPage';
import lineDetailPage from '../../../pageObjects/lineDetailPage';
import get from 'lodash.get';

Given(`je suis sur la page recherche de lignes`, () => {
  cy.resetGQLCache();
  linesPage.init();
  cy.wait(400);
});

Given(`j'ouvre le détail d'une ligne`, () => {
  linesPage.showAllLines();
  linesPage.panel.openForLine(1);
  linesPage.panel.goToDetail();
});

When(`je lance la recherche par ID {string}`, (id) => {
  linesPage.idSearch.typeId(id);
  linesPage.idSearch.applySearch();
  cy.wait(500);
});

When(`je clique sur retour`, () => {
  lineDetailPage.goBack();
});

Then(`la table contient les résultats de la page précédente`, () => {
  linesPage.getRows((elements) => {
    expect(elements.length).to.be.above(0);
  });
});

Given(`je choisis le filtre partenaire {string}`, (partnerName) => {
  linesPage.filterBar.partner.toggle();
  linesPage.filterBar.partner.filter(partnerName);
  linesPage.filterBar.partner.choose(1);
  linesPage.filterBar.close();
});

Given(`je choisis le filtre compte de facturation {string}`, (billingAccount) => {
  linesPage.filterBar.billingAccount.toggle();
  linesPage.filterBar.billingAccount.filter(billingAccount);
  linesPage.filterBar.billingAccount.choose(1);
  linesPage.filterBar.close();
});

Given(`je choisis le filtre type {string}`, (simType) => {
  linesPage.filterBar.type.toggle();
  linesPage.filterBar.type.filter(simType);
  linesPage.filterBar.type.choose(1);
  linesPage.filterBar.close();
});

Given(`je choisis le filtre offre {string}`, (offer) => {
  linesPage.filterBar.offer.toggle();
  linesPage.filterBar.offer.filter(offer);
  linesPage.filterBar.offer.choose(1);
  linesPage.filterBar.close();
});

Given(`je choisis le filtre statut de facturation {string}`, (billingStatus) => {
  linesPage.filterBar.showAllTypes();
  linesPage.filterBar.billingStatus.toggle();
  linesPage.filterBar.billingStatus.filter(billingStatus);
  linesPage.filterBar.billingStatus.choose(1);
});

Given('je choisis le filtre statut de la ligne {string}', (lineStatus) => {
  linesPage.filterBar.showAllTypes();
  linesPage.filterBar.lineStatus.toggle();
  linesPage.filterBar.lineStatus.filter(lineStatus);
  linesPage.filterBar.lineStatus.choose(1);
});

Given(`je choisis le filtre id {string}`, (offer) => {
  linesPage.filterBar.id.toggle();
  linesPage.filterBar.id.filter(offer);
});

Given(`j'affiche toutes les lignes`, () => {
  linesPage.showAllLines();
});

Given("J'enregistre les filtres sous le nom de {string}", (filterName) => {
  linesPage.filterBar.saveFilter(filterName);
});

Given('Je supprime les filtres', () => {
  linesPage.filterBar.deleteFilter();
});

When('Je clique sur le filtre enregistré', () => {
  linesPage.filterBar.openSavedFilter();
  linesPage.filterBar.clickFirstSavedFilter();
});

Then('Les filtres {string} et {string} sont activés', (partner, billingAccount) => {
  linesPage.filterBar.checkFilters(partner, billingAccount);
  linesPage.filterBar.deleteSavedFilter();
  linesPage.modal.save();
});

When(`je lance la recherche`, () => {
  linesPage.filterBar.apply();
  cy.wait(500);
});

Then(`la table contient {int} resultat`, (nbrResult) => {
  cy.wrap(null).then(() => {
    return cy.waitUntiGQLIsSent('simCardInstances').then(({ response }) => {
      expect(get(response, 'body.data.simCardInstances.total')).to.be.equal(nbrResult);
    });
  });
});

Then(`la table contient plus de {int} resultat`, (nbrResult) => {
  cy.wrap(null).then(() => {
    return cy.waitUntiGQLIsSent('simCardInstances').then(({ response }) => {
      expect(get(response, 'body.data.simCardInstances.total')).to.be.above(nbrResult);
    });
  });
});

When(`je lance un Export {string}`, (exportType) => {
  linesPage.exportFile.openChoice();
  linesPage.chooseExportType(exportType);
  linesPage.exportFile.chooseFormat('csv');
});

When(`je lance un Export supplémentaire {string}`, (exportType) => {
  linesPage.exportFile.openChoice();
  linesPage.chooseOtherExportType(exportType);
  linesPage.exportFile.chooseFormat('csv');
});

Then(`le fichier est bien téléchargé`, () => {
  cy.wait(500);
  cy.wrap(null).then(() => {
    return cy.waitUntiGQLIsSent('exportSimCardInstances').then((http) => {
      const downloadUri = get(http.response, 'body.data.exportSimCardInstances.downloadUri');
      expect(downloadUri).to.not.be.undefined;
    });
  });
});
