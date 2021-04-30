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
      return cy.waitGet(
        '#app > div.container > div.mt-4 > div.mt-4.mb-4 > div.pt-4.pl-4 > div > div > table'
      );
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
      acts() {
        cy.waitGet('.menu_acts_history > a').click();
        cy.url().should('include', '/details/acts');
      },
    },
    ongoing() {
      cy.waitGet('.mt-4.mb-4 .tabs-bar > li:nth-child(2) > a').click();
      cy.url().should('include', '/ongoing');
    },
    analysis() {
      cy.waitGet('.mt-4.mb-4 .tabs-bar > li:nth-child(3) > a').click();
      cy.url().should('include', '/analysis');
    },
  },
};
