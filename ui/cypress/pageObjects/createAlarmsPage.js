export default {
  startCreation() {
    cy.waitGet('button.create-alarm-btn').click({ force: true });
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
      .click({ force: true })
      .clear()
      .type(alarmName);
  },
  create(index) {
    cy.waitGet(`div.buttonBar > div > ul > li:nth-child(${index}) > button`).click({ force: true });
  },
  selectPartner(partnerName) {
    cy.waitGet('div.currentForm input')
      .first()
      .click({ force: true })
      .type(partnerName)
      .wait(500)
      .waitGet('.autocomplete-result')
      .click({ force: true });
  },
  selectOperator(operator) {
    cy.waitGet(
      `div.currentForm div.search-input div.items-container > div:nth-child(${operator}) > button`
    ).click({ force: true });
  },
  selectTriggerPoint(triggerPoint) {
    cy.waitGet(
      `div.currentForm div.values-container > div:nth-child(${triggerPoint}) > label > input[type=number]`
    )
      .click({ force: true })
      .type(20);
  },
  overConsumptionPool: {
    selectOffer(offerName) {
      cy.waitGet('div.cmp-offer-billing-account-combo select').select(offerName);
    },
    thresholds: {
      configure() {
        cy.waitGet(
          'div.currentForm > div > div > div:nth-child(3) > div.m-3.bg-white.p-3.bordered > div.row > div > button > span'
        ).click({ force: true });
      },
      clickSMS() {
        cy.waitGet('div.currentForm div.d-flex.pl-2 > div > button:nth-child(2)').click({
          force: true,
        });
      },
      clickVoice() {
        cy.waitGet('div.currentForm div.d-flex.pl-2 > div > button:last-child').click({
          force: true,
        });
      },
      addThreshold() {
        cy.waitGet('.addThresholdButton > button').click({ force: true });
      },
      deleteLastThreshold() {
        cy.waitGet('.line-container .deleteButton > button')
          .last()
          .click({ force: true });
      },
      setSecondThresholdValue(value) {
        cy.waitGet('.line-container:nth-child(3) > .value > label > input')
          .clear()
          .type(value);
      },
      setSecondThresholdDate(date) {
        cy.waitGet(
          '.line-container:nth-child(3) > .limitDate > .select-container > div > select'
        ).select(date);
      },
      setThirdThresholdValue(value) {
        cy.waitGet('.line-container:nth-child(4) > .value > label > input')
          .clear()
          .type(value);
      },
      setThirdThresholdDate(date) {
        cy.waitGet(
          '.line-container:nth-child(4) > .limitDate > .select-container > div > select'
        ).select(date);
      },
    },
  },
  moduleChangement: {
    clickSearchButton() {
      cy.waitGet(
        'div.currentForm > div > div > div:nth-child(2) > div > div.scope-message > div > button'
      ).click({ force: true });
    },
  },
  profileStatutChangement: {
    cantModifyPartner() {
      cy.waitGet('.creationContainer div.col-md-6 input').should('not.exist');
    },
    cantModifyRange() {
      cy.waitGet('.creationContainer div.mb-4 select').should('not.exist');
    },
    verifyPrefilledPartner(partner) {
      cy.waitGet('.panel-vertical-container .alarm-partner > p').should('have.text', partner);
    },
    verifyPrefilledRange(range) {
      cy.waitGet('.panel-vertical-container .alarm-range > p').should('have.text', range);
    },
  },
};
