import { Given, Then } from 'cypress-cucumber-preprocessor/steps';
import layout from '../../../pageObjects/layout';
import billsPage from '../../../pageObjects/billsPage';

Given('je suis sur la page factures', () => {
  layout.menu.bills();
});

Given(`je choisis le filtre partenaire {string}`, (partner) => {
  billsPage.selectPartner(partner);
});

Then(`mon filtre a été enregistré`, () => {
  billsPage.getSelectedFilters();
});
