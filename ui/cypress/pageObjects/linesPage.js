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

  showAllLines() {
    cy.waitGet('.show-all-lines').click({ force: true });
  },

  getRows(callback) {
    cy.waitGet('table tbody tr').then(elements => callback(elements));
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

    partner: new MultiSelectFilter(1),
    billingAccount: new MultiSelectFilter(2),
    offer: new MultiSelectFilter(5),
    id: idFilter,
    type: new MultiSelectFilter(4),
  },

  getTotal(onTotalLoaded) {
    return cy
      .waitGet(
        '#app > div.container > div.mt-4 > div:nth-child(3) > div.col-md-9.extra-bottom-margin > div > div > div.row.mb-3 > div:nth-child(1) > h2'
      )
      .then(e => {
        const parts = e
          .text()
          .trim()
          .split(' ');
        const value = parseInt(parts[0]);
        onTotalLoaded(value);
      });
  },
};
