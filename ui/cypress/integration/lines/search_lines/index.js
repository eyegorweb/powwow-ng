import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import linesPage from '../../../pageObjects/linesPage';
import lineDetailPage from '../../../pageObjects/lineDetailPage';

Given(`je suis sur la page recherche de lignes`, () => {
  linesPage.init();
});
Given(`J'ouvre le détail d'une ligne`, () => {
  linesPage.showAllLines();
  linesPage.panel.openForLine(1);
  linesPage.panel.goToDetail();
});
When(`Je clique sur retour`, () => {
  lineDetailPage.goBack();
});
Then(`La table contient les résultats de la page précédente`, () => {
  linesPage.getRows(elements => {
    expect(elements.length).to.be.above(0);
  });
});
