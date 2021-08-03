export default {
  startCreation() {
    cy.waitGet('button.create-alarm-btn').click();
  },
  getLastAlarm() {
    return cy.waitGet(
      '#app > div.container > div.mt-4 > div.mt-4.mb-4 > div > div > div > div > div > div > div.col-md-9 > div:nth-child(3) > div:nth-child(2) > div > table > tbody > tr:nth-child(1) > td:nth-child(2) > div > div > div:nth-child(1)'
    );
  },
  saveAlarm() {
    cy.waitGet(':nth-child(4) > :nth-child(2) > .p-3 > .btn-label').click({ force: true });
    cy.wait(2000);
  },
  fillAlarmName(alarmName) {
    cy.waitGet('label.alarm-name > input')
      .click()
      .clear()
      .type(alarmName);
  },
  overConsumptionPool: {
    create() {
      cy.waitGet(
        '#main-sliding-panel > div > div > div > div > div.buttonBar > div > ul > li:first-child > button'
      ).click();
    },
    selectPartner(partnerName) {
      cy.waitGet('div.currentForm > div > div > div.row.mb-2 > div > div > fieldset > input')
        .click()
        .type(partnerName);
      cy.wait(200);
      cy.waitGet('.autocomplete-results > li:first-child').click();
    },
    selectOffer(offerName) {
      cy.waitGet(
        'div.currentForm > div > div > div:nth-child(2) > div > div > div > div > div > select'
      ).select(offerName);
    },
    thresholds: {
      configure() {
        cy.waitGet(
          'div.currentForm > div > div > div:nth-child(3) > div.m-3.bg-white.p-3.bordered > div.row > div > button > span'
        ).click();
      },
      clickData() {
        cy.waitGet(
          'div.currentForm > div > div > div:nth-child(3) > div.d-flex.justify-content-center.mt-4.mb-2 > div > div > button:first-child'
        ).click();
      },
      clickSMS() {
        cy.waitGet(
          'div.currentForm > div > div > div:nth-child(3) > div.d-flex.justify-content-center.mt-4.mb-2 > div > div > button:nth-child(2)'
        ).click();
      },
      clickVoice() {
        cy.waitGet(
          'div.currentForm > div > div > div:nth-child(3) > div.d-flex.justify-content-center.mt-4.mb-2 > div > div > button:last-child'
        ).click();
      },
    },
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
  },
  moduleChangement: {
    create() {
      cy.waitGet(
        '#main-sliding-panel > div > div > div > div > div.buttonBar > div > ul > li:nth-child(7) > button'
      ).click();
    },
    selectPartner(partnerName) {
      cy.waitGet('div.currentForm > div > div > div.row.mb-2 > div > div > fieldset > input')
        .click()
        .type(partnerName);
      cy.wait(200);
      cy.waitGet('.autocomplete-results > li:first-child').click();
    },
    clickSearchButton() {
      cy.waitGet(
        'div.currentForm > div > div > div:nth-child(2) > div > div.scope-message > div > button'
      ).click();
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
  },
};
