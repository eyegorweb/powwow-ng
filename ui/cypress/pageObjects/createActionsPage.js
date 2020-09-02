import layout from './layout';

export default {
  init() {
    layout.menu.lines();
  },
  getLastActionType() {
    return cy.get(
      ':nth-child(1) > :nth-child(2) > [data-v-a2f6a4ce=""] > .truncate > [data-v-1e2a6935=""] > div > span'
    );
  },
  actionsPannel: {
    suspend() {
      cy.get(
        '[data-slick-index="3"] > :nth-child(1) > .carousel-item > .card > .card-body'
      ).click();
    },
    activate() {
      cy.get('.slick-current > :nth-child(1) > .carousel-item > .card > .card-body').click();
    },
  },
  actions: {
    activate: {
      selectPartner(PartnerName) {
        cy.get(
          '#app > div.container > div.mt-4 > div:nth-child(3) > div > div > div > div > div > div.flex-grow-1 > div > div:nth-child(1) > div > div > fieldset > input'
        )
          .click()
          .type(PartnerName);
        cy.wait(200);
        cy.get('.autocomplete-results > :nth-child(1)').click();
      },
      selectBillingAccount(billingAccountName) {
        cy.get(
          '#app > div.container > div.mt-4 > div:nth-child(3) > div > div > div > div > div > div.flex-grow-1 > div > div:nth-child(2) > div > fieldset > input'
        )
          .click()
          .type(billingAccountName)
          .wait(400)
          .get(
            '#app > div.container > div.mt-4 > div:nth-child(3) > div > div > div > div > div > div.flex-grow-1 > div > div:nth-child(2) > div > fieldset > ul > li'
          )
          .click();
      },
      activation() {
        cy.get(':nth-child(2) > label > .state--on').click();
      },
      selectOffre(offreName) {
        cy.get('.col-7 > :nth-child(2) > .position-relative > .form-group > .form-control')
          .click()
          .type(offreName)
          .wait(200)
          .get(
            '.col-7 > :nth-child(2) > .position-relative > .form-group > .autocomplete-results > :nth-child(1)'
          )
          .click();
      },
      apply() {
        cy.get('.pl-1 > .btn').click();
      },
    },
    suspend: {
      selectPartner(PartnerName) {
        cy.get(
          '#app > div.container > div.mt-4 > div:nth-child(3) > div > div > div > div > div > div.flex-grow-1 > div > div:nth-child(1) > div > div > fieldset > input'
        )
          .click()
          .type(PartnerName);
        cy.wait(200);
        cy.get('.autocomplete-results > :nth-child(1)').click();
      },
      apply() {
        cy.get('.pl-1 > .btn').click();
      },
    },
  },
  confirm(typeMassAction) {
    let path = '';

    if (typeMassAction === 'Suspension')
      path = ':nth-child(2) > :nth-child(2) > :nth-child(2) > .btn';
    if (typeMassAction === 'Pré-activation et Activation')
      path = ':nth-child(6) > :nth-child(2) > :nth-child(2) > .btn';
    cy.get(path).click();
    cy.get('.btn-success').click();
    cy.wait(500);
  },
};
