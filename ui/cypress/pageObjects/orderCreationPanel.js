import layout from './layout';

export default {
  init() {
    layout.menu.getSim();
    cy.waitGet('button.create-order').click({ force: true });
  },
  next() {
    cy.wait(800);
    cy.waitGet('.next-btn').click({ force: true });
    cy.wait(800);
  },
  saveOrder() {
    cy.waitGet('.checkmark')
      .click()
      .waitGet('.footer > .btn')
      .click();
    cy.wait(1000);
  },
  close() {
    cy.waitGet('.cd-panel__close').click({ force: true });
  },
  client: {
    choosePartner(name) {
      const partnerInputPath =
        '#main-sliding-panel > div > div > div > div > div.orderStep > div.stepContent > div > div.orderStepContent > div > div:nth-child(1) > div > fieldset > input';
      cy.waitGet(partnerInputPath)
        .type(name, { delay: 100 })
        .wait(500)
        .waitGet(partnerInputPath)
        .wait(500)
        .type('{downarrow}')
        .type('{enter}')
        .wait(500);
    },
    chooseBillingAccount(name) {
      const BillingAccountInputPath =
        ':nth-child(2) > .position-relative > .form-group > .form-control';

      cy.waitGet(BillingAccountInputPath).type(name, { delay: 100 });
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
      cy.wait(800)
        .waitGet(`:nth-child(${indexSim}) > .d-flex > .checkbox-container > .filled > .checkmark`)
        .click();
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
        '#app > div.container > div.mt-4 > div.pt-4.pl-4 > div.mt-0 > div:nth-child(2) > div.col-md-9 > div > div > div:nth-child(2) > div:nth-child(2) > div > table > tbody > tr:nth-child(1) > td:nth-child(3) > div > div > div > div > i'
      ).should('have.class', 'ic-Alt-Icon');
    },
  },
  shipping: {
    selectLastShippingAdress() {
      cy.waitGet(
        '.list-container > .adress > .adress__item > .checkbox-container > .filled > .checkmark'
      )
        .last()
        .click({ force: true });
    },
  },
};
