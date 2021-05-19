import layout from './layout';
import * as filterBarSelectors from './selectors/filterbar';

import { MultiSelectFilter } from './selectors/filters';

export default {
  init() {
    layout.menu.partnerManagement();
  },
  filterBar: {
    apply: filterBarSelectors.applySearch,

    socialReason: new MultiSelectFilter(1),
    partnerType: new MultiSelectFilter(2),
    partnerGroup: new MultiSelectFilter(3),
    typeOfSIMCard: new MultiSelectFilter(4),
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
