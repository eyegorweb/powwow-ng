export default {
  createReport() {
    cy.waitGet('.btn.btn-secondary.btn-block').click({ force: true });
  },
  checkFirstReportName(name) {
    cy.waitGet('table > tbody > tr:first-child > td:nth-child(1) > div > button').should(
      ($name) => {
        const reportLongName = $name
          .text()
          .trim()
          .split(' ');
        const reportName = reportLongName[0];
        expect(reportName, 'Report name').to.equal(name);
      }
    );
  },
  clickFirstReportName() {
    cy.waitGet('table > tbody > tr:first-child > td:nth-child(1) > div > button').click({
      force: true,
    });
  },
  displayDetailsFirstReport() {
    cy.waitGet('table > tbody > tr:nth-child(1) > td:nth-child(7) > div > div > button').click({
      force: true,
    });
    cy.wait(400);
    cy.waitGet(
      'table > tbody > tr:nth-child(1) > td:nth-child(7) > div > div > div > div > div > button:nth-child(1)'
    ).click({ force: true });
  },
  unselectFirstReport() {
    cy.waitGet('table > tbody > tr:nth-child(1) > td:nth-child(7) > div > div > button').click({
      force: true,
    });
    cy.wait(400);
    cy.waitGet(
      'table > tbody > tr:nth-child(1) > td:nth-child(7) > div > div > div > div > div > button:nth-child(2)'
    ).click({ force: true });
    cy.wait(400);
    cy.waitGet('button.modal-default-button.btn.btn-success.btn-sm.ml-1').click({ force: true });
  },
  showStatusReport() {
    cy.waitGet('table > thead > tr > th:nth-child(7) > button').click({ force: true });
    cy.waitGet('div.checkboxes > div:nth-child(6) > label > span').click({ force: true });
    cy.waitGet('div.checkboxes > div:nth-child(8) > label > span').click({ force: true });
    cy.waitGet('div.card-body > button').click({ force: true });
  },
  checkFirstReportStatus(status) {
    cy.waitGet('table > tbody > tr:first-child > td:nth-child(6) > div > div').should(($status) => {
      const reportLongStatus = $status
        .text()
        .trim()
        .split(' ');
      const reportStatus = reportLongStatus[0];
      expect(reportStatus, 'Report status').to.equal(status);
    });
  },
  panel: {
    closePanel() {
      cy.waitGet('.cd-panel__close').click({ force: true });
    },
    isVisible() {
      cy.waitGet('.cd-panel').should('have.class', 'cd-panel--is-visible');
    },
    save() {
      cy.waitGet('.fileInfoContainer > div:nth-child(3) > button').click({ force: true });
    },
    reportName(name) {
      cy.waitGet('.fileInfoContainer > div:nth-child(1) > label > input').type(name);
    },
    fileFormat(value) {
      cy.waitGet('.fileInfoContainer > div:nth-child(2) > div > div > select').select(value);
    },
    deleteDataFromReportData() {
      cy.waitGet('ul.report-data > li:last-child > button').click({ force: true });
    },
    partner: {
      selectPartner(partner) {
        cy.waitGet('div.partner-select > fieldset > input').type(partner);
        cy.wait(400);
        cy.waitGet('.autocomplete-results > li:nth-child(1)').click({ force: true });
        cy.wait(400);
      },
    },
    chooseInformation: {
      selectFromAReportTemplate(value) {
        cy.waitGet('div.report-model > div > select').select(value);
      },
      technicalInformation: {
        open() {
          cy.waitGet(
            'div.checkbox-groups > div:nth-child(1) > div.d-flex.align-items-center > a'
          ).click({ force: true });
        },
        select(index) {
          cy.waitGet(
            'div.checkbox-groups > div:nth-child(1) > div.pt-3 > div > div:nth-child(' +
              index +
              ') > div > label > span'
          ).click({ force: true });
        },
      },
      dualSIMInformation: {
        open() {
          cy.waitGet(
            'div.checkbox-groups > div:nth-child(2) > div.d-flex.align-items-center > a'
          ).click({ force: true });
        },
        select(index) {
          cy.waitGet(
            'div.checkbox-groups > div:nth-child(2) > div.pt-3 > div > div:nth-child(' +
              index +
              ') > div > label > span'
          ).click({ force: true });
        },
      },
      commercialInformation: {
        open() {
          cy.waitGet('div.checkbox-groups > div:nth-child(3) > .d-flex > a').click({ force: true });
        },
        select(index) {
          cy.waitGet(
            'div.checkbox-groups > div:nth-child(3) > div.pt-3 > div > div:nth-child(' +
              index +
              ') > div > label > span'
          ).click({ force: true });
        },
      },
      orderInformation: {
        open() {
          cy.waitGet('div.checkbox-groups > div:nth-child(4) > .d-flex > a').click({ force: true });
        },
        select(index) {
          cy.waitGet(
            'div.checkbox-groups > div:nth-child(4) > div.pt-3 > div > div:nth-child(' +
              index +
              ') > div > label > span'
          ).click({ force: true });
        },
      },
      consumption: {
        open() {
          cy.waitGet('div.checkbox-groups > div:nth-child(5) > .d-flex > a').click({ force: true });
        },
        select(index) {
          cy.waitGet(
            'div.checkbox-groups > div:nth-child(5) > div.pt-3 > div > div:nth-child(' +
              index +
              ') > div > label > span'
          ).click({ force: true });
        },
      },
      lastUsedInformation: {
        open() {
          cy.waitGet('div.checkbox-groups > div:nth-child(6) > .d-flex > a').click({ force: true });
        },
        select(index) {
          cy.waitGet(
            'div.checkbox-groups > div:nth-child(6) > div.pt-3 > div > div:nth-child(' +
              index +
              ') > div > label > span'
          ).click({ force: true });
        },
      },
    },
    generateReport: {
      selectOnlyOnce() {
        cy.waitGet('div.report-frequency > div > button:nth-child(1)')
          .click({ force: true })
          .should('have.class', 'active');
      },
      selectWeekly() {
        cy.waitGet('div.report-frequency > div > button:nth-child(2)')
          .click({ force: true })
          .should('have.class', 'active');
      },
      selectMonthly() {
        cy.waitGet('div.report-frequency > div > button:nth-child(3)')
          .click({ force: true })
          .should('have.class', 'active');
      },
    },
    notifications: {
      selectToBeNotifiedByEmail() {
        cy.waitGet('div.should-notify > label > span').click({ force: true });
      },
      selectActivated() {
        cy.waitGet('div.report-activate > label > span').click({ force: true });
      },
    },
  },
};
