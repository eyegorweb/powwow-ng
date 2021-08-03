import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import layout from '../../../pageObjects/layout';
import userSearchPage from '../../../pageObjects/userSearchPage';
import userPage from '../../../pageObjects/userPage';

Given(`je suis sur la page de recherche d'utilisateurs`, () => {
  layout.menu.userManagement();
});

Given(`je choisis le filtre nom {string}`, (name) => {
  userSearchPage.filterBar.name.toggle();
  userSearchPage.filterBar.name.filter(name);
  userSearchPage.filterBar.name.toggle();
});

Given(`je choisis le filtre email {string}`, (email) => {
  userSearchPage.filterBar.email.toggle();
  userSearchPage.filterBar.email.filter(email);
  userSearchPage.filterBar.email.toggle();
});

Given(`je choisis le filtre partenaire {string}`, (partner) => {
  userSearchPage.filterBar.partner.toggle();
  userSearchPage.filterBar.partner.filter(partner);
  userSearchPage.filterBar.partner.choose(1);
  userSearchPage.filterBar.partner.toggle();
});

Given(`je choisis le filtre rôle {string}`, (role) => {
  userSearchPage.filterBar.role.toggle();
  userSearchPage.filterBar.role.filter(role);
  userSearchPage.filterBar.role.choose(1);
  userSearchPage.filterBar.role.toggle();
});

Given(`je choisis le filtre groupe de partenaires {string}`, (groupName) => {
  userSearchPage.filterBar.partnerGroup.toggle();
  userSearchPage.filterBar.partnerGroup.filter(groupName);
  userSearchPage.filterBar.partnerGroup.choose(1);
  userSearchPage.filterBar.partnerGroup.toggle();
});

Given(`je choisis le filtre statut {string}`, (status) => {
  userSearchPage.filterBar.status.toggle();
  userSearchPage.filterBar.status.selectStatus(status);
  userSearchPage.filterBar.status.toggle();
});

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
