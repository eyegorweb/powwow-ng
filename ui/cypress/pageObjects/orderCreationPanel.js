import layout from './layout';

export default {
  init() {
    layout.menu.getSim();
    cy.get('.col-md-3 > .float-right').click({ force: true });
  },

  choosePartner(name) {
    const partnerInputPath =
      '#main-sliding-panel > div > div > div > div > div.orderStep > div.stepContent > div > div.orderStepContent > div > div:nth-child(1) > div > fieldset > input';
    cy.get(partnerInputPath).type(name);

    cy.wait(200);

    cy.get(partnerInputPath)
      .type('{downarrow}')
      .type('{enter}');
  },

  next() {
    cy.get('.next-btn').click({ force: true });
  },

  chooseProduct(index) {
    cy.get(`:nth-child(${index}) > .d-flex > .checkbox-container > .filled > .checkmark`).click({
      force: true,
    });
  },
  setProductQuantity(num) {
    cy.get('.d-block > input')
      .type('{backspace}')
      .type(num);
  },

  toggleActivation() {
    cy.get(
      '#main-sliding-panel > div > div > div > div > div.orderStep > div.stepContent > div > div.orderStepContent > div > div.activationChoice > div > div:nth-child(2) > label'
    ).click({ force: true });
  },

  chooseOffer(offerName) {
    cy.get(
      '#main-sliding-panel > div > div > div > div > div.orderStep > div.stepContent > div > div.orderStepContent > div > div.position-relative > div.offerChoice > div > div > select'
    ).select(offerName);
  },

  getServicesNames(onServicesFound) {
    cy.get('.single-service>.toggle>.before-label>.before-label__label')
      .invoke('text')
      .then(onServicesFound);
  },
};
