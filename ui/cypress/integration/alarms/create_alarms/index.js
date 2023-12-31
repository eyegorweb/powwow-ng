import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import createAlarmsPage from '../../../pageObjects/createAlarmsPage';
import alarmsPage from '../../../pageObjects/alarmsPage';

let totalAlarms = 0;

Given(`j'enregistre le nombre d'alarmes`, () => {
  getTotalAlarms();
  cy.log(totalAlarms);
  cy.wait(500);
});

When(`je valide la création`, () => {
  createAlarmsPage.saveAlarm();
  cy.wait(400);
});

Then(`je vérifie que mon alarme a été créé`, () => {
  alarmsPage.verifyCreation(totalAlarms);
});

function getTotalAlarms() {
  cy.waitGet('.mb-3 > :nth-child(1) > .text-gray').then((e) => {
    const parts = e
      .text()
      .trim()
      .split(' ');
    const value = parseInt(parts[0]);
    totalAlarms = value;
    cy.log(totalAlarms);
  });
}
