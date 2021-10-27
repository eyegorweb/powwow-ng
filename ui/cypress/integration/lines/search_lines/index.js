import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import linesPage from '../../../pageObjects/linesPage';
import lineDetailPage from '../../../pageObjects/lineDetailPage';
import get from 'lodash/get';

let totalLines = 0;

Given(`j'ouvre le détail d'une ligne`, () => {
  linesPage.showAllLines();
  linesPage.panel.openForLine(1);
  linesPage.panel.goToDetail();
});

Given("j'affiche tous les filtres", () => {
  linesPage.filterBar.showAllTypes();
});

Given('je lance la recherche', () => {
  linesPage.filterBar.apply();
  cy.wait(400);
  getTotalLines();
  cy.wait(500);
});

When(`je lance la recherche par ID {string}`, (id) => {
  linesPage.idSearch.typeId(id);
  linesPage.idSearch.applySearch();
  cy.wait(500);
  getTotalLines();
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
  linesPage.filterBar.partner.toggle();
});

Given(`je choisis le filtre compte de facturation {string}`, (billingAccount) => {
  linesPage.filterBar.billingAccount.toggle();
  linesPage.filterBar.billingAccount.filter(billingAccount);
  linesPage.filterBar.billingAccount.choose(1);
  linesPage.filterBar.billingAccount.toggle();
});

Given(`je choisis le filtre type {string}`, (simType) => {
  linesPage.filterBar.type.toggle();
  linesPage.filterBar.type.filter(simType);
  linesPage.filterBar.type.choose(1);
  linesPage.filterBar.type.toggle();
});

Given(`je choisis le filtre offre {string}`, (offer) => {
  linesPage.filterBar.offer.toggle();
  linesPage.filterBar.offer.filter(offer);
  linesPage.filterBar.offer.choose(1);
  linesPage.filterBar.offer.toggle();
});

Given(`je choisis le filtre statut de facturation {string}`, (billingStatus) => {
  linesPage.filterBar.showAllTypes();
  linesPage.filterBar.billingStatus.toggle();
  linesPage.filterBar.billingStatus.filter(billingStatus);
  linesPage.filterBar.billingStatus.choose(1);
  linesPage.filterBar.billingStatus.toggle();
});

Given('je choisis le filtre statut de la ligne {string}', (lineStatus) => {
  linesPage.filterBar.lineStatus.toggle();
  linesPage.filterBar.lineStatus.filter(lineStatus);
  linesPage.filterBar.lineStatus.choose(1);
  linesPage.filterBar.lineStatus.toggle();
});

Given(`je choisis le filtre id {string}`, (offer) => {
  linesPage.filterBar.id.toggle();
  linesPage.filterBar.id.filter(offer);
  linesPage.filterBar.id.toggle();
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
  getTotalLines();
});

Then(`la table contient {int} resultat`, (nbrResult) => {
  expect(totalLines).to.be.equal(nbrResult);
});

Then(`la table contient plus de {int} resultat`, (nbrResult) => {
  expect(totalLines).to.be.above(nbrResult);
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

Then('Je ferme le message', () => {
  linesPage.modal.cancel();
});

Then('Je supprime les filtres', () => {
  linesPage.filterBar.deleteFilter();
});

function getTotalLines() {
  cy.waitGet('.mb-3 > :nth-child(1) > .text-gray').then((e) => {
    const parts = e
      .text()
      .trim()
      .split(' ');
    const value = parseInt(parts[0]);
    totalLines = value;
  });
}
