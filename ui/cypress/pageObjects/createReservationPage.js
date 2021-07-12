export default {
  nextStep() {
    cy.waitGet('div.orderStepButtons > div:last-child > button').click();
  },
  clientChoiceStep: {
    choosePartner(partner) {
      cy.waitGet('div.creation-panel fieldset.form-group > input')
        .first()
        .type(partner);
      cy.wait(400);
      cy.waitGet('.autocomplete-results > li')
        .first()
        .click();
    },
    chooseBillingAccount(billingAccount) {
      cy.waitGet('div.creation-panel fieldset.form-group > input')
        .last()
        .type(billingAccount);
      cy.wait(400);
      cy.waitGet('.autocomplete-results > li')
        .last()
        .click();
    },
  },
  productChoiceStep: {
    selectFirstSIMCardType() {
      cy.waitGet('div.simtype span.checkmark')
        .first()
        .click();
    },
    selectSIMQuantity(quantity) {
      cy.waitGet('div.choose-amount input')
        .clear()
        .type(quantity);
    },
  },
  servicesChoiceStep: {
    clickPreActivation() {
      cy.waitGet('div.toggle span.slider')
        .first()
        .click();
    },
    clickActivation() {
      cy.waitGet('div.toggle span.slider')
        .last()
        .click();
    },
    selectOffer(offer) {
      cy.waitGet('div.offerChoice select').select(offer);
    },
  },
  acceptContactualConditions() {
    cy.waitGet('div.wizard-synthesis span.checkmark').click();
  },
  saveReservation() {
    cy.waitGet('div.wizard-synthesis button.btn-accent').click();
    cy.wait(400);
  },
  verifyCreation(totalReservationBeforeCreation) {
    cy.waitGet('.mb-3 > :nth-child(1) > .text-gray').then((e) => {
      const parts = e
        .text()
        .trim()
        .split(' ');
      const value = parseInt(parts[0]);
      expect(value).to.be.equal(totalReservationBeforeCreation + 1);
    });
  },
};
