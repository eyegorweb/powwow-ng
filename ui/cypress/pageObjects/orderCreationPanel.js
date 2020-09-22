import layout from './layout';

export default {
  init() {
    layout.menu.getSim();
    cy.waitGet('.col-md-3 > .float-right').click({ force: true });
  },
  next() {
    cy.waitGet('.next-btn').click({ force: true });
  },
  saveOrder() {
    cy.waitGet('.checkmark')
      .click()
      .waitGet('.footer > .btn')
      .click();
    cy.wait(1000);
  },
  client: {
    choosePartner(name) {
      const partnerInputPath =
        '#main-sliding-panel > div > div > div > div > div.orderStep > div.stepContent > div > div.orderStepContent > div > div:nth-child(1) > div > fieldset > input';
      cy.waitGet(partnerInputPath).type(name);

      cy.wait(200);

      cy.waitGet(partnerInputPath)
        .wait(200)
        .type('{downarrow}')
        .type('{enter}');
    },
    chooseBillingAccount(name) {
      const BillingAccountInputPath =
        ':nth-child(2) > .position-relative > .form-group > .form-control';

      cy.waitGet(BillingAccountInputPath).type(name);
      cy.wait(200);
      cy.waitGet(BillingAccountInputPath)
        .wait(200)
        .type('{downarrow}')
        .type('{enter}');
    },
  },
  product: {
    setProductQuantity(num) {
      cy.waitGet('.d-block > input')
        .type('{backspace}')
        .type(num);
    },
    displayAllSimTypes() {
      cy.waitGet('.productChoices > div.text-right > .show-all-types').click();
    },
    selectSimType(indexSim) {
      cy.waitGet(
        `:nth-child(${indexSim}) > .d-flex > .checkbox-container > .filled > .checkmark`
      ).click();
    },
  },
  services: {
    toggleActivation() {
      cy.waitGet(':nth-child(2) > label > .state--on').click({ force: true });
    },
    chooseOffer(offerName) {
      cy.waitGet(
        '#main-sliding-panel > div > div > div > div > div.orderStep > div.stepContent > div > div.orderStepContent > div > div.position-relative > div.offerChoice > div > div > select'
      ).select(offerName);
    },
    togglePreactivation() {
      cy.waitGet(':nth-child(1) > label > .state--on').click();
    },
  },
  getServicesNames(onServicesFound) {
    cy.waitGet('.single-service>.toggle>.before-label>.before-label__label')
      .invoke('text')
      .then(onServicesFound);
  },
  lastOrder: {
    getLastOrder() {
      cy.waitGet('tbody > :nth-child(1)');
    },
    statusIsUnvalid() {
      cy.waitGet(
        ':nth-child(1) > :nth-child(3) > [data-v-a2f6a4ce=""] > .order-status > .status-icon > .icon-container > i'
      ).should('have.class', 'ic-Alt-Icon');
    },
  },
  shipping: {
    selectLastShippingAdress() {
      cy.waitGet(
        '.list-container > .adress > .adress__item > .checkbox-container > .filled > .checkmark'
        ).click({ force: true });
    },
  },
};
