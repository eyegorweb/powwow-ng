import layout from './layout';
import { partnersFilter } from './selectors/filters';

export default {
  init() {
    layout.menu.lines();
  },
  clickScheduledActs() {
    cy.waitGet(
      'div.col-md-3 > div:nth-child(1) > div > ul > li:nth-child(2) > div > button'
    ).click({ force: true });
  },
  chooseMassPrerequisites() {
    return cy
      .get(
        '.prereq-toggles > div.d-flex.pl-2.justify-content-center > .toggle > button:nth-child(1)'
      )
      .click({ force: true });
  },
  chooseIdPrerequisites() {
    return cy
      .get(
        '.prereq-toggles > div.d-flex.pl-2.justify-content-center > .toggle > button:nth-child(2)'
      )
      .click({ force: true });
  },
  getLastActionType() {
    return cy
      .waitGet('table > tbody > tr > td:nth-child(2) > div > div > div > div > span')
      .first();
  },
  isPageLoaded() {
    cy.get('#app > div.container > div.mt-4 > div.row.mb-5 > div > div > div > div');
  },
  clickActByName(actName) {
    cy.waitGet('.slick-slide')
      .contains(actName)
      .click({ force: true });
    cy.wait(500);
  },
  clickMassToggle() {
    cy.waitGet('.item.toggle > button:first-child').click({ force: true });
  },
  clickApplyButton() {
    cy.waitGet('.btn-validate').click({ force: true });
  },
  requireInformations: {
    partner(partner) {
      cy.waitGet('.partner-prereq input').type(partner);
      cy.wait(400);
      cy.waitGet('.partner-prereq .autocomplete-result:first-child').click({ force: true });
      cy.wait(400);
    },
    cf(cf) {
      cy.waitGet('.billing-account-prereq input').type(cf);
      cy.wait(400);
      cy.waitGet('.billing-account-prereq .autocomplete-result:first-child').click({ force: true });
      cy.wait(400);
    },
    simType(simType) {
      cy.waitGet('.sim-type-prereq input').type(simType);
      cy.wait(400);
      cy.waitGet('.sim-type-prereq .autocomplete-result:first-child').click({ force: true });
      cy.wait(400);
    },
  },
  togglePairingESim: {
    auto() {
      cy.waitGet('.item.toggle > button:first-child').click({ force: true });
    },
    file() {
      cy.waitGet('.item.toggle > button:nth-child(2)').click({ force: true });
    },
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
      ).click({ force: true });
    },
    activate() {
      cy.waitGet('.slick-current > :nth-child(1) > .carousel-item > .card > .card-body').click({
        force: true,
      });
    },
    changeBillingAccount() {
      cy.waitGet(
        '#app > div.container > div.mt-4 > div.row.mb-5 > div > div > div > div > div > div > div.slick-list.draggable > div > div:nth-child(9) > div > div > div > div > div.title'
      ).click({ force: true });
    },
    editFreeFields() {
      cy.waitGet(
        '#app > div.container > div.mt-4 > div.row.mb-5 > div > div > div > div > div > div > div.slick-list.draggable > div > div:nth-child(2) > div > div > div > div'
      ).click({ force: true });
    },
    editServices() {
      cy.waitGet(
        '#app > div.container > div.mt-4 > div.row.mb-5 > div > div > div > div > div > div > div.slick-list.draggable > div > div:nth-child(3) > div > div > div > div > div.title'
      ).click({ force: true });
    },
    manageCancellation() {
      cy.waitGet('.CAROUSEL_ITEM_MANAGE_CANCELLATION').click({ force: true });
    },
    nextSlider() {
      cy.waitGet('.slider-next').click({ force: true });
    },
  },
  filters: {
    massByPartner: (partnerName) => {
      //cy.waitGet('.partner-prereq input');
      cy.waitGet('.partner-prereq > .position-relative > .form-group > .form-control')
        .click({ force: true })
        .type(partnerName);
      cy.wait(200);
      cy.waitGet('.autocomplete-results > :nth-child(1)').click({ force: true });
      cy.waitGet('.pl-1 > .btn').click({ force: true });
    },
  },
  actions: {
    inMass() {
      cy.waitGet('.item > :nth-child(1)').click({ force: true });
    },
    selectPartner(PartnerName) {
      cy.waitGet('.partner-prereq input')
        .click({ force: true })
        .type(PartnerName);
      cy.wait(200);
      cy.waitGet('.partner-prereq .autocomplete-result').click({ force: true });
    },
    selectBillingAccount(billingAccountName) {
      cy.waitGet('.billing-account-prereq input')
        .click({ force: true })
        .type(billingAccountName)
        .wait(400)
        .waitGet('.billing-account-prereq .autocomplete-result')
        .click({ force: true });
    },
    apply() {
      cy.waitGet('.pl-1 > .btn').click({ force: true });
    },
    activate: {
      activation() {
        cy.waitGet(':nth-child(2) > label > .state--on').click({ force: true });
      },
      selectOffre(offreName) {
        cy.waitGet('.cmp-offers-part .form-control')
          .click({ force: true })
          .type(offreName)
          .wait(200)
          .waitGet('.cmp-offers-part .form-group > .autocomplete-results > :nth-child(1)')
          .click({ force: true });
      },
      clientReference(clientReference) {
        cy.waitGet('.col-7 > div:nth-child(2) > label:last-child > input').type(clientReference);
      },
      validate() {
        cy.waitGet(
          '.col-7 > div:nth-child(3) > div:nth-child(2) > div:nth-child(2) > button > span'
        ).click({ force: true });
      },
      selectSecondLine() {
        cy.waitGet(
          'table > tbody > tr:nth-child(2) > td:nth-child(1) > div > div > label > span'
        ).click({ force: true });
      },
      selectFifthLine() {
        cy.waitGet(
          'table > tbody > tr:nth-child(5) > td:nth-child(1) > div > div > label > span'
        ).click({ force: true });
      },
    },
    suspend: {
      selectPartner(PartnerName) {
        cy.waitGet('div.partner-prereq > div > fieldset > input')
          .click({ force: true })
          .type(PartnerName);
        cy.wait(400);
        cy.waitGet('div.partner-prereq > div > fieldset > ul > li').click({ force: true });
      },
      apply() {
        cy.waitGet('.pl-1 > .btn').click({ force: true });
        cy.waitGet(
          '.col-7 > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > button'
        ).click({ force: true });
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
      selectoffer(offreName) {
        cy.waitGet('.cmp-offers-part .form-control')
          .click({ force: true })
          .type(offreName)
          .wait(200)
          .waitGet('.cmp-offers-part .form-group > .autocomplete-results > :nth-child(1)')
          .click({ force: true });
      },
      selectNewBillingAccount(billingAccountName) {
        cy.waitGet('.cmp-billing-account-choice > .position-relative > .form-group > .form-control')
          .click({ force: true })
          .type(billingAccountName)
          .wait(200)
          .waitGet(
            '#app > div.container > div.mt-4 > div:nth-child(4) > div.col-md-9.extra-bottom-margin > div:nth-child(4) > div > div > div > div > div.col-7 > div:nth-child(1) > div > div > fieldset > ul > li'
          )
          .click({ force: true });
      },
      validate() {
        cy.waitGet(
          '.col-7 > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > button'
        ).click({ force: true });
      },
    },
    editFreeFields: {
      checkFirstLine() {
        cy.waitGet(
          'table > tbody > tr:nth-child(4) > td:nth-child(1) > div > div > label > span'
        ).click({ force: true });
      },
      fillFirstFreeField(freeField) {
        cy.waitGet(
          '.col-7 > div:nth-child(1) > div > div:nth-child(1) > div:nth-child(2) > div > label > input'
        )
          .first()
          .type(freeField);
      },
      fillSecondFreeField(freeField) {
        cy.waitGet('.col-7 select').select(freeField);
      },
      validate() {
        cy.waitGet(
          '.col-7 > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div > button'
        ).click({ force: true });
      },
      inMass() {
        cy.waitGet('.item > :nth-child(1)').click({ force: true });
      },
    },
    editServices: {
      selectPartner(partnerName) {
        cy.waitGet(
          '#app > div.container > div.mt-4 > div:nth-child(3) > div > div > div > div > div > div.flex-grow-1 > div > div:nth-child(1) > div > div > fieldset > input'
        )
          .click({ force: true })
          .type(partnerName)
          .wait(200)
          .waitGet('.autocomplete-results > li:nth-child(1)')
          .click({ force: true });
      },
      selectOffer(offerName) {
        cy.waitGet(
          '.flex-grow-1.pl-4.pr-4 > div > div:nth-child(2) > div > div > div > fieldset > input'
        )
          .click({ force: true })
          .type(offerName)
          .wait(200)
          .waitGet(
            '.flex-grow-1.pl-4.pr-4 > div > div:nth-child(2) > div > div > div > fieldset > ul > li:nth-child(2)'
          )
          .click({ force: true });
      },
      apply() {
        cy.waitGet(
          '#app > div.container > div.mt-4 > div:nth-child(3) > div > div > div > div > div > div.pl-1.to-bottom > button'
        ).click({ force: true });
      },
      desactivateService() {
        // modifer la maniere dont on selectionne les services a modifier
        cy.waitGet(
          ':nth-child(2) > .container > .search-input > :nth-child(2) > .checkboxes > .checkbox-container > .filled > .checkmark'
        ).click({ force: true });
      },
      validate() {
        cy.waitGet(
          '.col-7 > div:nth-child(4) > div:nth-child(2) > div:nth-child(2) > button'
        ).click({ force: true });
      },
    },
    manageCancellation: {
      chooseDelay: (delay) => {
        cy.waitGet('.manage-cancellation-delay-choice select').select(delay);
      },

      createAct: () => {
        cy.get('.manage-cancellation-save-btn').click({ force: true });
        cy.get('.modal-default-button.btn-success').click({ force: true });
      },

      refuseCancellation: () => {
        cy.get('.manage-cancellation-refuse-btn').click({ force: true });
        cy.get('.modal-default-button.btn-success').click({ force: true });
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
    //cy.waitGet(path).click();
    cy.waitGet('.btn-success').click({ force: true });
    cy.wait(500);
  },
};
