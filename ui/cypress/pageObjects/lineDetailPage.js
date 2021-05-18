export default {
  goBack() {
    cy.waitGet('.back-btn').click({ force: true });
  },
  openDetailPannel() {
    cy.waitGet(
      '#app > div.container > div.mt-4 > div:nth-child(3) > div.col-md-9.extra-bottom-margin > div > div > div:nth-child(2) > div:nth-child(2) > div > table > tbody > tr > td:nth-child(1) > div > button'
    ).click();
  },
  inProgress: {
    openInProgress() {
      cy.waitGet(
        '#main-sliding-panel > div > div > div > div > div > div.data-detail-container.main-content > div > div:nth-child(2) > div:nth-child(8) > div > div > button'
      ).click();
    },
    getTable() {
      return cy.waitGet('table');
    },
  },
  openDetailLine() {
    cy.waitGet('.footer-panel-buttons > div > div:nth-child(2) > button').click();
  },
  tab: {
    details() {
      cy.waitGet('.mt-4.mb-4 .tabs-bar > li:nth-child(1) > a').click();
      cy.url().should('include', '/details');
    },
    detailsOptions: {
      info() {
        cy.waitGet('.menu_line_info > a').click();
        cy.url().should('include', '/details/info');
      },
      billing() {
        cy.waitGet('.menu_billing > a').click();
        cy.url().should('include', '/details/billing');
      },
      services() {
        cy.waitGet('.menu_line_services > a').click();
        cy.url().should('include', '/details/services');
      },
      alarms() {
        cy.waitGet('.menu_alarm_list > a').click();
        cy.url().should('include', '/details/alarms');
      },
      alarmsDetails: {
        openTriggerHistory() {
          cy.waitGet('table > tbody > tr:nth-child(2) > td:nth-child(5) > div > button').click();
        },
        openAlarmModification() {
          cy.waitGet('table > tbody > tr:nth-child(1) > td:nth-child(1) > div > button').click();
        },
        openAlarmCreation() {
          cy.waitGet('div.col-md-9 > div > div.row.mb-3.mt-3 > div.col-md-4 > button').click();
        },
      },
      acts() {
        cy.waitGet('.menu_acts_history > a').click();
        cy.url().should('include', '/details/acts');
      },
      actsDetails: {
        openMassAction() {
          cy.waitGet('table > tbody > tr:nth-child(1) > td:nth-child(2) > div > button').click();
        },
        showResultDetailsClick() {
          cy.waitGet(
            '.panel-vertical-container .main-content.data-detail-container > div:nth-child(1) > div.overview-item.d-flex > button'
          ).click();
          cy.wait(400);
        },
        showActResultClick() {
          cy.waitGet(
            '#main-sliding-panel > div > div > div > div > div > div.footer-back > div > div.goto-detail-button > button'
          ).click();
          cy.wait(400);
        },
        verifyUrlActDetail() {
          cy.url().should('include', '/act-detail/');
        },
      },
    },
    ongoing() {
      cy.waitGet('.mt-4.mb-4 .tabs-bar > li:nth-child(2) > a').click();
      cy.url().should('include', '/ongoing');
    },
    ongoingDetails: {
      tableIsVisible() {
        cy.waitGet('.table').should('be.visible');
      },
      warningMessageIsVisible() {
        cy.waitGet('.pt-4.pl-4 > div > .position-relative > div').should(
          'have.class',
          'warning-message'
        );
      },
    },
    analysis() {
      cy.waitGet('.mt-4.mb-4 .tabs-bar > li:nth-child(3) > a').click();
      cy.url().should('include', '/analysis');
    },
    analysisDetails: {
      menu: {
        tests() {
          cy.waitGet('.menu_last_tests > a').click();
          cy.url().should('include', '/tests');
        },
        networkLocationTest() {
          cy.waitGet('.menu_network_location_test > a').click();
          cy.url().should('include', '/network-location-test');
        },
        networkTestControl() {
          cy.waitGet('.menu_network_test_control > a').click();
          cy.url().should('include', '/network-test-control');
        },
        supervision() {
          cy.waitGet('.menu_supervision > a').click();
          cy.url().should('include', '/supervision');
        },
        networkHistory() {
          cy.waitGet('.menu_network_history > a').click();
          cy.url().should('include', '/network-history');
        },
      },
      warningMessageIsVisible() {
        cy.waitGet('.col-md-9.pt-3 > div').should('have.class', 'warning-message');
      },
    },
  },
  panel: {
    closePanel() {
      cy.waitGet('.cd-panel__header > a').click();
    },
    isVisible() {
      cy.waitGet('.cd-panel').should('have.class', 'cd-panel--is-visible');
    },
  },
  buttons: {
    changerCarteSIM: {
      clickable() {
        cy.waitGet('.slick-slide:nth-child(1) > div > .carousel-item > div').should(
          'not.have.class',
          'inactive'
        );
      },
      notClickable() {
        cy.waitGet('.slick-slide:nth-child(1) > div > .carousel-item > div').should(
          'have.class',
          'inactive'
        );
      },
      click() {
        cy.waitGet('.slick-slide:nth-child(1)').click();
      },
      newICCID(iccid) {
        cy.waitGet(
          'div.data-detail-container.main-content > div > div.data-detail-container.main-content > div > div:nth-child(2) > p > div > label > input[type=text]'
        ).type(iccid);
      },
    },
    changerMSISDN: {
      clickable() {
        cy.waitGet('.slick-slide:nth-child(2) > div > .carousel-item > div').should(
          'not.have.class',
          'inactive'
        );
      },
      notClickable() {
        cy.waitGet('.slick-slide:nth-child(2) > div > .carousel-item > div').should(
          'have.class',
          'inactive'
        );
      },
      click() {
        cy.waitGet('.slick-slide:nth-child(2)').click();
      },
      newMSISDN(msisdn) {
        cy.waitGet(
          'div.data-detail-container.main-content > div > div.data-detail-container.main-content > div > div:nth-child(2) > p > div > label > input[type=text]'
        ).type(msisdn);
      },
    },
    modifierChampsLibres: {
      clickable() {
        cy.waitGet('.slick-slide:nth-child(3) > div > .carousel-item > div').should(
          'not.have.class',
          'inactive'
        );
      },
      notClickable() {
        cy.waitGet('.slick-slide:nth-child(3) > div > .carousel-item > div').should(
          'have.class',
          'inactive'
        );
      },
      click() {
        cy.waitGet('.slick-slide:nth-child(3)').click();
      },
    },
    changementCF: {
      clickable() {
        cy.waitGet('.slick-slide:nth-child(4) > div > .carousel-item > div').should(
          'not.have.class',
          'inactive'
        );
      },
      notClickable() {
        cy.waitGet('.slick-slide:nth-child(4) > div > .carousel-item > div').should(
          'have.class',
          'inactive'
        );
      },
      click() {
        cy.waitGet('.slick-slide:nth-child(4)').click();
      },
      newCF(cf) {
        cy.waitGet(
          'div.data-detail-container.main-content > div > div.data-detail-container.main-content > div > div:nth-child(2) > p > div > fieldset > input'
        )
          .click()
          .type(cf);
        cy.wait(200);
        cy.waitGet('.autocomplete-results > li:nth-child(1)').click();
      },
    },
    changerOffre: {
      clickable() {
        cy.waitGet('.slick-slide:nth-child(5) > div > .carousel-item > div').should(
          'not.have.class',
          'inactive'
        );
      },
      notClickable() {
        cy.waitGet('.slick-slide:nth-child(5) > div > .carousel-item > div').should(
          'have.class',
          'inactive'
        );
      },
      click() {
        cy.waitGet('.slick-slide:nth-child(5)').click();
      },
      newOffre(offre) {
        cy.waitGet(
          'div.data-detail-container.main-content > div > div.data-detail-container.main-content > div > div:nth-child(2) > p > div > fieldset > input'
        )
          .click()
          .type(offre);
        cy.wait(200);
        cy.waitGet('.autocomplete-results > li:nth-child(1)').click();
      },
    },
    apply() {
      cy.waitGet('button.btn.btn-primary.pl-4.pr-4.pt-2.pb-2.mt-4').click();
    },
    save() {
      cy.waitGet(
        'div.modal-mask > div > div > div.modal-footer > div > button.btn-success'
      ).click();
    },
  },
};
