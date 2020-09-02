import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import createActionsPage from '../../../pageObjects/createActionsPage';
import massActionsPage from '../../../pageObjects/massActionsPage';
import layout from '../../../pageObjects/layout';

let totalMassAction = 0;
let typeMassAction = '';

Given(`je suis sur la page de création d'actes de gestion`, () => {
  layout.menu.massActions();
  cy.wait(400);
  massActionsPage.getTotal().then(total => {
    totalMassAction = total;
    createActionsPage.init();
  });
});

Given(`je choisis l'acte de suspension par défaut`, () => {
  typeMassAction = 'Suspension';
  createActionsPage.actionsPannel.suspend();
  createActionsPage.actions.suspend.selectPartner('Lyra');
  createActionsPage.actions.suspend.apply();
});

Given(`je choisis l'acte d'activation par défaut`, () => {
  typeMassAction = 'Pré-activation et Activation';
  createActionsPage.actionsPannel.activate();
  createActionsPage.actions.activate.selectPartner('Lyra');
  createActionsPage.actions.activate.selectBillingAccount('6.42661 - LYRA');
  createActionsPage.actions.activate.apply();
  createActionsPage.actions.activate.activation();
  createActionsPage.actions.activate.selectOffre('Parc 2 forfait');
});

When(`je confirme la création de l'acte`, () => {
  createActionsPage.confirm(typeMassAction);
});

Then(`je verifie que mon acte a été créé`, () => {
  layout.menu.massActions();
  cy.wait(400);
  massActionsPage.getTotal().then(newTotal => {
    expect(newTotal).to.be.equal(totalMassAction + 1);
  });
  createActionsPage.getLastActionType().should('have.text', typeMassAction);
});
