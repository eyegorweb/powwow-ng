import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import dashboardExport from '../../../pageObjects/dashboardExport';
import getReportPage from '../../../pageObjects/getReportPage';

Given(`j'export l'historique de conso`, () => {
  dashboardExport.export.historyConsoExport();
});
Given(`j'export le statut du parc`, () => {
  dashboardExport.export.parcStateExport();
});

Given(`je filtre par partenaire {string}`, partner => {
  getReportPage.dashboard.filterPartner(partner);
});

When(`j'applique le filtre`, () => {
  getReportPage.dashboard.applyFilter();
});

Then(`le fichier est bien téléchargé`, () => {
  dashboardExport.export.controlExportFile();
});
