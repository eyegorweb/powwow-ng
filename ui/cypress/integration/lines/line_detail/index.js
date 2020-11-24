import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import lineDetailPage from '../../../pageObjects/lineDetailPage';
import linesPage from '../../../pageObjects/linesPage';

Given(`je suis sur la page détail d'une ligne`, () => {
  linesPage.init();
  cy.wait(400);
});

Given(`je lance la recherche par ID {string}`, id => {
  linesPage.idSearch.typeId(id);
  linesPage.idSearch.applySearch();
});

Given(`j'ouvre le panneau de détail de la ligne`, () => {
  lineDetailPage.openDetailPannel();
});

When(`je clique sur voir l'en-cours`, () => {
  lineDetailPage.inProgress.openInProgress();
});

Then(`la table de l'en-cours existe`, () => {
  lineDetailPage.inProgress.getTable().should('exist');
});

Then(`la table de l'en-cours n'existe pas`, () => {
  lineDetailPage.inProgress.getTable().should('not.exist');
});
