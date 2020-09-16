import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import linesPage from '../../../pageObjects/linesPage';
import lineDetailPage from '../../../pageObjects/lineDetailPage';

Given(`je suis sur la page recherche de lignes`, () => {
  linesPage.init();
  cy.wait(400);
});
Given(`j'ouvre le détail d'une ligne`, () => {
  cy.wait(600);

  linesPage.showAllLines();
  cy.wait(200);

  linesPage.panel.openForLine(1);
  linesPage.panel.goToDetail();
});

When(`je lance la recherche par ID {string}`, id => {
  linesPage.idSearch.typeId(id);
  linesPage.idSearch.applySearch();
  cy.wait(500);
});

When(`je clique sur retour`, () => {
  lineDetailPage.goBack();
});
Then(`la table contient les résultats de la page précédente`, () => {
  linesPage.getRows(elements => {
    expect(elements.length).to.be.above(0);
  });
});

Given(`je choisis le filtre partenaire {string}`, partnerName => {
  linesPage.filterBar.partner.toggle();
  linesPage.filterBar.partner.filter(partnerName);
  linesPage.filterBar.partner.choose(1);
});

Given(`je choisis le filtre compte de facturation {string}`, billingAccount => {
  linesPage.filterBar.billingAccount.toggle();
  linesPage.filterBar.billingAccount.filter(billingAccount);
  linesPage.filterBar.billingAccount.choose(1);
});

Given(`je choisis le filtre type {string}`, simType => {
  linesPage.filterBar.type.toggle();
  linesPage.filterBar.type.filter(simType);
  linesPage.filterBar.type.choose(1);
});

Given(`je choisis le filtre offre {string}`, offer => {
  linesPage.filterBar.offer.toggle();
  linesPage.filterBar.offer.filter(offer);
  linesPage.filterBar.offer.choose(1);
});

Given(`je choisis le filtre id {string}`, offer => {
  linesPage.filterBar.id.toggle();
  linesPage.filterBar.id.filter(offer);
});

When(`je lance la recherche`, () => {
  linesPage.filterBar.apply();
  cy.wait(500);
});

Then(`la table contient {int} resultat`, nbrResult => {
  linesPage.getTotal(total => {
    expect(total).to.equal(nbrResult);
  });
});

Then(`la table contient plus de {int} resultat`, nbrResult => {
  linesPage.getTotal(total => {
    expect(total).to.be.above(nbrResult);
  });
});

Then(`la table contient moins de {int} resultat`, nbrResult => {
  linesPage.getTotal(total => {
    expect(total).to.be.below(nbrResult);
  });
});
