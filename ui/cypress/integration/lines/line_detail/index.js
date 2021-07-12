import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import lineDetailPage from '../../../pageObjects/lineDetailPage';
import linesPage from '../../../pageObjects/linesPage';
import massActionsDetailsPage from '../../../pageObjects/massActionsDetailsPage';

Given(`Je suis sur la page de gestion de lignes`, () => {
  linesPage.init();
  cy.wait(2000);
});

Given(`je lance la recherche par ID {string}`, (id) => {
  linesPage.idSearch.typeId(id);
  linesPage.idSearch.applySearch();
});

Given(`j'ouvre le panneau de détail de la ligne`, () => {
  lineDetailPage.openDetailPannel();
});

Given('Je clique sur "Voir le detail de la ligne"', () => {
  lineDetailPage.openDetailLine();
});

Given('Je clique sur le bouton "Changer de carte SIM"', () => {
  lineDetailPage.buttons.changerCarteSIM.click();
});

Given('Je clique sur le bouton "Changer de MSISDN"', () => {
  lineDetailPage.buttons.changerMSISDN.click();
});

Given('Je clique sur le bouton "Changer de CF"', () => {
  lineDetailPage.buttons.changementCF.click();
});

Given('Je clique sur le bouton "Changer d\'offre"', () => {
  lineDetailPage.buttons.changerOffre.click();
});

Given('Je rentre le nouvel ICCID {string}', (iccid) => {
  lineDetailPage.buttons.changerCarteSIM.newICCID(iccid);
});

Given('Je rentre le nouvel MSISDN {string}', (msisdn) => {
  lineDetailPage.buttons.changerMSISDN.newMSISDN(msisdn);
});

Given('Je selectionne le compte {string}', (cf) => {
  lineDetailPage.buttons.changementCF.newCF(cf);
});

Given("Je selectionne l'offre {string}", (offre) => {
  lineDetailPage.buttons.changerOffre.newOffre(offre);
});

Given('Je clique sur "Liste des alarmes"', () => {
  lineDetailPage.tab.detailsOptions.alarms();
});

Given('Je clique sur "Suivi pilotage des actes de gestion"', () => {
  lineDetailPage.tab.detailsOptions.acts();
});

Given("Je clique sur l'acte de masse de la premiere ligne", () => {
  lineDetailPage.tab.detailsOptions.actsDetails.openMassAction();
});

Given('Je clique sur "Voir le resultat de l\'acte"', () => {
  lineDetailPage.tab.detailsOptions.actsDetails.showActResultClick();
});

Given("Je vérifie que l'url contient {string}", (url) => {
  lineDetailPage.tab.detailsOptions.actsDetails.verifyUrl(url);
});

When(`je clique sur voir l'en-cours`, () => {
  lineDetailPage.inProgress.openInProgress();
});

When('Je clique sur "Voir le detail de la ligne"', () => {
  lineDetailPage.openDetailLine();
});

When('Je clique sur le bouton "Appliquer"', () => {
  lineDetailPage.buttons.apply();
});

When('Je clique sur "Oui" dans la deuxieme ligne dans la colonne "Declenchement"', () => {
  lineDetailPage.tab.detailsOptions.alarmsDetails.openTriggerHistory();
});

When("Je clique sur l'ID de la premiere alarme", () => {
  lineDetailPage.tab.detailsOptions.alarmsDetails.openAlarmModification();
});

When('Je clique sur "Creer une alarme"', () => {
  lineDetailPage.tab.detailsOptions.alarmsDetails.openAlarmCreation();
});

When("Je clique sur l'acte de masse de la premiere ligne", () => {
  lineDetailPage.tab.detailsOptions.actsDetails.openMassAction();
});

When('Je clique sur "Voir le detail du resultat"', () => {
  lineDetailPage.tab.detailsOptions.actsDetails.showResultDetailsClick();
});

When('Je clique sur "Voir le resultat de l\'acte"', () => {
  lineDetailPage.tab.detailsOptions.actsDetails.showActResultClick();
});

When('Je clique sur le bouton "Retour"', () => {
  massActionsDetailsPage.clickBackButton();
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
  lineDetailPage.panel.isVisible();
  lineDetailPage.panel.closePanel();
  lineDetailPage.buttons.changerMSISDN.clickable();
  lineDetailPage.buttons.changerMSISDN.click();
  lineDetailPage.panel.isVisible();
  lineDetailPage.panel.closePanel();
  lineDetailPage.buttons.modifierChampsLibres.clickable();
  lineDetailPage.buttons.modifierChampsLibres.click();
  lineDetailPage.panel.isVisible();
  lineDetailPage.panel.closePanel();
  lineDetailPage.buttons.changementCF.clickable();
  lineDetailPage.buttons.changementCF.click();
  lineDetailPage.panel.isVisible();
  lineDetailPage.panel.closePanel();
  lineDetailPage.buttons.changerOffre.notClickable();
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

Then('Je confirme le changement', () => {
  lineDetailPage.buttons.save();
});

Then("Le panneau s'est ouvert", () => {
  lineDetailPage.panel.isVisible();
});

Then("La page de l'acte de gestion s'est ouverte", () => {
  lineDetailPage.tab.detailsOptions.actsDetails.verifyUrlActDetail();
});

Then("Je vérifie que l'url contient {string}", (url) => {
  lineDetailPage.tab.detailsOptions.actsDetails.verifyUrl(url);
});
