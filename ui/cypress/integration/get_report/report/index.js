import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import layout from '../../../pageObjects/layout';
import report from '../../../pageObjects/reportManagementPage';

//Instructions communes à plusieurs tests

Given('Je suis sur la page de gestion des rapports', () => {
  layout.menu.report();
  cy.wait(400);
});

Given('Je clique sur "Créer un rapport"', () => {
  report.createReport();
});

Given('Je choisis le partenaire {string}', (partner) => {
  report.panel.partner.selectPartner(partner);
});

Given('Je rentre le nom du rapport {string}', (name) => {
  report.panel.reportName(name);
});

Given('Je choisis le format CSV', () => {
  report.panel.fileFormat('CSV');
});

Given('Je cree un rapport classique {string}', (name) => {
  report.createReport();
  report.panel.partner.selectPartner('lyra');
  report.panel.chooseInformation.selectFromAReportTemplate('M2M');
  report.panel.reportName(name);
  report.panel.fileFormat('CSV');
  report.panel.save();
});

When('Je clique sur "Enregistrer"', () => {
  report.panel.save();
});

Then('Je verifie la création du rapport {string}', (name) => {
  report.checkFirstReportName(name);
});

//Scenario: Je veux faire un rapport classique

Given("Je choisis l'export classique", () => {
  report.panel.chooseInformation.selectFromAReportTemplate('M2M');
});

//Scenario: Je veux faire un rapport Dernier usage

Given("Je choisis l'export dernier usage", () => {
  report.panel.chooseInformation.selectFromAReportTemplate('LAST_USAGE');
});

//Scenario: Je veux faire un rapport Export des services

Given("Je choisis l'export Export des services", () => {
  report.panel.chooseInformation.selectFromAReportTemplate('SERVICES');
});

//Scenario: Je veux faire un rapport personnalise

Given("Je choisis l'information technique ICCID", () => {
  report.panel.chooseInformation.technicalInformation.open();
  report.panel.chooseInformation.technicalInformation.select(1);
});

Given("Je choisis l'information Dual SIM Dual ICCID", () => {
  report.panel.chooseInformation.dualSIMInformation.open();
  report.panel.chooseInformation.dualSIMInformation.select(1);
});

Given("Je choisis l'information commerciale Nom de l'offre", () => {
  report.panel.chooseInformation.commercialInformation.open();
  report.panel.chooseInformation.commercialInformation.select(1);
});

Given("Je choisis l'information de la commande ID de la commande", () => {
  report.panel.chooseInformation.orderInformation.open();
  report.panel.chooseInformation.orderInformation.select(1);
});

Given('Je choisis la consommation Encours Data montant', () => {
  report.panel.chooseInformation.consumption.open();
  report.panel.chooseInformation.consumption.select(1);
});

Given("Je choisis l'information dernier usage Statut de la derniere connexion data", () => {
  report.panel.chooseInformation.lastUsedInformation.open();
  report.panel.chooseInformation.lastUsedInformation.select(1);
});

Given('Je choisis de generer le rapport hebdomadairement', () => {
  report.panel.generateReport.selectWeekly();
});

Given('Je supprime la derniere donnee depuis les donnees du rapport', () => {
  report.panel.deleteDataFromReportData();
});

//Scenario: Je veux desactiver un rapport

When('Je desactive le rapport', () => {
  report.unselectFirstReport();
});

Then('Je verifie que le rapport est bien desactive', () => {
  report.showStatusReport();
  report.checkFirstReportStatus('Désactivé');
});

//Scenario: Je verifie l'apparition du panneau des details du rapport en cliquant sur le nom

When('Je clique sur le nom du rapport', () => {
  report.clickFirstReportName();
});

//Scenario: Je verifie l'apparition du panneau des details du rapport en cliquant sur "Voir le detail" dans les actions

When('Je clique sur "Voir le detail" dans les actions', () => {
  report.displayDetailsFirstReport();
});

//Panel

Then('Le panneau de detail est visible', () => {
  report.panel.isVisible();
});
