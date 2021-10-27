import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

import createReservations from '../../../pageObjects/createReservationPage';

let totalReservation = 0;

Given('Je choisis le partenaire {string}', (partner) => {
  createReservations.clientChoiceStep.choosePartner(partner);
});

Given('Je choisis le compte de facturation {string}', (billingAccount) => {
  createReservations.clientChoiceStep.chooseBillingAccount(billingAccount);
});

Given("Je passe à l'étape suivante", () => {
  createReservations.nextStep();
});

Given('Je choisis le premier type de carte SIM avec une quantité de {string}', (quantity) => {
  createReservations.productChoiceStep.selectFirstSIMCardType();
  createReservations.productChoiceStep.selectSIMQuantity(quantity);
});

Given("Je choisis la préactivation et l'activation", () => {
  createReservations.servicesChoiceStep.clickPreActivation();
  createReservations.servicesChoiceStep.clickActivation();
});

Given("Je choisis l'offre {string}", (offer) => {
  createReservations.servicesChoiceStep.selectOffer(offer);
});

Given("J'accepte les conditions contractuelles", () => {
  createReservations.acceptContactualConditions();
});

When("J'enregistre la réservation", () => {
  createReservations.saveReservation();
});

Then('Je vérifie la création de la réservation', () => {
  createReservations.verifyCreation(totalReservation);
});

function getTotalReservation() {
  cy.waitGet('.mb-3 > :nth-child(1) > .text-gray').then((e) => {
    const parts = e
      .text()
      .trim()
      .split(' ');
    const value = parseInt(parts[0]);
    totalReservation = value;
  });
}
