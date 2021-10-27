import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import createAlarmsPage from '../../../pageObjects/createAlarmsPage';
import alarmsPage from '../../../pageObjects/alarmsPage';

Given("je choisis l'alarme de sur-consommation de la flotte", () => {
  createAlarmsPage.create(1);
});

Given("je choisis l'offre {string}", (offer) => {
  createAlarmsPage.overConsumptionPool.selectOffer(offer);
});

Given('je choisis le partenaire {string}', (partner) => {
  createAlarmsPage.selectPartner(partner);
});

Given('je configure le seuil de Data à 100% avant la fin du mois', () => {
  createAlarmsPage.overConsumptionPool.thresholds.configure();
});

Given('je configure le seuil de SMS à 100% avant la fin du mois', () => {
  createAlarmsPage.overConsumptionPool.thresholds.clickSMS();
  createAlarmsPage.overConsumptionPool.thresholds.configure();
});

Given('je configure le seuil de Voix à 100% avant la fin du mois', () => {
  createAlarmsPage.overConsumptionPool.thresholds.clickVoice();
  createAlarmsPage.overConsumptionPool.thresholds.configure();
});

Given("j'ajoute un deuxième seuil à {string} avant le {string} du mois", (value, date) => {
  createAlarmsPage.overConsumptionPool.thresholds.addThreshold();
  createAlarmsPage.overConsumptionPool.thresholds.setSecondThresholdValue(value);
  createAlarmsPage.overConsumptionPool.thresholds.setSecondThresholdDate(date);
});

Given("j'ajoute un troisième seuil à {string} avant le {string} du mois", (value, date) => {
  createAlarmsPage.overConsumptionPool.thresholds.addThreshold();
  createAlarmsPage.overConsumptionPool.thresholds.setThirdThresholdValue(value);
  createAlarmsPage.overConsumptionPool.thresholds.setThirdThresholdDate(date);
});

Given("je vais sur l'onglet SMS", () => {
  createAlarmsPage.overConsumptionPool.thresholds.clickSMS();
});

Given("je vais sur l'onglet Voix", () => {
  createAlarmsPage.overConsumptionPool.thresholds.clickVoice();
});

Given("je modifie le deuxième seuil à {string} avant le {string} du mois", (value, date) => {
  createAlarmsPage.overConsumptionPool.thresholds.setSecondThresholdValue(value);
  createAlarmsPage.overConsumptionPool.thresholds.setSecondThresholdDate(date);
});

Given('je supprime le deuxième seuil de Data', () => {
  createAlarmsPage.overConsumptionPool.thresholds.deleteLastThreshold();
});

Given('je supprime le deuxième seuil de SMS', () => {
  createAlarmsPage.overConsumptionPool.thresholds.clickSMS();
  createAlarmsPage.overConsumptionPool.thresholds.deleteLastThreshold();
});

Given('je supprime le deuxième seuil de Voix', () => {
  createAlarmsPage.overConsumptionPool.thresholds.clickVoice();
  createAlarmsPage.overConsumptionPool.thresholds.deleteLastThreshold();
});

Given("j'enrgistre l'alarme", () => {
  createAlarmsPage.saveAlarm();
});

Given("je donne le nom {string}", (alarmName) => {
  createAlarmsPage.fillAlarmName(alarmName);
});

Given("je clique sur l'ID de l'alarme créée", () => {
  alarmsPage.clickFirstId();
});

When("j'enregistre l'alarme", () => {
  createAlarmsPage.saveAlarm();
});

Then('je vérifie que les données de seuil du volet correspondent aux seuils rentrés', () => {
  alarmsPage.clickFirstId();
  alarmsPage.sharedAlarms.verifyThresholds();
});
