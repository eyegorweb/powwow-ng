import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import layout from '../../../pageObjects/layout';
import document from '../../../pageObjects/documentManagementPage';
import report from '../../../pageObjects/reportManagementPage';

//Instructions communes a plusieurs tests

Given('Je suis la page de gestion des documents', () => {
  layout.menu.document();
  cy.wait(400);
});

Given('Je cree le rapport {string} avec le partenaire {string}', (reportName, partnerName) => {
  layout.menu.report();
  cy.wait(3000);
  report.createReport();
  report.panel.partner.selectPartner(partnerName);
  report.panel.chooseInformation.selectFromAReportTemplate('M2M');
  report.panel.reportName(reportName);
  report.panel.fileFormat('CSV');
  report.panel.save();
});

Given('Je filtre par partenaire {string}', (partnerName) => {
  document.filterBar.partners.toggle();
  document.filterBar.partners.filter(partnerName);
  document.filterBar.partners.choose(1);
});

Given('Je filtre par modele de rapport {string}', (reportName) => {
  document.filterBar.reportModel.toggle();
  document.filterBar.reportModel.filter(reportName);
  document.filterBar.reportModel.choose(1);
});

Given('Je rafraichis la recherche', () => {
  document.filterBar.refresh();
});

When('Je rafraichis la recherche', () => {
  document.filterBar.refresh();
});

//Scenario: Je veux télécharger un document

When('Je clique sur le bouton "Télécharger"', () => {
  document.export.downloadFirstDocument();
});

Then('Le document a bien été téléchargé', () => {
  document.export.controlExportFile();
});

//Scenario: Je veux supprimer un document

Then('La table contient {int} résultat', (nbrLines) => {
  document.getTotal((total) => {
    expect(total).to.equal(nbrLines);
  });
});
