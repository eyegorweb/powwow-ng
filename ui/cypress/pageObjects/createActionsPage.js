import layout from './layout';
import { partnersFilter } from './selectors/filters';

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
    changeBillingAccount() {
      cy.get(
        '[data-slick-index="7"] > :nth-child(1) > .carousel-item > .card > .card-body'
      ).click();
    },
    editFreeFields() {
      cy.get(
        '#app > div.container > div.mt-4 > div.row.mb-5 > div > div > div > div > div > div > div.slick-list.draggable > div > div:nth-child(2) > div > div > div > div'
      ).click();
    },
    editServices() {
      cy.get(
        '#app > div.container > div.mt-4 > div.row.mb-5 > div > div > div > div > div > div > div.slick-list.draggable > div > div:nth-child(3) > div > div > div > div > div.title'
      ).click();
    },
    nextSlider() {
      cy.get('.slider-next').click();
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
    changeBillingAccount: {
      selectPartner(partnerName) {
        cy.get(
          '#app > div.container > div.mt-4 > div:nth-child(3) > div > div > div > div > div > div.flex-grow-1 > div > div:nth-child(1) > div > div > fieldset > input'
        )
          .click()
          .type(partnerName)
          .wait(200)
          .get(
            '#app > div.container > div.mt-4 > div:nth-child(3) > div > div > div > div > div > div.flex-grow-1 > div > div:nth-child(1) > div > div > fieldset > ul > li'
          )
          .click();
      },
      selectBillingAccount(billingAccountName) {
        cy.get(
          '#app > div.container > div.mt-4 > div:nth-child(3) > div > div > div > div > div > div.flex-grow-1 > div > div:nth-child(2) > div > fieldset > input'
        )
          .click()
          .type(billingAccountName)
          .wait(200)
          .get(
            '#app > div.container > div.mt-4 > div:nth-child(3) > div > div > div > div > div > div.flex-grow-1 > div > div:nth-child(2) > div > fieldset > ul > li'
          )
          .click();
      },
      selectoffer(offerName) {
        cy.get(
          '#app > div.container > div.mt-4 > div:nth-child(3) > div > div > div > div > div > div.flex-grow-1 > div > div:nth-child(3) > div > div > fieldset > input'
        )
          .click()
          .type(offerName)
          .wait(200)
          .get(
            '#app > div.container > div.mt-4 > div:nth-child(3) > div > div > div > div > div > div.flex-grow-1 > div > div:nth-child(3) > div > div > fieldset > ul > li:nth-child(1)'
          )
          .click();
      },
      selectNewBillingAccount(billingAccountName) {
        cy.get(
          '#app > div.container > div.mt-4 > div:nth-child(4) > div.col-md-9.extra-bottom-margin > div:nth-child(4) > div > div > div > div > div.col-7 > div:nth-child(1) > div > div > fieldset > input'
        )
          .click()
          .type(billingAccountName)
          .wait(200)
          .get(
            '#app > div.container > div.mt-4 > div:nth-child(4) > div.col-md-9.extra-bottom-margin > div:nth-child(4) > div > div > div > div > div.col-7 > div:nth-child(1) > div > div > fieldset > ul > li'
          )
          .click();
      },
      apply() {
        cy.get('.pl-1 > .btn').click();
      },
    },
    editFreeFields: {
      selectPartner(partnerName) {
        cy.get(
          '#app > div.container > div.mt-4 > div:nth-child(3) > div > div > div > div > div > div.flex-grow-1 > div > div.w-50 > div > div > fieldset > input'
        )
          .click()
          .type(partnerName)
          .wait(200)
          .get(
            '#app > div.container > div.mt-4 > div:nth-child(3) > div > div > div > div > div > div.flex-grow-1 > div > div.w-50 > div > div > fieldset > ul > li'
          )
          .click();
      },
      fillFirstFreeField(freeField) {
        cy.get(
          '#app > div.container > div.mt-4 > div:nth-child(4) > div.col-md-9.extra-bottom-margin > div:nth-child(4) > div > div > div > div > div.col-7 > div:nth-child(1) > div > div:nth-child(2) > div:nth-child(1) > div > label > input[type=text]'
        )
          .click()
          .type(freeField);
      },
      fillSecondFreeField(freeField) {
        cy.get(
          '#app > div.container > div.mt-4 > div:nth-child(4) > div.col-md-9.extra-bottom-margin > div:nth-child(4) > div > div > div > div > div.col-7 > div:nth-child(1) > div > div:nth-child(2) > div:nth-child(2) > div > label > input[type=text]'
        )
          .click()
          .type(freeField);
      },
      apply() {
        cy.get(
          '#app > div.container > div.mt-4 > div:nth-child(3) > div > div > div > div > div > div.flex-grow-1 > div > div.pl-1.to-bottom > button'
        ).click();
      },
    },
    editServices: {
      selectPartner(partnerName) {
        cy.get(
          '#app > div.container > div.mt-4 > div:nth-child(3) > div > div > div > div > div > div.flex-grow-1 > div > div:nth-child(1) > div > div > fieldset > input'
        )
          .click()
          .type(partnerName)
          .wait(200)
          .get(
            '#app > div.container > div.mt-4 > div:nth-child(3) > div > div > div > div > div > div.flex-grow-1 > div > div:nth-child(1) > div > div > fieldset > ul > li'
          )
          .click();
      },
      selectOffer(offerName) {
        cy.get(
          '#app > div.container > div.mt-4 > div:nth-child(3) > div > div > div > div > div > div.flex-grow-1 > div > div:nth-child(2) > div > div > fieldset > input'
        )
          .click()
          .type(offerName)
          .wait(200)
          .get(
            '#app > div.container > div.mt-4 > div:nth-child(3) > div > div > div > div > div > div.flex-grow-1 > div > div:nth-child(2) > div > div > fieldset > ul > li:nth-child(1)'
          )
          .click();
      },
      apply() {
        cy.get(
          '#app > div.container > div.mt-4 > div:nth-child(3) > div > div > div > div > div > div.pl-1.to-bottom > button'
        ).click();
      },
      deactivateService() {
        // modifer la maniere dont on selectionne les services a modifier
        cy.get(
          '#app > div.container > div.mt-4 > div:nth-child(4) > div.col-md-9.extra-bottom-margin > div:nth-child(4) > div > div > div > div > div.col-7 > div:nth-child(2) > div:nth-child(2) > div > div > div > div > div:nth-child(9) > label > span.checkmark.regular'
        ).click();
      },
    },
  },
  confirm(typeMassAction) {
    let path = '';

    if (typeMassAction === 'Suspension')
      path = ':nth-child(2) > :nth-child(2) > :nth-child(2) > .btn';
    if (typeMassAction === 'Pré-activation et Activation')
      path = ':nth-child(6) > :nth-child(2) > :nth-child(2) > .btn';
    if (typeMassAction === 'Changement du compte de fac ...')
      path = ':nth-child(2) > :nth-child(2) > div > .btn > span';
    if (typeMassAction === 'Changement des champs custom')
      path =
        '#app > div.container > div.mt-4 > div:nth-child(4) > div.col-md-9.extra-bottom-margin > div:nth-child(4) > div > div > div > div > div.col-7 > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div > button';
    if (typeMassAction === 'Changement de services')
      path = ':nth-child(4) > :nth-child(2) > :nth-child(2) > .btn';
    cy.get(path).click();
    cy.get('.btn-success').click();
    if (typeMassAction === 'Changement des champs custom')
      cy.get(
        '#app > div.modal-mask > div > div > div.modal-footer > div > button.modal-default-button.btn.btn-success.btn-sm.ml-1'
      ).click();
    cy.wait(500);
  },
};
