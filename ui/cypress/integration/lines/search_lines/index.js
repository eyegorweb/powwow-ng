import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import linesPage from '../../../pageObjects/linesPage';
import lineDetailPage from '../../../pageObjects/lineDetailPage';

Given(`je suis sur la page recherche de lignes`, () => {
  linesPage.init();
});
Given(`j'ouvre le détail d'une ligne`, () => {
  cy.wait(600);

  linesPage.showAllLines();
  cy.wait(200);

  linesPage.panel.openForLine(1);
  linesPage.panel.goToDetail();
});
When(`je clique sur retour`, () => {
  lineDetailPage.goBack();
});
Then(`la table contient les résultats de la page précédente`, () => {
  linesPage.getRows(elements => {
    expect(elements.length).to.be.above(0);
  });
});

Given(`je choisis le partenaire {string}`, partnerName => {
  linesPage.filterBar.partner.toggle();
  linesPage.filterBar.partner.filter(partnerName);
  linesPage.filterBar.partner.choose(1);
});

When(`je lance la recherche`, () => {
  linesPage.filterBar.apply();
});

Then(`la table contient le resultat de ma recherche`, () => {
  linesPage.getTotal(total => {
    expect(total).to.be.above(0);
  });
});
