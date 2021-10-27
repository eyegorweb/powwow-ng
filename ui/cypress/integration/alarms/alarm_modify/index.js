import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import createAlarmsPage from '../../../pageObjects/createAlarmsPage';
import alarmsPage from '../../../pageObjects/alarmsPage';

let myAlarmName = '';

Given("j'enregistre le nom de l'alarme {string}", (alarmName) => {
  myAlarmName = alarmName;
});

Given('je valide la création', () => {
  createAlarmsPage.saveAlarm();
});

Given("je clique sur l'ID de cette alarme", () => {
  alarmsPage.clickFirstId();
});

Given("je modifie le nom de l'alarme par {string}", (alarmName) => {
  createAlarmsPage.fillAlarmName(alarmName);
});

When(`je valide la création`, () => {
  createAlarmsPage.saveAlarm();
});

Then("je vérifie la modification du nom de l'alarme mutualisée", () => {
  alarmsPage.sharedAlarms.verifyModification(myAlarmName);
  alarmsPage.parkAlarm();
});

Then("je vérifie la modification du nom de l'alarme", () => {
  alarmsPage.verifyModification(myAlarmName);
});
