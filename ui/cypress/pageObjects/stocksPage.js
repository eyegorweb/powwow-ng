import layout from './layout';
import * as filterBarSelectors from './selectors/filterbar';

import { MultiSelectFilter } from './selectors/filters';

export default {
  init() {
    layout.menu.stocks();
  },
  filterBar: {
    apply: filterBarSelectors.applySearch,

    partner: new MultiSelectFilter(1),
    typeSIM: new MultiSelectFilter(2),
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
        const nbrSIM = parseInt(parts[0]);
        resolve(nbrSIM);
      });
    });
  },
};
