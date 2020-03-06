import layout from './layout';
import * as filterBarSelectors from './selectors/filterbar';

export default {
  init() {
    layout.menu.massActions();
  },
  filterBar: {
    apply: filterBarSelectors.applySearch,

    getSelectedFilters(onFilterFoundFn) {
      cy.get('.selected-filter .detail').then(e => {
        const formatted = [];
        for (let i = 0; i < e.length; i++) {
          formatted.push(e[i].innerText);
        }
        onFilterFoundFn(formatted);
      });
    },

    creationDate: {
      toggle() {
        filterBarSelectors.filterBarItems(4).toggle();
      },

      openChoices() {
        cy.get('.foldable-block > .pt-3 > div > div > div').click();
      },

      preselect(choice) {
        cy.get(`body > .daterangepicker > .ranges > ul > li:nth-child(${choice})`).click();
      },
    },
  },
};
