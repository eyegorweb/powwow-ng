import layout from './layout';
import * as filterBarSelectors from './selectors/filterbar';

import { MultiSelectFilter } from './selectors/filters';

export default {
  init() {
    layout.menu.massActions();
  },
  idSearch: {
    typeId(id) {
      cy.waitGet('.flex-grow-1 > input').type(id);
    },
    applySearch() {
      cy.waitGet('.col-md-3 > .btn').click();
    },
  },
  filterBar: {
    apply: filterBarSelectors.applySearch,
    partner: new MultiSelectFilter(1),
    requestCreator: new MultiSelectFilter(2),
    actionType: new MultiSelectFilter(3),
    getSelectedFilters(onFilterFoundFn) {
      cy.waitGet('.selected-filter .detail').then(e => {
        const formatted = [];
        for (let i = 0; i < e.length; i++) {
          formatted.push(e[i].innerText);
        }
        onFilterFoundFn(formatted);
      });
    },
    removeDefaultFilter() {
      cy.waitGet(':nth-child(1) > .close > span').click();
    },
    creationDate: {
      toggle() {
        filterBarSelectors.filterBarItems(4).toggle();
      },

      openChoices() {
        cy.waitGet('.foldable-block > .pt-3 > div > div > div').click();
      },

      preselect(choice) {
        cy.waitGet(`body > .daterangepicker > .ranges > ul > li:nth-child(${choice})`).click();
      },
    },
  },
  getTotal() {
    return new Promise(resolve => {
      cy.waitGet('.mb-3 > :nth-child(1) > .text-gray').then(e => {
        const parts = e
          .text()
          .trim()
          .split(' ');
        const value = parseInt(parts[0]);
        resolve(value);
      });
    });
  },
};
