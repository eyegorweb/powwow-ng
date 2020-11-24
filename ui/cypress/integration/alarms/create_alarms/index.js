import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import createAlarmsPage from '../../../pageObjects/createAlarmsPage';
import layout from '../../../pageObjects/layout';
import alarmsPage from '../../../pageObjects/alarmsPage';
import get from 'lodash.get';

let myAlarmName = '';
let totalAlarms = 0;

Given(`je suis sur la page de création d'alarmes`, () => {
  layout.menu.alarms();
});

Given(`j'enregistre le nombre d'alarmes`, () => {
  cy.wrap(null).then(() => {
    return cy.waitForGQL('alarms').then(response => {
      totalAlarms = get(response, 'body.data.alarms.total');
    });
  });
});

Given(`je créé une alarme de sur-consommation par défaut {string}`, alarmName => {
  myAlarmName = alarmName;
  createAlarmsPage.startCreation();
  createAlarmsPage.overConsumption.create();
  createAlarmsPage.overConsumption.selectPartner('lyra');
  createAlarmsPage.overConsumption.selectTriggerPoint(1);
  createAlarmsPage.overConsumption.fillAlarmName(alarmName);
});

Given(`je créé une alarme de sous-consommation par défaut {string}`, alarmName => {
  myAlarmName = alarmName;
  createAlarmsPage.startCreation();
  createAlarmsPage.underConsumption.create();
  createAlarmsPage.underConsumption.selectPartner('lyra');
  createAlarmsPage.underConsumption.selectTriggerPoint(1);
  createAlarmsPage.underConsumption.fillAlarmName(alarmName);
});

Given(`je créé une alarme de changement d'opérateur par défaut {string}`, alarmName => {
  myAlarmName = alarmName;
  createAlarmsPage.startCreation();
  createAlarmsPage.operatorChangement.create();
  createAlarmsPage.operatorChangement.selectPartner('lyra');
  createAlarmsPage.operatorChangement.selectOperator(1);
  createAlarmsPage.operatorChangement.fillAlarmName(alarmName);
});

Given(`je créé une alarme de changement de statut par défaut {string}`, alarmName => {
  myAlarmName = alarmName;
  createAlarmsPage.startCreation();
  createAlarmsPage.statusChangement.create();
  createAlarmsPage.statusChangement.selectPartner('lyra');
  createAlarmsPage.statusChangement.fillAlarmName(alarmName);
});

Given(`je créé une alarme de changement d'equipement par défaut {string}`, alarmName => {
  myAlarmName = alarmName;
  createAlarmsPage.startCreation();
  createAlarmsPage.equipmentChangement.create();
  createAlarmsPage.equipmentChangement.selectPartner('lyra');
  createAlarmsPage.equipmentChangement.fillAlarmName(alarmName);
});

Given(`je créé une alarme de changement de pays par défaut {string}`, alarmName => {
  myAlarmName = alarmName;
  createAlarmsPage.startCreation();
  createAlarmsPage.countryChangement.create();
  createAlarmsPage.countryChangement.selectPartner('lyra');
  createAlarmsPage.countryChangement.selectOperator(1);
  createAlarmsPage.countryChangement.fillAlarmName(alarmName);
});

When(`je valide la création`, () => {
  createAlarmsPage.saveAlarm();
});

Then(`je vérifie que mon alarme a été créé`, () => {
  cy.wrap(null).then(() => {
    return cy.waitForGQL('alarms').then(response => {
      const newTotal = get(response, 'body.data.alarms.total');
      expect(newTotal).to.be.equal(totalAlarms + 1);
    });
  });
});
