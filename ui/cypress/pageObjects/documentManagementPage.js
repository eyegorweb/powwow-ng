import * as filterBarSelectors from './selectors/filterbar';
import { MultiSelectFilter } from './selectors/filters';

export default {
  filterBar: {
    apply: filterBarSelectors.applySearch,

    partners: new MultiSelectFilter(1),
    documentName: new MultiSelectFilter(2),
    category: new MultiSelectFilter(3),
    reportModel: new MultiSelectFilter(4),
    refresh() {
      cy.waitGet('div.col-md-3.pl-0 > div > div > div.mb-3 > div:nth-child(2) > button').click();
    },
  },
  export: {
    downloadFirstDocument() {
      cy.waitGet(
        'table > tbody > tr:first-child > td:nth-child(7) > div > div > div > button'
      ).click();
      cy.wait(400);
      cy.waitGet(
        'table > tbody > tr:first-child > td:nth-child(7) > div > div > div > div > div > div > button:nth-child(1)'
      ).click();
    },
    controlExportFile() {
      cy.wait(500);
      cy.wrap(null).then(() => {
        return cy.waitUntiGQLIsSent('documentExport').then((http) => {
          const downloadUri = get(http.response, 'body.data.documentExport.downloadUri');
          expect(downloadUri).to.not.be.undefined;
        });
      });
    },
  },
  deleteFirstDocument() {
    cy.waitGet(
      'table > tbody > tr:first-child > td:nth-child(7) > div > div > div > button'
    ).click();
    cy.wait(400);
    cy.waitGet(
      'table > tbody > tr:first-child > td:nth-child(7) > div > div > div > div > div > div > button:nth-child(2)'
    ).click();
  },
  getTotal() {
    return new Cypress.Promise((resolve) => {
      cy.waitGet(
        '#app > div.container > div.mt-4 > div:nth-child(2) > div > div.col-md-9 > div.row.mb-3 > div:nth-child(1) > h2 > div'
      ).then((text) => {
        const parts = text
          .text()
          .trim()
          .split(' ');
        const nbrLines = parseInt(parts[0]);
        resolve(nbrLines);
      });
    });
  },
};
