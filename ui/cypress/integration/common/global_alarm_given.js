import createAlarmsPage from '../../pageObjects/createAlarmsPage';

Given(`je créé une alarme de sur-consommation par défaut {string}`, (alarmName) => {
  createAlarmsPage.startCreation();
  createAlarmsPage.create(2);
  createAlarmsPage.selectPartner('lyra');
  createAlarmsPage.selectTriggerPoint(1);
  createAlarmsPage.fillAlarmName(alarmName);
});

Given(`je créé une alarme de sous-consommation par défaut {string}`, (alarmName) => {
  createAlarmsPage.startCreation();
  createAlarmsPage.create(3);
  createAlarmsPage.selectPartner('lyra');
  createAlarmsPage.selectTriggerPoint(1);
  createAlarmsPage.fillAlarmName(alarmName);
});

Given(`je créé une alarme de changement d'opérateur par défaut {string}`, (alarmName) => {
  createAlarmsPage.startCreation();
  createAlarmsPage.create(4);
  createAlarmsPage.selectPartner('lyra');
  createAlarmsPage.selectOperator(1);
  createAlarmsPage.fillAlarmName(alarmName);
});

Given(`je créé une alarme de changement de statut par défaut {string}`, (alarmName) => {
  createAlarmsPage.startCreation();
  createAlarmsPage.create(5);
  createAlarmsPage.selectPartner('lyra');
  createAlarmsPage.fillAlarmName(alarmName);
});

Given(`je créé une alarme de changement d'equipement par défaut {string}`, (alarmName) => {
  createAlarmsPage.startCreation();
  createAlarmsPage.create(6);
  createAlarmsPage.selectPartner('lyra');
  createAlarmsPage.fillAlarmName(alarmName);
});

Given('je créé une alarme de changement de module par défaut {string}', (alarmName) => {
  createAlarmsPage.startCreation();
  createAlarmsPage.create(7);
  createAlarmsPage.selectPartner('lyra');
  createAlarmsPage.moduleChangement.clickSearchButton();
  createAlarmsPage.fillAlarmName(alarmName);
});

Given(`je créé une alarme de changement de pays par défaut {string}`, (alarmName) => {
  createAlarmsPage.startCreation();
  createAlarmsPage.create(8);
  createAlarmsPage.selectPartner('lyra');
  createAlarmsPage.selectOperator(1);
  createAlarmsPage.fillAlarmName(alarmName);
});

Given('je créé une alarme de sur-consommation de la flotte par défaut {string}', (alarmName) => {
  createAlarmsPage.startCreation();
  createAlarmsPage.create(1);
  createAlarmsPage.selectPartner('auchan');
  createAlarmsPage.overConsumptionPool.selectOffer('26_10');
  createAlarmsPage.overConsumptionPool.thresholds.configure();
  createAlarmsPage.overConsumptionPool.thresholds.clickSMS();
  createAlarmsPage.overConsumptionPool.thresholds.configure();
  createAlarmsPage.overConsumptionPool.thresholds.clickVoice();
  createAlarmsPage.overConsumptionPool.thresholds.configure();
  createAlarmsPage.fillAlarmName(alarmName);
});
