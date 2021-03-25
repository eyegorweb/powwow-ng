import { Given, When, Then, And } from 'cypress-cucumber-preprocessor/steps';
import layout from '../../../pageObjects/layout';
import dashboardExport from '../../../pageObjects/dashboardExport';
import getReportPage from '../../../pageObjects/getReportPage';

Given(`je suis sur la page du dashboard getReport`, () => {
  layout.menu.dashboard();
});

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
