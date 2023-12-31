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
        cy.wrap($el).click({ force: true });
      }
    });
  },

  chooseOtherExportType(exportType) {
    cy.get('.exportTypes .dropdown-toggle').click();
    cy.get('.dropdown-item').each(($el) => {
      if ($el.text().trim() === exportType) {
        cy.wrap($el).click({ force: true });
      }
    });
  },

  showAllLines() {
    cy.waitGet('.search-id-button')
      .click({ force: true })
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
      cy.waitGet('.flex-grow-1 > input')
        .clear({ force: true })
        .type(id);
    },
    applySearch() {
      cy.waitGet('.form-row > .col-md-3 > .btn').click({ force: true });
    },
  },
  modal: {
    cancel() {
      cy.waitGet('.modal-footer > div > button').click({ force: true });
    },
    save() {
      cy.waitGet('div.modal-footer button.btn-success').click({ force: true });
    },
  },
  filterBar: {
    apply: filterBarSelectors.applySearch,
    showAllTypes() {
      cy.waitGet('.show-all-types').click({ force: true });
    },
    partner: new MultiSelectFilter(1),
    billingAccount: new MultiSelectFilter(2),
    offer: new MultiSelectFilter(5),
    id: idFilter,
    type: new MultiSelectFilter(4),
    lineStatus: new MultiSelectFilter(8),
    billingStatus: new MultiSelectFilter(10),
    close() {
      cy.waitGet(`.ic-Arrow-Up-Icon`).click({ force: true });
    },
    saveFilter(filterName) {
      cy.waitGet('button.save-filter-btn').click({ force: true });
      cy.waitGet('label.filter-name > input').type(filterName);
      cy.waitGet('button.save-new-filter-btn').click({ force: true });
    },
    deleteFilter() {
      cy.waitGet('div.selected-filter button')
        .first()
        .click({ force: true });
    },
    openSavedFilter() {
      cy.waitGet('div.card-body > div:nth-child(2) > div.pt-3 > div:first-child > a').click({
        force: true,
      });
    },
    clickFirstSavedFilter() {
      cy.waitGet(
        'div.card-body > div:nth-child(2) > div.pt-3 > div.pt-3 > div > div > span'
      ).click({ force: true });
    },
    deleteSavedFilter() {
      cy.waitGet(
        'div.card-body > div:nth-child(2) > div.pt-3 > div.pt-3 > div > div > button'
      ).click({ force: true });
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
