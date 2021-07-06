import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import createAlarmsPage from '../../../pageObjects/createAlarmsPage';
import alarmsPage from '../../../pageObjects/alarmsPage';
import layout from '../../../pageObjects/layout';

let myAlarmName = '';

Given(`je suis sur la page de création d'alarmes`, () => {
  layout.menu.alarms();
});

Given("je vais sur l'onglet des alarmes mutualisées", () => {
  alarmsPage.sharedAlarms.goTo();
});

Given("j'enregistre le nom de l'alarme {string}", (alarmName) => {
  myAlarmName = alarmName;
});

Given('je valide la création', () => {
  createAlarmsPage.saveAlarm();
});

Given("je clique sur l'ID de cette alarme", () => {
  alarmsPage.clickFirstId();
});

Given('je clique sur le bouton "Modifier l\'alarme"', () => {
  alarmsPage.clickModifyAlarm();
});

Given("je modifie le nom de l'alarme par {string}", (alarmName) => {
  createAlarmsPage.fillAlarmName(alarmName);
});

When(`je valide la création`, () => {
  createAlarmsPage.saveAlarm();
});

Then("je vérifie la modification du nom de l'alarme mutualisée", () => {
  alarmsPage.sharedAlarms.verifyModification(myAlarmName);
});

Then("je vérifie la modification du nom de l'alarme", () => {
  alarmsPage.verifyModification(myAlarmName);
});
