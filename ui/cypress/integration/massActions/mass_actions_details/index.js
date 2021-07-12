import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import massActionsPage from '../../../pageObjects/massActionsPage';
import massActionsDetailsPage from '../../../pageObjects/massActionsDetailsPage';

Given('Je vais sur la page des actes de gestion', () => {
  massActionsPage.init();
  cy.wait(1000);
});

Given('Je recherche par ID {string}', (id) => {
  massActionsPage.idSearch.typeId(id);
  massActionsPage.idSearch.applySearch();
});

Given("Je clique sur l'ID de l'acte de gestion trouvé", () => {
  massActionsPage.clickFirstId();
});

Given('Je clique sur "Voir le résultat de l\'acte"', () => {
  massActionsPage.detailPanel.gotoDetail();
});

Given("Je vérifie que l'url contient {string}", (url) => {
  massActionsPage.verifyUrl(url);
});

When('Je clique sur le bouton "Retour"', () => {
  massActionsDetailsPage.clickBackButton();
});

Then("Je vérifie que l'url contient {string}", (url) => {
  massActionsPage.verifyUrl(url);
});
