export default {
  startCreation() {
    cy.waitGet(
      '#app > div.container > div.mt-4 > div.mt-4.mb-4 > div > div > div > div > div > div > div.col-md-9 > div.row.mb-3 > div:nth-child(2) > div > div > div > button'
    ).click();
  },
  getLastAlarm() {
    return cy.waitGet(
      '#app > div.container > div.mt-4 > div.mt-4.mb-4 > div > div > div > div > div > div > div.col-md-9 > div:nth-child(3) > div:nth-child(2) > div > table > tbody > tr:nth-child(1) > td:nth-child(2) > div > div > div:nth-child(1)'
    );
  },
  saveAlarm() {
    cy.waitGet(':nth-child(4) > :nth-child(2) > .p-3 > .btn-label').click({ force: true });
  },
  overConsumption: {
    create() {
      cy.waitGet(
        '#main-sliding-panel > div > div > div > div > div.buttonBar > div > ul > li:nth-child(2) > button'
      ).click();
    },
    selectPartner(partnerName) {
      cy.waitGet(
        '#main-sliding-panel > div > div > div > div > div.currentForm > div > div > div.row.mb-2 > div > div > fieldset > input'
      )
        .click()
        .type(partnerName);
      cy.wait(200);
      cy.waitGet('.autocomplete-results > li:nth-child(1)').click();
    },
    selectTriggerPoint(triggerPoint) {
      cy.waitGet(
        `#main-sliding-panel > div > div > div > div > div.currentForm > div > div > div:nth-child(3) > div > div.values-container.standard-mode > div:nth-child(${triggerPoint}) > label > input[type=number]`
      )
        .click()
        .type(20);
    },
    fillAlarmName(alarmName) {
      cy.waitGet(
        '#main-sliding-panel > div > div > div > div > div.currentForm > div > div > div:nth-child(4) > div:nth-child(4) > div.col.to-bottom > label > input[type=text]'
      )
        .click()
        .type(alarmName);
    },
  },
  underConsumption: {
    create() {
      cy.waitGet(
        '#main-sliding-panel > div > div > div > div > div.buttonBar > div > ul > li:nth-child(3) > button'
      ).click();
    },
    selectPartner(partnerName) {
      cy.waitGet(
        '#main-sliding-panel > div > div > div > div > div.currentForm > div > div > div.row.mb-2 > div > div > fieldset > input'
      )
        .click()
        .type(partnerName)
        .waitGet(
          '#main-sliding-panel > div > div > div > div > div.currentForm > div > div > div.row.mb-2 > div > div > fieldset > ul > li:nth-child(1)'
        )
        .click();
    },
    selectTriggerPoint(triggerPoint) {
      cy.waitGet(
        `#main-sliding-panel > div > div > div > div > div.currentForm > div > div > div:nth-child(3) > div > div.values-container.standard-mode > div:nth-child(${triggerPoint}) > label > input[type=number]`
      )
        .click()
        .type(20);
    },
    fillAlarmName(alarmName) {
      cy.waitGet(
        '#main-sliding-panel > div > div > div > div > div.currentForm > div > div > div:nth-child(4) > div:nth-child(4) > div.col.to-bottom > label > input[type=text]'
      )
        .click()
        .type(alarmName);
    },
  },
  operatorChangement: {
    create() {
      cy.waitGet(
        '#main-sliding-panel > div > div > div > div > div.buttonBar > div > ul > li:nth-child(4) > button'
      ).click();
    },
    selectPartner(partnerName) {
      cy.waitGet(
        '#main-sliding-panel > div > div > div > div > div.currentForm > div > div > div.row.mb-2 > div > div > fieldset > input'
      )
        .click()
        .type(partnerName)
        .waitGet(
          '#main-sliding-panel > div > div > div > div > div.currentForm > div > div > div.row.mb-2 > div > div > fieldset > ul > li:nth-child(1)'
        )
        .click();
    },
    selectOperator(operator) {
      cy.waitGet(
        `#main-sliding-panel > div > div > div > div > div.currentForm > div > div > div:nth-child(3) > div > div:nth-child(1) > div > div > div > div > div:nth-child(${operator}) > button`
      ).click();
    },
    fillAlarmName(alarmName) {
      cy.waitGet(
        '#main-sliding-panel > div > div > div > div > div.currentForm > div > div > div:nth-child(4) > div:nth-child(4) > div.col.to-bottom > label > input[type=text]'
      )
        .click()
        .type(alarmName);
    },
  },
  statusChangement: {
    create() {
      cy.waitGet(
        '#main-sliding-panel > div > div > div > div > div.buttonBar > div > ul > li:nth-child(5) > button'
      ).click();
    },
    selectPartner(partnerName) {
      cy.waitGet(
        '#main-sliding-panel > div > div > div > div > div.currentForm > div > div > div.row.mb-2 > div > div > fieldset > input'
      )
        .click()
        .type(partnerName)
        .wait(500)
        .waitGet(
          '#main-sliding-panel > div > div > div > div > div.currentForm > div > div > div.row.mb-2 > div > div > fieldset > ul > li:nth-child(1)'
        )
        .click();
    },
    fillAlarmName(alarmName) {
      cy.waitGet(
        '#main-sliding-panel > div > div > div > div > div.currentForm > div > div > div:nth-child(4) > div:nth-child(4) > div.col.to-bottom > label > input[type=text]'
      )
        .click()
        .type(alarmName);
    },
  },
  equipmentChangement: {
    create() {
      cy.waitGet(
        '#main-sliding-panel > div > div > div > div > div.buttonBar > div > ul > li:nth-child(6) > button'
      ).click();
    },
    selectPartner(partnerName) {
      cy.waitGet(
        '#main-sliding-panel > div > div > div > div > div.currentForm > div > div > div.row.mb-2 > div > div > fieldset > input'
      )
        .click()
        .type(partnerName)
        .waitGet(
          '#main-sliding-panel > div > div > div > div > div.currentForm > div > div > div.row.mb-2 > div > div > fieldset > ul > li:nth-child(1)'
        )
        .click();
    },
    fillAlarmName(alarmName) {
      cy.waitGet(
        '#main-sliding-panel > div > div > div > div > div.currentForm > div > div > div:nth-child(4) > div:nth-child(4) > div.col.to-bottom > label > input[type=text]'
      )
        .click()
        .type(alarmName);
    },
  },
  countryChangement: {
    create() {
      cy.waitGet(
        '#main-sliding-panel > div > div > div > div > div.buttonBar > div > ul > li:nth-child(8) > button'
      ).click();
    },
    selectPartner(partnerName) {
      cy.waitGet(
        '#main-sliding-panel > div > div > div > div > div.currentForm > div > div > div.row.mb-2 > div > div > fieldset > input'
      )
        .click()
        .type(partnerName);
      cy.wait(500);
      cy.waitGet(
        '#main-sliding-panel > div > div > div > div > div.currentForm > div > div > div.row.mb-2 > div > div > fieldset > ul > li:nth-child(1)'
      ).click();
    },
    selectOperator(operator) {
      cy.waitGet(
        `#main-sliding-panel > div > div > div > div > div.currentForm > div > div > div:nth-child(3) > div > div:nth-child(1) > div > div > div > div > div:nth-child(${operator}) > button`
      ).click();
    },
    fillAlarmName(alarmName) {
      cy.waitGet(
        '#main-sliding-panel > div > div > div > div > div.currentForm > div > div > div:nth-child(4) > div:nth-child(4) > div.col.to-bottom > label > input[type=text]'
      )
        .click()
        .type(alarmName);
    },
  },
};
