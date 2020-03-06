import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import massActionsPage from '../../../pageObjects/massActionsPage';
import moment from 'moment';

Given(`je suis sur l'historique des actes de gestion`, () => {
  massActionsPage.init();
});
Given(`Je choisis  le filtre par date de création`, () => {
  massActionsPage.filterBar.creationDate.toggle();
  massActionsPage.filterBar.creationDate.openChoices();
});
When(`Je clique sur 1 mois`, () => {
  massActionsPage.filterBar.creationDate.preselect(1);
});
Then(`je peux appliquer le filtre`, () => {
  massActionsPage.filterBar.getSelectedFilters(values => {
    const tmp = values[0].replace('Du ', '').replace(' au ', ',');

    const parts = tmp.split(',');

    const dateFrom = moment(parts[0], 'DD/MM/YYYY');
    const dateTo = moment(parts[1], 'DD/MM/YYYY');

    const diffInDays = dateTo.diff(dateFrom, 'days') + 1;

    expect(diffInDays).to.equal(30);
  });
});
