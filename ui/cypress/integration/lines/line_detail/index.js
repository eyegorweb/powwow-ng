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

Then("Je peux cliquer sur les boutons et les panneaux s'ouvrent", () => {
  lineDetailPage.buttons.changerCarteSIM.clickable();
  lineDetailPage.buttons.changerCarteSIM.click();
  lineDetailPage.buttons.panel.isVisible();
  lineDetailPage.buttons.panel.closePanel();
  lineDetailPage.buttons.changerMSISDN.clickable();
  lineDetailPage.buttons.changerMSISDN.click();
  lineDetailPage.buttons.panel.isVisible();
  lineDetailPage.buttons.panel.closePanel();
  lineDetailPage.buttons.modifierChampsLibres.clickable();
  lineDetailPage.buttons.modifierChampsLibres.click();
  lineDetailPage.buttons.panel.isVisible();
  lineDetailPage.buttons.panel.closePanel();
  lineDetailPage.buttons.changementCF.clickable();
  lineDetailPage.buttons.changementCF.click();
  lineDetailPage.buttons.panel.isVisible();
  lineDetailPage.buttons.panel.closePanel();
  lineDetailPage.buttons.changerOffre.clickable();
  lineDetailPage.buttons.changerOffre.click();
  lineDetailPage.buttons.panel.isVisible();
  lineDetailPage.buttons.panel.closePanel();
});

Then('Le tableau de consommation est present dans l\'onglet "EN COURS DE CONSOMMATION"', () => {
  lineDetailPage.tab.ongoing();
  lineDetailPage.tab.ongoingDetails.tableIsVisible();
});

Then("Je peux cliquer sur les differents menus de l'onglet d'analyse", () => {
  lineDetailPage.tab.analysis();
  lineDetailPage.tab.analysisDetails.menu.tests();
  lineDetailPage.tab.analysisDetails.menu.networkLocationTest();
  lineDetailPage.tab.analysisDetails.menu.networkTestControl();
  lineDetailPage.tab.analysisDetails.menu.supervision();
  lineDetailPage.tab.analysisDetails.menu.networkHistory();
});

Then("Le message d'avertissement est present dans les onglets de consommation et d'analyse", () => {
  lineDetailPage.tab.ongoing();
  lineDetailPage.tab.ongoingDetails.warningMessageIsVisible();
  lineDetailPage.tab.analysis();
  lineDetailPage.tab.analysisDetails.warningMessageIsVisible();
});

Then('Je verifie que les boutons ne sont pas clickable', () => {
  lineDetailPage.buttons.changerCarteSIM.notClickable();
  lineDetailPage.buttons.changerMSISDN.notClickable();
  lineDetailPage.buttons.modifierChampsLibres.notClickable();
  lineDetailPage.buttons.changementCF.notClickable();
  lineDetailPage.buttons.changerOffre.notClickable();
});
