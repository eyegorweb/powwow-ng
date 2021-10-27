import layout from './layout';
import * as filterBarSelectors from './selectors/filterbar';

import { MultiSelectFilter } from './selectors/filters';

export default {
  init() {
    layout.menu.getSim();
    cy.wait(1000);
    cy.waitGet('#app > div.container > div.mt-4 > div.tabs > ol > li:nth-child(2) > a').click();
  },
  filterBar: {
    apply: filterBarSelectors.applySearch,

    showAllTypes() {
      cy.waitGet('a.show-all-types').click({ force: true });
    },

    partner: new MultiSelectFilter(1),
    compteFacturation: new MultiSelectFilter(2),
    dateReservation: new MultiSelectFilter(3),
    typeSIM: new MultiSelectFilter(4),
    offer: new MultiSelectFilter(5),
    quantite: new MultiSelectFilter(6),
    champLibre: new MultiSelectFilter(7),
    createurReservation: new MultiSelectFilter(8),
    action: new MultiSelectFilter(9),
  },
  idSearch: {
    selectIdType() {
      cy.waitGet('.search-container > div > div > select').select('iccid');
    },
    typeId(id) {
      cy.waitGet('.flex-grow-1 > input').type(id);
    },
    applySearch() {
      cy.waitGet('.form-row > .col-md-3 > .btn').click({ force: true });
    },
  },
  getTotal(callbackFn) {
    cy.waitGet(
      '#app > div.container > div.mt-4 > div.pt-4.pl-4 > div > div:nth-child(2) > div > div.col-md-9 > div.row.mb-3 > div:nth-child(1) > h2 > div'
    ).then((text) => {
      const parts = text
        .text()
        .trim()
        .split(' ');
      const nbrSIM = parseInt(parts[0]);
      callbackFn(nbrSIM);
    });
  },
};
