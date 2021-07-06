import createAlarmsPage from '../../pageObjects/createAlarmsPage';

Given(`je créé une alarme de sur-consommation par défaut {string}`, (alarmName) => {
  createAlarmsPage.startCreation();
  createAlarmsPage.overConsumption.create();
  createAlarmsPage.overConsumption.selectPartner('lyra');
  createAlarmsPage.overConsumption.selectTriggerPoint(1);
  createAlarmsPage.fillAlarmName(alarmName);
});

Given(`je créé une alarme de sous-consommation par défaut {string}`, (alarmName) => {
  createAlarmsPage.startCreation();
  createAlarmsPage.underConsumption.create();
  createAlarmsPage.underConsumption.selectPartner('lyra');
  createAlarmsPage.underConsumption.selectTriggerPoint(1);
  createAlarmsPage.fillAlarmName(alarmName);
});

Given(`je créé une alarme de changement d'opérateur par défaut {string}`, (alarmName) => {
  createAlarmsPage.startCreation();
  createAlarmsPage.operatorChangement.create();
  createAlarmsPage.operatorChangement.selectPartner('lyra');
  createAlarmsPage.operatorChangement.selectOperator(1);
  createAlarmsPage.fillAlarmName(alarmName);
});

Given(`je créé une alarme de changement de statut par défaut {string}`, (alarmName) => {
  createAlarmsPage.startCreation();
  createAlarmsPage.statusChangement.create();
  createAlarmsPage.statusChangement.selectPartner('lyra');
  createAlarmsPage.fillAlarmName(alarmName);
});

Given(`je créé une alarme de changement d'equipement par défaut {string}`, (alarmName) => {
  createAlarmsPage.startCreation();
  createAlarmsPage.equipmentChangement.create();
  createAlarmsPage.equipmentChangement.selectPartner('lyra');
  createAlarmsPage.fillAlarmName(alarmName);
});

Given('je créé une alarme de changement de module par défaut {string}', (alarmName) => {
  createAlarmsPage.startCreation();
  createAlarmsPage.moduleChangement.create();
  createAlarmsPage.moduleChangement.selectPartner('lyra');
  createAlarmsPage.moduleChangement.clickSearchButton();
  createAlarmsPage.fillAlarmName(alarmName);
});

Given(`je créé une alarme de changement de pays par défaut {string}`, (alarmName) => {
  createAlarmsPage.startCreation();
  createAlarmsPage.countryChangement.create();
  createAlarmsPage.countryChangement.selectPartner('lyra');
  createAlarmsPage.countryChangement.selectOperator(1);
  createAlarmsPage.fillAlarmName(alarmName);
});

Given('je créé une alarme de sur-consommation de la flotte par défaut {string}', (alarmName) => {
  createAlarmsPage.startCreation();
  createAlarmsPage.overConsumptionPool.create();
  createAlarmsPage.overConsumptionPool.selectPartner('auchan');
  createAlarmsPage.overConsumptionPool.selectOffer('26_10');
  createAlarmsPage.overConsumptionPool.thresholds.configure();
  createAlarmsPage.overConsumptionPool.thresholds.clickSMS();
  createAlarmsPage.overConsumptionPool.thresholds.configure();
  createAlarmsPage.overConsumptionPool.thresholds.clickVoice();
  createAlarmsPage.overConsumptionPool.thresholds.configure();
  createAlarmsPage.fillAlarmName(alarmName);
});
