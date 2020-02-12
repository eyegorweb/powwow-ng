import layout from './layout';
import * as filterBarSelectors from './selectors/filterbar';

export default {
  init() {
    layout.menu.alarms();
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
    },
    offer: {
      toggle() {
        filterBarSelectors.filterBarItems(3).toggle();
      },
      choose(nth) {
        filterBarSelectors.filterBarItems(3).multiselect.choose(nth);
      },
      filter(searchTerm) {
        filterBarSelectors.filterBarItems(3).multiselect.filter(searchTerm);
      },
    },
  },

  getTotal(onTotalLoaded) {
    return cy.get('.col-md-9 > .position-relative > .row > .col-md-8 > .text-gray').then(e => {
      const parts = e
        .text()
        .trim()
        .split(' ');
      const value = parseInt(parts[0]);
      onTotalLoaded(value);
    });
  },
};
