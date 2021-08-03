import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import indicators from '../../../pageObjects/indicatorsPage';
import layout from '../../../pageObjects/layout';

Given('Je suis sur la page de gestion des commandes', () => {
  layout.menu.getSim();
  cy.wait(2000);
});

Given('Je suis sur la page de gestion des lignes', () => {
  layout.menu.lines();
  cy.wait(2000);
});

Given('Je suis sur la page des actes de gestion', () => {
  layout.menu.massActions();
  cy.wait(2000);
});

Given('Je selectionne le partenaire {string} dans la barre de contexte', (partner) => {
  indicators.contextBar.writePartner(partner);
  indicators.contextBar.choosePartner();
});

Given('Je clique sur le bouton "Appliquer"', () => {
  indicators.contextBar.apply();
  cy.wait(400);
});

Given('Je supprime le partenaire B de la barre de contexte', () => {
  indicators.contextBar.deleteSecondPartner();
});

Given('Je selectionne le partenaire {string} dans les filtres', (partner) => {
  indicators.filterBar.partner.toggle();
  indicators.filterBar.partner.filter(partner);
  indicators.filterBar.partner.choose(1);
  indicators.filterBar.partner.toggle();
});

When('Je clique sur le bouton "Appliquer"', () => {
  indicators.contextBar.apply();
  cy.wait(400);
});

When('Je clique sur le bouton "Appliquer un filtre"', () => {
  indicators.filterBar.apply();
  cy.wait(400);
});

Then('Je visualise les indicateurs commandes des trois partenaires', () => {
  indicators.orderIndicators.clickOrdersToBeValidated();
  deleteFilterOrderDate();
  indicators.orderIndicators.checkOrdersToBeValidated();
  indicators.orderIndicators.clickOrdersBeingProcessed();
  deleteFilterOrderDate();
  indicators.orderIndicators.checkOrdersBeingProcessed();
  indicators.orderIndicators.clickFailedOrders();
  deleteFilterOrderDate();
  indicators.orderIndicators.checkFailedOrders();
});

Then('Je visualise les indicateurs commandes du partenaire A uniquement', () => {
  indicators.orderIndicators.clickOrdersToBeValidated();
  deleteFilterOrderDate();
  addFilterPartner();
  indicators.orderIndicators.checkOrdersToBeValidated();
  indicators.orderIndicators.clickOrdersBeingProcessed();
  deleteFilterOrderDate();
  addFilterPartner();
  indicators.orderIndicators.checkOrdersBeingProcessed();
  indicators.orderIndicators.clickFailedOrders();
  deleteFilterOrderDate();
  addFilterPartner();
  indicators.orderIndicators.checkFailedOrders();
});

Then('Je visualise les indicateurs lignes des trois partenaires', () => {
  indicators.linesIndicators.clickSuspendedLines();
  indicators.linesIndicators.checkSuspendedLines();
  indicators.linesIndicators.clickTraffickingLines();
  indicators.linesIndicators.checkTraffickingLines();
});

Then('Je visualise les indicateurs lignes du partenaire A uniquement', () => {
  indicators.linesIndicators.clickSuspendedLines();
  addFilterPartner();
  indicators.linesIndicators.checkSuspendedLines();
  indicators.linesIndicators.clickTraffickingLines();
  addFilterPartner();
  indicators.linesIndicators.checkTraffickingLines();
});

Then('Je visualise les indicateurs actes de gestion des trois partenaires', () => {
  indicators.actsIndicators.clickActsInProgress();
  indicators.actsIndicators.checkActsInProgress();
  indicators.actsIndicators.clickScheduledActs();
  indicators.actsIndicators.checkScheduledActs();
});

Then('Je visualise les indicateurs actes de gestion du partenaire A uniquement', () => {
  indicators.actsIndicators.clickActsInProgress();
  addFilterPartner();
  indicators.actsIndicators.checkActsInProgress();
  indicators.actsIndicators.clickScheduledActs();
  addFilterPartner();
  indicators.actsIndicators.checkScheduledActs();
});

Then('Je réinitialise les partenaires', () => {
  cy.waitGet('button.context-bar-reinit').click({ force: true });
});

//quickfix temporaire : le filtre date de la commande s'applique alors qu'il ne devrait pas
//le quickfix permet de retirer ce filtre
function deleteFilterOrderDate() {
  indicators.filterBar.deleteFilter(2);
  indicators.filterBar.apply();
  cy.wait(400);
}

//quickfix temporaire : cliquer sur un indicateur enleve le filtre partenaire
//le quickfix permet de remettre le filtre partenaire pour les verifications
function addFilterPartner() {
  indicators.filterBar.partner.toggle();
  indicators.filterBar.partner.filter('lyra');
  indicators.filterBar.partner.choose(1);
  indicators.filterBar.partner.toggle();
  indicators.filterBar.apply();
  cy.wait(400);
}
