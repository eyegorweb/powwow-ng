/* eslint-disable prettier/prettier */
import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

import reservations from '../../../pageObjects/reservationsPage';
import reservationDetail from '../../../pageObjects/reservationDetailPage';

Given('Je suis sur la page des reservations', () => {
  reservations.init();

  cy.wait(1000);
});

Given('Je lance la recherche par ID {string}', (id) => {
  reservations.idSearch.selectIdType();
  reservations.idSearch.typeId(id);
  reservations.idSearch.applySearch();
});

When("J'ouvre le panneau de detail de la reservation", () => {
  reservationDetail.openDetailPanel();
});

Then(
  "Le panneau de detail s'est correctement ouvert et les donnees ID {string} et nom du partenaire {string} sont presentes",
  (id, partnerName) => {
    reservationDetail.getDetailPanel();
    reservationDetail.data.id(id);
    reservationDetail.data.partnerName(partnerName);
  }
);
