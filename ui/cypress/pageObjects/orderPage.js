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
        return cy.get(
          '#app > div.container > div.mt-4 > div:nth-child(2) > div.col-md-3 > div.card.filter-bar > div.card-body.hide-all-filters > div.mb-3 > div:nth-child(1) > div > div'
        );
      },
    },
  },
  getTotal(onTotalLoaded) {
    return cy
      .get(
        '#app > div.container > div.mt-4 > div:nth-child(2) > div.col-md-9 > div > div > div.row.mb-3 > div:nth-child(1) > h2'
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
