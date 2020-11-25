import * as filterBarSelectors from './selectors/filterbar';
import { MultiSelectFilter } from './selectors/filters';

export default {
  filterBar: {
    apply: filterBarSelectors.applySearch,
    partner: new MultiSelectFilter(1),
  },
  selectPartner(partner) {
    cy.waitGet('span > .foldable-block:nth-child(1) > .d-flex > .p-0 > i')
      .click()
      .waitGet('.form-group > .form-control')
      .type(partner)
      .waitGet('.autocomplete-result:nth-child(1)')
      .click();
  },
  getSelectedFilters() {
    return cy.waitGet('.selected-filter');
  }
}
