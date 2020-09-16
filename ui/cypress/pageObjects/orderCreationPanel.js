import layout from './layout';

export default {
  init() {
    layout.menu.getSim();
    cy.get('.col-md-3 > .float-right').click({ force: true });
  },
  next() {
    cy.get('.next-btn').click({ force: true });
  },
  saveOrder() {
    cy.get('.checkmark')
      .click()
      .get('.footer > .btn')
      .click();
    cy.wait(1000);
  },
  client: {
    choosePartner(name) {
      const partnerInputPath =
        '#main-sliding-panel > div > div > div > div > div.orderStep > div.stepContent > div > div.orderStepContent > div > div:nth-child(1) > div > fieldset > input';
      cy.get(partnerInputPath).type(name);

      cy.wait(200);

      cy.get(partnerInputPath)
        .wait(200)
        .type('{downarrow}')
        .type('{enter}');
    },
    chooseBillingAccount(name) {
      const BillingAccountInputPath =
        ':nth-child(2) > .position-relative > .form-group > .form-control';

      cy.get(BillingAccountInputPath).type(name);
      cy.wait(200);
      cy.get(BillingAccountInputPath)
        .wait(200)
        .type('{downarrow}')
        .type('{enter}');
    },
  },
  product: {
    setProductQuantity(num) {
      cy.get('.d-block > input')
        .type('{backspace}')
        .type(num);
    },
    displayAllSimTypes() {
      cy.get('.productChoices > div.text-right > .show-all-types').click();
    },
    selectSimType(indexSim) {
      cy.get(
        `:nth-child(${indexSim}) > .d-flex > .checkbox-container > .filled > .checkmark`
      ).click();
    },
  },
  services: {
    toggleActivation() {
      cy.get(':nth-child(2) > label > .state--on').click({ force: true });
    },
    chooseOffer(offerName) {
      cy.get(
        '#main-sliding-panel > div > div > div > div > div.orderStep > div.stepContent > div > div.orderStepContent > div > div.position-relative > div.offerChoice > div > div > select'
      ).select(offerName);
    },
    togglePreactivation() {
      cy.get(':nth-child(1) > label > .state--on').click();
    },
  },
  getServicesNames(onServicesFound) {
    cy.get('.single-service>.toggle>.before-label>.before-label__label')
      .invoke('text')
      .then(onServicesFound);
  },
  lastOrder: {
    getLastOrder() {
      cy.get('tbody > :nth-child(1)');
    },
    statusIsUnvalid() {
      cy.waitGet(
        ':nth-child(1) > :nth-child(3) > [data-v-a2f6a4ce=""] > .order-status > .status-icon > .icon-container > i'
      ).should('have.class', 'ic-Alt-Icon');
    },
  },
  shipping: {
    selectLastShippingAdress() {
      cy.get(
        '.list-container > .adress > .adress__item > .checkbox-container > .filled > .checkmark'
        ).click({ force: true });
    },
  },
};
