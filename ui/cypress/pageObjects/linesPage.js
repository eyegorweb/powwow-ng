import layout from './layout';
import * as filterBarSelectors from './selectors/filterbar';

import {MultiSelectFilter, idFilter} from './selectors/filters';

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
    cy.get('.show-all-lines').click({ force: true });
  },

  getRows(callback) {
    cy.get('table tbody tr').then(elements => callback(elements));
  },

  panel: {
    openForLine(index) {
      cy.get(`table tbody tr:nth-child(${index}) td button`).click({ force: true });
    },
    goToDetail() {
      cy.get('#main-sliding-panel button.btn-primary').click({ force: true });
    },
  },
  idSearch: {
    typeId(id) {
      cy.get('.flex-grow-1 > input')
        .type(id);
    },
    applySearch() {
      cy.get('.form-row > .col-md-3 > .btn')
        .click();
    }
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
    return cy.get('#app > div.container > div.mt-4 > div:nth-child(3) > div.col-md-9.extra-bottom-margin > div > div > div.row.mb-3 > div:nth-child(1) > h2').then(e => {
      const parts = e
        .text()
        .trim()
        .split(' ');
      const value = parseInt(parts[0]);
      onTotalLoaded(value);
    });
  },
};
