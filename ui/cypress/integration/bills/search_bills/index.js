import { Given, Then } from 'cypress-cucumber-preprocessor/steps';
import billsPage from '../../../pageObjects/billsPage';

Given(`je choisis le filtre partenaire {string}`, (partner) => {
  billsPage.selectPartner(partner);
});

Then(`mon filtre a été enregistré`, () => {
  billsPage.getSelectedFilters();
});
