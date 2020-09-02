import layout from './layout';
import * as filterBarSelectors from './selectors/filterbar';

import { MultiSelectFilter} from './selectors/filters';
function itemPosition(myIndex) {
  if (cy.userIsMonoPartner) {
    return myIndex - 1;
  }

  return myIndex;
}

export default {
  init() {
    layout.menu.alarms();
  },

  filterBar: {
    apply: filterBarSelectors.applySearch,

    partner: new MultiSelectFilter(1),
    billingAccount: new MultiSelectFilter(2),
    offer: new MultiSelectFilter(3),
    alarmRange: new MultiSelectFilter(4),
  },
  idSearch: {
    typeId(id) {
      cy.get('.d-block > input')
        .type(id);
    },
    applySearch() {
      cy.get('.col-md-3 > .btn')
        .click();
    }
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
