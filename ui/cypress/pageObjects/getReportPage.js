export default {
  dashboard: {
    filterPartner(partner) {
      cy.waitGet(
        '#app > div.container > div.mt-4 > div.filters-container > div.filter-item-large > div > fieldset > input'
      )
        .first()
        .click()
        .type(partner)
        .wait(800)
        .waitGet(
          '#app > div.container > div.mt-4 > div.filters-container > div.filter-item-large > div > fieldset > ul > li:nth-child(1)'
        )
        .click();
    },
    applyFilter() {
      cy.waitGet(':nth-child(4) > .btn').click();
    },
    getHistoryConsoGraph() {
      return cy.waitGet('.cmp-conso-history-data-graph .highcharts-container');
    },
  },
  report: {
    create() {
      cy.waitGet('#app > div.container > div.mt-4 > div.row.mb-4 > div.col-md-3 > button').click();
    },
    creation: {
      choosePartner(partner) {
        cy.waitGet(
          '#main-sliding-panel > div > div > div > div > div.panelContent > div.checkBoxesContainer > div.position-relative > fieldset > input'
        )
          .click()
          .type(partner)
          .waitGet(
            '#main-sliding-panel > div > div > div > div > div.panelContent > div.checkBoxesContainer > div.position-relative > fieldset > ul > li:nth-child(1)'
          )
          .click();
      },
      selectReportModel(reportModel) {
        cy.waitGet(
          '#main-sliding-panel > div > div > div > div > div.panelContent > div.checkBoxesContainer > div:nth-child(5) > div > div > select'
        ).select(reportModel);
      },
      chooseReportName(rapportName) {
        cy.waitGet(
          '#main-sliding-panel > div > div > div > div > div.fileInfo > div > div:nth-child(1) > label > input[type=text]'
        )
          .click()
          .type(rapportName);
      },
      selectFormat(format) {
        cy.waitGet(
          '#main-sliding-panel > div > div > div > div > div.fileInfo > div > div:nth-child(2) > div > div > select'
        ).select(format);
      },
    },
    validateCreation(reportName) {
      cy.waitGet(
        '#main-sliding-panel > div > div > div > div > div.fileInfo > div > div:nth-child(3) > button > span'
      ).click();
    },
    changeNameIfDoesExist(reportName) {
      if (
        cy
          .waitGet(
            '#app > div.container > div.mt-4 > div.mt-4.mb-4 > div > div > div:nth-child(2) > div > table > tbody > tr:nth-child(1) > td:nth-child(1) > div'
          )
          .contains(reportName) == null
      ) {
        let newName = createNewName(reportName);
        return newName;
      }
      return reportName;
    },
  },
};

function createNewName(reportName) {
  let nameSize = reportName.length;
  let toChange = reportName.slice(nameSize);

  if (toChange.length == 0) {
    toChange = '1';
  } else {
    let toChangeInt = parseInt(toChange, 10);
    toChangeInt++;
    toChange = toString(toChangeInt);
  }
  let newName = reportName + toChange;
  return newName;
}
