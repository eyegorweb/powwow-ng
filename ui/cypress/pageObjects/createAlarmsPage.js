export default {
  startCreation() {
    cy.waitGet('button.create-alarm-btn').click();
  },
  getLastAlarm() {
    return cy.waitGet(
      'table > tbody > tr:nth-child(1) > td:nth-child(2) > div > div > div:nth-child(1)'
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
  create(index) {
    cy.waitGet(`div.buttonBar > div > ul > li:nth-child(${index}) > button`).click();
  },
  selectPartner(partnerName) {
    cy.waitGet(
      'div.currentForm input'
    )
      .first()
      .click()
      .type(partnerName)
      .wait(500)
      .waitGet(
        '.autocomplete-result'
      )
      .click();
  },
  selectOperator(operator) {
    cy.waitGet(
      `div.currentForm div.search-input div.items-container > div:nth-child(${operator}) > button`
    ).click();
  },
  selectTriggerPoint(triggerPoint) {
    cy.waitGet(
      `div.currentForm div.values-container > div:nth-child(${triggerPoint}) > label > input[type=number]`
    )
      .click()
      .type(20);
  },
  overConsumptionPool: {
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
      clickSMS() {
        cy.waitGet(
          'div.currentForm div.d-flex.pl-2 > div > button:nth-child(2)'
        ).click();
      },
      clickVoice() {
        cy.waitGet(
          'div.currentForm div.d-flex.pl-2 > div > button:last-child'
        ).click();
      },
    },
  },
  moduleChangement: {
    clickSearchButton() {
      cy.waitGet(
        'div.currentForm > div > div > div:nth-child(2) > div > div.scope-message > div > button'
      ).click();
    },
  },
};
