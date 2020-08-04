import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import massActionsPage from '../../../pageObjects/massActionsPage';
import moment from 'moment';

Given(`je suis sur l'historique des actes de gestion`, () => {
  massActionsPage.init();
});
Given(`je choisis le filtre par date de création`, () => {
  massActionsPage.filterBar.creationDate.toggle();
  massActionsPage.filterBar.creationDate.openChoices();
});
When(`je clique sur 1 mois`, () => {
  massActionsPage.filterBar.creationDate.preselect(1);
});
Then(`je peux appliquer le filtre`, () => {
  massActionsPage.filterBar.getSelectedFilters(values => {
    const tmp = values[1].replace('Du ', '').replace(' au ', ',');

    const parts = tmp.split(',');

    const dateFrom = moment(parts[0], 'DD/MM/YYYY');
    const dateTo = moment(parts[1], 'DD/MM/YYYY');

    const diffInMonths = dateTo.diff(dateFrom, 'month');

    expect(diffInMonths).to.equal(1);
  });
});
