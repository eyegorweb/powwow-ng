import { When, Then } from 'cypress-cucumber-preprocessor/steps';
import userSearchPage from '../../../pageObjects/userSearchPage';
import userPage from '../../../pageObjects/userPage';

When(`je recherche l'utilisateur {string}`, (user) => {
  userSearchPage.search.typeUser(user);
  userSearchPage.search.launchSearch();
  cy.wait(400);
});

When(`je lance la recherche`, () => {
  userSearchPage.filterBar.apply();
  cy.wait(500);
});

Then(`la table contient {int} resultat`, (nbrResult) => {
  userPage.getTotal().then((total) => {
    expect(total).to.be.equal(nbrResult);
  });
});

Then(`la table contient plus de {int} resultat`, (nbrResult) => {
  userPage.getTotal().then((total) => {
    expect(total).to.be.above(nbrResult);
  });
});

Then(`la table contient moins de {int} resultat`, (nbrResult) => {
  userPage.getTotal().then((total) => {
    expect(total).to.be.below(nbrResult);
  });
});

Then('Je supprime les filtres', () => {
  userSearchPage.filterBar.deleteFilter();
});

Then('Je réinitialise la recherche', () => {
  userSearchPage.search.reinit();
});
