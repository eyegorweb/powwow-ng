import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import layout from '../../../pageObjects/layout';
import getReportPage from '../../../pageObjects/getReportPage'

Given(`je suis sur la page du dashborad getReport`, () => {
  layout.menu.dashboard();
})

Given(`je filtre par partenaire {string}`, partner => {
  getReportPage.dashboard.filterPartner(partner);
});

When(`j'applique le filtre`, () => {
  getReportPage.dashboard.applyFilter();
});

Then(`le graphe s'affiche correctement`, () => {
  getReportPage.dashboard.getGraphe().should('exist');
});
