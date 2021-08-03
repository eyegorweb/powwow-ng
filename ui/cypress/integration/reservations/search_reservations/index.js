import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

import reservations from '../../../pageObjects/reservationsPage';

Given('Je suis sur la page des reservations', () => {
  reservations.init();

  cy.wait(1000);
});

Given("J'ouvre tous les filtres", () => {
  reservations.filterBar.showAllTypes();
});

Given('Je choisis le filtre partenaire {string}', (partnerName) => {
  reservations.filterBar.partner.toggle();
  reservations.filterBar.partner.filter(partnerName);
  reservations.filterBar.partner.choose(1);
});

Given('Je choisis le filtre quantite {string} a {string}', (quantiteMin, quantiteMax) => {
  reservations.filterBar.quantite.toggle();
  reservations.filterBar.quantite.quantiteMin(quantiteMin);
  reservations.filterBar.quantite.quantiteMax(quantiteMax);
});

Given('Je choisis le filtre compte de facturation {string}', (compteFacturation) => {
  reservations.filterBar.compteFacturation.toggle();
  reservations.filterBar.compteFacturation.filter(compteFacturation);
  reservations.filterBar.compteFacturation.choose(1);
});

Given('Je choisis le filtre date de reservation depuis 1 an', () => {
  reservations.filterBar.dateReservation.toggle();
  reservations.filterBar.dateReservation.openChoicesCalendrier();
  reservations.filterBar.dateReservation.selectPeriodeCalendrier(4);
});

Given('Je choisis le filtre type de carte SIM {string}', (typeSIM) => {
  reservations.filterBar.typeSIM.toggle();
  reservations.filterBar.typeSIM.filter(typeSIM);
  reservations.filterBar.typeSIM.choose(1);
});

Given('Je choisis le filtre createur de reservation {string}', (createur) => {
  reservations.filterBar.createurReservation.toggle();
  reservations.filterBar.createurReservation.filter(createur);
  reservations.filterBar.createurReservation.clickAutocomplete(1);
});

Given('Je choisis le filtre action Pre-active', () => {
  reservations.filterBar.action.toggle();
  reservations.filterBar.action.selectCheckbox(1);
});

Given('Je ferme le filtre partenaire', () => {
  reservations.filterBar.partner.toggle();
  cy.wait(400);
});

Given('Je ferme le filtre quantite', () => {
  reservations.filterBar.quantite.toggle();
});

Given('Je ferme le filtre compte de facturation', () => {
  reservations.filterBar.compteFacturation.toggle();
});

Given('Je ferme le filtre date de reservation', () => {
  reservations.filterBar.dateReservation.toggle();
});

Given('Je ferme le filtre type de carte SIM', () => {
  reservations.filterBar.typeSIM.toggle();
});

Given('Je ferme le filtre createur de reservation', () => {
  reservations.filterBar.createurReservation.toggle();
});

When('Je lance la recherche', () => {
  reservations.filterBar.apply();
  cy.wait(500);
});

Then('La table contient plus de {int} resultat', (nbrResult) => {
  console.log('🚀 ~ file: index.js ~ line 82 ~ Then ~ nbrResult', nbrResult);
  reservations.getTotal((total) => {
    expect(total).to.be.above(nbrResult);
  });
});
