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
      filterByName(searchTerm) {
        filterBarSelectors.filterBarItems(1).multiselect.filterByName(searchTerm);
      },
    },
    offer: {
      toggle() {
        filterBarSelectors.filterBarItems(3).toggle();
      },
      choose(nth) {
        filterBarSelectors.filterBarItems(3).multiselect.choose(nth);
      },
      filterByName(searchTerm) {
        filterBarSelectors.filterBarItems(3).multiselect.filterByName(searchTerm);
      },
    },
  },
};
