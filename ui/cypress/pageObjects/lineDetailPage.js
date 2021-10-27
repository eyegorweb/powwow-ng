export default {
  inProgress: {
    getTable() {
      return cy.waitGet('table');
    },
  },
  openDetailPannel() {
    cy.waitGet(
      '#app > div.container > div.mt-4 > div:nth-child(3) > div.col-md-9.extra-bottom-margin > div > div > div:nth-child(2) > div:nth-child(2) > div > table > tbody > tr > td:nth-child(1) > div > button'
    ).click({ force: true });
    cy.wait(1000);
  },
  openDetailLine() {
    cy.waitGet('.footer-panel-buttons > div > div:nth-child(2) > button').click({ force: true });
  },
  tab: {
    details() {
      cy.waitGet('.mt-4.mb-4 .tabs-bar > li:nth-child(1) > a').click({ force: true });
      cy.url().should('include', '/details');
    },
    detailsOptions: {
      info() {
        cy.waitGet('.menu_line_info > a').click({ force: true });
        cy.url().should('include', '/details/info');
      },
      billing() {
        cy.waitGet('.menu_billing > a').click({ force: true });
        cy.url().should('include', '/details/billing');
      },
      services() {
        cy.waitGet('.menu_line_services > a').click({ force: true });
        cy.url().should('include', '/details/services');
      },
      alarms() {
        cy.waitGet('.menu_alarm_list > a').click({ force: true });
        cy.url().should('include', '/details/alarms');
      },
      alarmsDetails: {
        openTriggerHistory() {
          cy.waitGet('.table .btn-trigger.btn.btn-link.p-0')
            .first()
            .click({ force: true });
        },
        openAlarmModification() {
          cy.waitGet('table > tbody > tr:nth-child(1) > td:nth-child(1) > div > button').click({
            force: true,
          });
        },
      },
      acts() {
        cy.waitGet('.menu_acts_history > a').click({ force: true });
        cy.url().should('include', '/details/acts');
      },
      actsDetails: {
        openMassAction() {
          cy.waitGet('table > tbody > tr:nth-child(1) > td:nth-child(2) > div > button').click({
            force: true,
          });
          cy.wait(1000);
        },
        verifyUrlActDetail() {
          cy.url().should('include', '/act-detail/');
          cy.wait(500);
        },
        verifyUrl(url) {
          cy.url().should('include', url);
          cy.wait(500);
        },
      },
    },
    ongoing() {
      cy.waitGet('.mt-4.mb-4 .tabs-bar > li:nth-child(2) > a').click({ force: true });
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
      cy.waitGet('.mt-4.mb-4 .tabs-bar > li:nth-child(3) > a').click({ force: true });
      cy.url().should('include', '/analysis');
    },
    analysisDetails: {
      menu: {
        tests() {
          cy.waitGet('.menu_last_tests > a').click({ force: true });
          cy.url().should('include', '/tests');
        },
        networkLocationTest() {
          cy.waitGet('.menu_network_location_test > a').click({ force: true });
          cy.url().should('include', '/network-location-test');
        },
        networkTestControl() {
          cy.waitGet('.menu_network_test_control > a').click({ force: true });
          cy.url().should('include', '/network-test-control');
        },
        supervision() {
          cy.waitGet('.menu_supervision > a').click({ force: true });
          cy.url().should('include', '/supervision');
        },
        networkHistory() {
          cy.waitGet('.menu_network_history > a').click({ force: true });
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
      cy.waitGet('#main-sliding-panel').then(($panel) => {
        if ($panel.hasClass('cd-panel--is-visible')) {
          cy.waitGet('.cd-panel__header > a').click({ force: true });
        }
      });
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
        cy.waitGet('.slick-slide:nth-child(1)').click({ force: true });
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
        cy.waitGet('.slick-slide:nth-child(2)').click({ force: true });
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
        cy.waitGet('.slick-slide:nth-child(3)').click({ force: true });
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
        cy.waitGet('.slick-slide:nth-child(4)').click({ force: true });
      },
      newCF(cf) {
        cy.waitGet('#main-sliding-panel fieldset > input')
          .click({ force: true })
          .type(cf);
        cy.wait(200);
        cy.waitGet('.autocomplete-results > li:nth-child(1)').click({ force: true });
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
        cy.waitGet('.slick-slide:nth-child(5)').click({ force: true });
      },
      newOffre(offre) {
        cy.waitGet(
          'div.data-detail-container.main-content > div > div.data-detail-container.main-content > div > div:nth-child(2) > p > div > fieldset > input'
        )
          .click({ force: true })
          .type(offre);
        cy.wait(200);
        cy.waitGet('#main-sliding-panel .autocomplete-results > li:nth-child(1)').click({
          force: true,
        });
      },
    },
    apply() {
      cy.waitGet('button.btn.btn-primary.pl-4.pr-4.pt-2.pb-2.mt-4').click({ force: true });
    },
    save() {
      cy.waitGet('div.modal-mask > div > div > div.modal-footer > div > button.btn-success').click({
        force: true,
      });
      cy.wait(1000);
    },
  },
};
