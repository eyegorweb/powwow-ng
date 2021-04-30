import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import lineDetailPage from '../../../pageObjects/lineDetailPage';
import linesPage from '../../../pageObjects/linesPage';

Given(`Je suis sur la page de gestion de lignes`, () => {
  linesPage.init();
  cy.wait(400);
});

Given(`je lance la recherche par ID {string}`, (id) => {
  linesPage.idSearch.typeId(id);
  linesPage.idSearch.applySearch();
});

Given(`j'ouvre le panneau de détail de la ligne`, () => {
  lineDetailPage.openDetailPannel();
});

When(`je clique sur voir l'en-cours`, () => {
  lineDetailPage.inProgress.openInProgress();
});

When('Je clique sur "Voir le detail de la ligne"', () => {
  lineDetailPage.openDetailLine();
});

Then(`la table de l'en-cours existe`, () => {
  lineDetailPage.inProgress.getTable().should('exist');
});

Then(`la table de l'en-cours n'existe pas`, () => {
  lineDetailPage.inProgress.getTable().should('not.exist');
});

Then('Je peux naviguer entre les differents onglets', () => {
  lineDetailPage.tab.details();
  lineDetailPage.tab.detailsOptions.info();
  lineDetailPage.tab.detailsOptions.billing();
  lineDetailPage.tab.detailsOptions.services();
  lineDetailPage.tab.detailsOptions.alarms();
  lineDetailPage.tab.detailsOptions.acts();
  lineDetailPage.tab.ongoing();
  lineDetailPage.tab.analysis();
});
