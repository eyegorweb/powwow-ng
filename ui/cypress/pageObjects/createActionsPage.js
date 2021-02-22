import layout from './layout';
import { partnersFilter } from './selectors/filters';

export default {
  init() {
    layout.menu.lines();
  },
  chooseMassPrerequisites() {
    return cy
      .get(
        '.prereq-toggles > div.d-flex.pl-2.justify-content-center > .toggle > button:nth-child(1)'
      )
      .click();
  },
  chooseIdPrerequisites() {
    return cy
      .get(
        '.prereq-toggles > div.d-flex.pl-2.justify-content-center > .toggle > button:nth-child(2)'
      )
      .click();
  },
  getLastActionType() {
    return cy.waitGet(
      '#app > div.container > div.mt-4 > div:nth-child(2) > div.col-md-9 > div > div > div:nth-child(2) > div:nth-child(2) > div > table > tbody > tr:nth-child(1) > td:nth-child(2) > div > div > div > div > span'
    );
  },
  isPageLoaded() {
    cy.get('#app > div.container > div.mt-4 > div.row.mb-5 > div > div > div > div');
  },
  table: {
    setPageLimit(nb) {
      cy.get('.datatable-pagination select').select('' + nb);
    },
  },
  actionsPannel: {
    suspend() {
      cy.waitGet(
        '#app > div.container > div.mt-4 > div.row.mb-5 > div > div > div > div > div > div > div.slick-list.draggable > div > div:nth-child(4) > div > div > div > div > div.title'
      ).click();
    },
    activate() {
      cy.waitGet('.slick-current > :nth-child(1) > .carousel-item > .card > .card-body').click();
    },
    changeBillingAccount() {
      cy.waitGet(
        '#app > div.container > div.mt-4 > div.row.mb-5 > div > div > div > div > div > div > div.slick-list.draggable > div > div:nth-child(9) > div > div > div > div > div.title'
      ).click();
    },
    editFreeFields() {
      cy.waitGet(
        '#app > div.container > div.mt-4 > div.row.mb-5 > div > div > div > div > div > div > div.slick-list.draggable > div > div:nth-child(2) > div > div > div > div'
      ).click();
    },
    editServices() {
      cy.waitGet(
        '#app > div.container > div.mt-4 > div.row.mb-5 > div > div > div > div > div > div > div.slick-list.draggable > div > div:nth-child(3) > div > div > div > div > div.title'
      ).click();
    },
    manageCancellation() {
      cy.waitGet('.CAROUSEL_ITEM_MANAGE_CANCELLATION').click();
    },
    nextSlider() {
      cy.waitGet('.slider-next').click();
    },
  },
  filters: {
    massByPartner: partnerName => {
      //cy.waitGet('.partner-prereq input');
      cy.waitGet('.partner-prereq > .position-relative > .form-group > .form-control')
        .click()
        .type(partnerName);
      cy.wait(200);
      cy.waitGet('.autocomplete-results > :nth-child(1)').click();
      cy.waitGet('.pl-1 > .btn').click();
    },
  },
  actions: {
    activate: {
      selectPartner(PartnerName) {
        cy.waitGet('.partner-prereq > .position-relative > .form-group > .form-control')
          .click()
          .type(PartnerName);
        cy.wait(200);
        cy.waitGet('.autocomplete-results > :nth-child(1)').click();
      },
      selectBillingAccount(billingAccountName) {
        cy.waitGet('.row > :nth-child(2) > .position-relative > .form-group > .form-control')
          .click()
          .type(billingAccountName)
          .wait(400)
          .waitGet(
            '.row > :nth-child(2) > .position-relative > .form-group > .autocomplete-results > .autocomplete-result'
          )
          .click();
      },
      activation() {
        cy.waitGet(':nth-child(2) > label > .state--on').click();
      },
      selectOffre(offreName) {
        cy.waitGet('.cmp-offers-part .form-control')
          .click()
          .type(offreName)
          .wait(200)
          .waitGet('.cmp-offers-part .form-group > .autocomplete-results > :nth-child(1)')
          .click();
      },
      apply() {
        cy.waitGet('.pl-1 > .btn').click();
      },
      inMass() {
        cy.waitGet('.item > :nth-child(1)').click();
      },
    },
    suspend: {
      selectPartner(PartnerName) {
        cy.waitGet('div.partner-prereq > div > fieldset > input')
          .click()
          .type(PartnerName);
        cy.wait(400);
        cy.waitGet('div.partner-prereq > div > fieldset > ul > li').click();
      },
      apply() {
        cy.waitGet('.pl-1 > .btn').click();
      },
      checkLineByICCID(iccid) {
        cy.get(`button[item='${iccid}']`)
          .closest('td')
          .prev()
          .find('[type="checkbox"]')
          .check({ force: true });
      },
    },
    changeBillingAccount: {
      selectPartner(partnerName) {
        cy.waitGet('.item > :nth-child(1)')
          .click()
          .waitGet('.partner-prereq > .position-relative > .form-group > .form-control')
          .click()
          .type(partnerName)
          .wait(400)
          .waitGet('.autocomplete-result')
          .click();
      },
      selectBillingAccount(billingAccountName) {
        cy.waitGet('.row > :nth-child(2) > .position-relative > .form-group > .form-control')
          .click()
          .type(billingAccountName)
          .wait(400)
          .waitGet(
            '.row > :nth-child(2) > .position-relative > .form-group > .autocomplete-results > .autocomplete-result'
          )
          .click();
      },
      selectoffer(offreName) {
        cy.waitGet('.cmp-offers-part .form-control')
          .click()
          .type(offreName)
          .wait(200)
          .waitGet('.cmp-offers-part .form-group > .autocomplete-results > :nth-child(1)')
          .click();
      },
      selectNewBillingAccount(billingAccountName) {
        cy.waitGet('.cmp-billing-account-choice > .position-relative > .form-group > .form-control')
          .click()
          .type(billingAccountName)
          .wait(200)
          .waitGet(
            '#app > div.container > div.mt-4 > div:nth-child(4) > div.col-md-9.extra-bottom-margin > div:nth-child(4) > div > div > div > div > div.col-7 > div:nth-child(1) > div > div > fieldset > ul > li'
          )
          .click();
      },
      apply() {
        cy.waitGet('.pl-1 > .btn').click();
      },
    },
    editFreeFields: {
      fillFirstFreeField(freeField) {
        cy.waitGet(
          '#app > div.container > div.mt-4 > div:nth-child(4) > div.col-md-9.extra-bottom-margin > div:nth-child(4) > div > div > div > div > div.col-7 > div:nth-child(1) > div > div:nth-child(2) > div:nth-child(1) > div > label > input[type=text]'
        )
          .click()
          .type(freeField);
      },
      fillSecondFreeField(freeField) {
        cy.waitGet(
          '#app > div.container > div.mt-4 > div:nth-child(4) > div.col-md-9.extra-bottom-margin > div:nth-child(4) > div > div > div > div > div.col-7 > div:nth-child(1) > div > div:nth-child(2) > div:nth-child(2) > div > label > input[type=text]'
        )
          .click()
          .type(freeField);
      },

      inMass() {
        cy.waitGet('.item > :nth-child(1)').click();
      },
    },
    editServices: {
      selectPartner(partnerName) {
        cy.waitGet(
          '#app > div.container > div.mt-4 > div:nth-child(3) > div > div > div > div > div > div.flex-grow-1 > div > div:nth-child(1) > div > div > fieldset > input'
        )
          .click()
          .type(partnerName)
          .wait(200)
          .waitGet('.autocomplete-results > li:nth-child(1)')
          .click();
      },
      selectOffer(offerName) {
        cy.waitGet(
          '#app > div.container > div.mt-4 > div:nth-child(3) > div > div > div > div > div > div.flex-grow-1 > div > div:nth-child(2) > div > div > fieldset > input'
        )
          .click()
          .type(offerName)
          .wait(200)
          .waitGet(
            '#app > div.container > div.mt-4 > div:nth-child(3) > div > div > div > div > div > div.flex-grow-1 > div > div:nth-child(2) > div > div > fieldset > ul > li:nth-child(1)'
          )
          .click();
      },
      apply() {
        cy.waitGet(
          '#app > div.container > div.mt-4 > div:nth-child(3) > div > div > div > div > div > div.pl-1.to-bottom > button'
        ).click();
      },
      deactivateService() {
        // modifer la maniere dont on selectionne les services a modifier
        cy.waitGet(
          ':nth-child(2) > .container > .search-input > :nth-child(2) > .checkboxes > .checkbox-container > .filled > .checkmark'
        ).click();
      },
    },
    manageCancellation: {
      chooseDelay: delay => {
        cy.waitGet('.manage-cancellation-delay-choice select').select(delay);
      },

      validateResil: () => {
        cy.get('.manage-cancellation-save-btn').click({ force: true });
        cy.get('.modal-default-button.btn-success').click({ force: true });
      },

      createAct: () => {
        cy.get('.manage-cancellation-save-btn').click({ force: true });
        cy.get('.modal-default-button.btn-success').click({ force: true });
        cy.get('.btn-double-validation').click({ force: true });
      },

      refuseCancellation: () => {
        cy.get('.manage-cancellation-refuse-btn').click({ force: true });
      },
    },
  },
  confirm(typeMassAction) {
    let path = '';

    if (typeMassAction === 'Suspension')
      path = ':nth-child(2) > :nth-child(2) > :nth-child(2) > .btn';
    if (typeMassAction === 'Pré-activation et Activation')
      path = ':nth-child(7) > :nth-child(2) > :nth-child(2) > .btn';
    if (typeMassAction === 'Changement du compte de fac ...')
      path = ':nth-child(2) > :nth-child(2) > div > .btn > span';
    if (typeMassAction === 'Changement des champs custom')
      path =
        '#app > div.container > div.mt-4 > div:nth-child(4) > div.col-md-9.extra-bottom-margin > div:nth-child(4) > div > div > div > div > div.col-7 > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div > button';
    if (typeMassAction === 'Changement de services')
      path = ':nth-child(4) > :nth-child(2) > :nth-child(2) > .btn';
    cy.waitGet(path).click();
    cy.waitGet('.btn-success').click();
    if (typeMassAction === 'Changement des champs custom')
      cy.waitGet(
        '#app > div.modal-mask > div > div > div.modal-footer > div > button.modal-default-button.btn.btn-success.btn-sm.ml-1'
      ).click();
    cy.wait(500);
  },
};
