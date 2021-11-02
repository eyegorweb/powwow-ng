import { Given, Then } from 'cypress-cucumber-preprocessor/steps';
import billsPage from '../../../pageObjects/billsPage';

Then(`mon filtre a été enregistré`, () => {
  billsPage.getSelectedFilters();
});
