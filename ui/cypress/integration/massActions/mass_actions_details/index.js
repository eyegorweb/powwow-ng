import { Given, Then } from 'cypress-cucumber-preprocessor/steps';
import massActionsPage from '../../../pageObjects/massActionsPage';

Given('Je recherche par ID {string}', (id) => {
  massActionsPage.idSearch.typeId(id);
  massActionsPage.idSearch.applySearch();
});

Given("Je clique sur l'ID de l'acte de gestion trouvé", () => {
  massActionsPage.clickFirstId();
  cy.wait(500);
});

Given("Je vérifie que l'url contient {string}", (url) => {
  massActionsPage.verifyUrl(url);
  cy.wait(500);
});

Then("Je vérifie que l'url contient {string}", (url) => {
  massActionsPage.verifyUrl(url);
});
