import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import massActionsPage from '../../../pageObjects/massActionsPage';
import moment from 'moment';

Given(`je suis sur l'historique des actes de gestion`, () => {
  massActionsPage.init();
  cy.wait(400);
});

Given(`j'enlève le filtre par défaut`, () => {
  massActionsPage.filterBar.removeDefaultFilter();
});

Given(`je choisis le filtre par date de création`, () => {
  massActionsPage.filterBar.creationDate.toggle();
  massActionsPage.filterBar.creationDate.openChoices();
});

Given (`je choisis le filtre partenaire {string}`, partnerName => {
  massActionsPage.filterBar.partner.toggle();
  massActionsPage.filterBar.partner.filter(partnerName);
  massActionsPage.filterBar.partner.choose(1);
});

Given (`je choisis le filtre createur de la demande {string}`, requestCreator => {
  massActionsPage.filterBar.requestCreator.toggle();
  massActionsPage.filterBar.requestCreator.filter(requestCreator);
  massActionsPage.filterBar.requestCreator.choose(1);
});

Given (`je choisis le filtre type d'acte {string}`, actionType => {
  massActionsPage.filterBar.actionType.toggle();
  massActionsPage.filterBar.actionType.filter(actionType);
  massActionsPage.filterBar.actionType.choose(1);
});

When(`je clique sur 1 mois`, () => {
  massActionsPage.filterBar.creationDate.preselect(1);
});

When(`je lance la recherche`, () => {
  massActionsPage.filterBar.apply();
  cy.wait(500);
});

When(`je lance la recherche par ID {string}`, id => {
  massActionsPage.idSearch.typeId(id);
  massActionsPage.idSearch.applySearch();
  cy.wait(500);
});

Then(`la table contient {int} resultat`, nbrResult => {
  massActionsPage.getTotal().then(total => {
    expect(total).to.be.equal(nbrResult);
  });
});

Then(`la table contient plus de {int} resultat`, nbrResult => {
  massActionsPage.getTotal().then(total => {
    expect(total).to.be.above(nbrResult);
  });
});

Then(`la table contient moins de {int} resultat`, nbrResult => {
  massActionsPage.getTotal().then(total => {
    expect(total).to.be.below(nbrResult);
  });
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
