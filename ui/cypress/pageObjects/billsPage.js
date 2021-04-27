import * as filterBarSelectors from './selectors/filterbar';
import { MultiSelectFilter } from './selectors/filters';

export default {
  filterBar: {
    apply: filterBarSelectors.applySearch,
    partner: new MultiSelectFilter(1),
  },
  selectPartner(partner) {
    cy.waitGet(
      '#app > div.container > div.mt-4 > div:nth-child(2) > div > div.col-md-3.pl-0 > div > div > div > span > div:nth-child(1) > div.d-flex.align-items-center > span.title.flex-grow-1'
    )
      .click()
      .waitGet(
        '#app > div.container > div.mt-4 > div:nth-child(2) > div > div.col-md-3.pl-0 > div > div > div > span > div.foldable-block.is-open.pt-3 > div.pt-3 > div > div > fieldset > input'
      )
      .type(partner)
      .waitGet('.autocomplete-result:nth-child(1)')
      .click();
  },
  getSelectedFilters() {
    return cy.waitGet('.selected-filter');
  },
};
