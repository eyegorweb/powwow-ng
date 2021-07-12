import layout from './layout';
import * as filterBarSelectors from './selectors/filterbar';

import { MultiSelectFilter, idFilter } from './selectors/filters';

function itemPosition(myIndex) {
  if (cy.userIsMonoPartner) {
    return myIndex - 1;
  }
  return myIndex;
}

export default {
  init() {
    layout.menu.lines();
  },
  exportFile: layout.exportFile,

  chooseExportType(exportType) {
    cy.get('.exportTypes button').each(($el) => {
      if ($el.text().trim() === exportType) {
        cy.wrap($el).click();
      }
    });
  },

  chooseOtherExportType(exportType) {
    cy.get('.exportTypes .dropdown-toggle').click();
    cy.get('.dropdown-item').each(($el) => {
      if ($el.text().trim() === exportType) {
        cy.wrap($el).click();
      }
    });
  },

  showAllLines() {
    cy.waitGet('.search-id-button')
      .click()
      .wait(500);
  },

  getRows(callback) {
    cy.waitGet('table tbody tr').then((elements) => callback(elements));
  },

  panel: {
    openForLine(index) {
      cy.waitGet(`table tbody tr:nth-child(${index}) td button`).click({ force: true });
    },
    goToDetail() {
      cy.waitGet('#main-sliding-panel button.btn-primary').click({ force: true });
    },
  },
  idSearch: {
    typeId(id) {
      cy.waitGet('.flex-grow-1 > input').type(id);
    },
    applySearch() {
      cy.waitGet('.form-row > .col-md-3 > .btn').click();
    },
  },
  filterBar: {
    apply: filterBarSelectors.applySearch,
    showAllTypes() {
      cy.waitGet('.show-all-types').click();
    },
    partner: new MultiSelectFilter(1),
    billingAccount: new MultiSelectFilter(2),
    offer: new MultiSelectFilter(5),
    id: idFilter,
    type: new MultiSelectFilter(4),
    lineStatus: new MultiSelectFilter(8),
    billingStatus: new MultiSelectFilter(10),
    close() {
      cy.waitGet(`.ic-Arrow-Up-Icon`).click();
    },
    saveFilter(filterName) {
      cy.waitGet('button.save-filter-btn').click();
      cy.waitGet('label.filter-name > input').type(filterName);
      cy.waitGet('button.save-new-filter-btn').click();
    },
    deleteFilter() {
      cy.waitGet('div.selected-filter button')
        .first()
        .click();
    },
    openSavedFilter() {
      cy.waitGet('div.card-body > div:nth-child(2) > div.pt-3 > div:first-child > a').click();
    },
    clickFirstSavedFilter() {
      cy.waitGet(
        'div.card-body > div:nth-child(2) > div.pt-3 > div.pt-3 > div > div > span'
      ).click();
    },
    deleteSavedFilter() {
      cy.waitGet(
        'div.card-body > div:nth-child(2) > div.pt-3 > div.pt-3 > div > div > button'
      ).click();
    },
    checkFilters(partner, billingAccount) {
      cy.waitGet('div.selected-filter span.detail')
        .first()
        .then((e) => {
          const text = e.text().trim();
          expect(partner).to.be.equal(text);
        });
      cy.waitGet('div.selected-filter span.detail')
        .last()
        .then((e) => {
          const text = e.text().trim();
          expect(billingAccount).to.be.equal(text);
        });
    },
  },
  modal: {
    save() {
      cy.waitGet('div.modal-footer button.btn-success').click();
    },
  },
  getTotal(onTotalLoaded) {
    return cy
      .waitGet(
        '#app > div.container > div.mt-4 > div:nth-child(3) > div.col-md-9.extra-bottom-margin > div > div > div.row.mb-3 > div:nth-child(1) > h2'
      )
      .then((e) => {
        const parts = e
          .text()
          .trim()
          .split(' ');
        const value = parseInt(parts[0]);
        onTotalLoaded(value);
      });
  },
};
