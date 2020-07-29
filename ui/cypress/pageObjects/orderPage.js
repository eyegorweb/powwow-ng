import layout from './layout';
import * as filterBarSelectors from './selectors/filterbar';

export default {
  init() {
    layout.menu.getSim();
  },
  filterBar: {
    apply: filterBarSelectors.applySearch,
    partner: {
      toggle() {
        filterBarSelectors.filterBarItems(1).toggle();
      },
      choose(nth) {
        filterBarSelectors.filterBarItems(1).multiselect.choose(nth);
      },
      filter(searchTerm) {
        filterBarSelectors.filterBarItems(1).multiselect.filter(searchTerm);
      },
      chosenItems() {
        return cy.get('.selected-filter');
      },
    },
    offer: {
      toggle() {
        filterBarSelectors.filterBarItems(6).toggle();
      },
      choose(nth) {
        filterBarSelectors.filterBarItems(6).multiselect.choose(nth);
      },
      filter(searchTerm) {
        filterBarSelectors.filterBarItems(6).multiselect.filter(searchTerm);
      },
    },
  },
  getTotal(onTotalLoaded) {
    return cy.get('.total').then(e => {
      const parts = e
        .text()
        .trim()
        .split(' ');
      const value = parseInt(parts[0]);
      onTotalLoaded(value);
    });
  },
};
