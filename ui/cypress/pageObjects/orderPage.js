import layout from './layout';
import * as filterBarSelectors from './selectors/filterbar';

import { MultiSelectFilter, partnersFilter } from './selectors/filters';

export default {
  init() {
    layout.menu.getSim();
  },
  filterBar: {
    apply: filterBarSelectors.applySearch,
    partner: partnersFilter,
    offer: new MultiSelectFilter(6),
    type: new MultiSelectFilter(4),
    billingAccount: new MultiSelectFilter(2),
    status: {
      toggle() {
        filterBarSelectors.filterBarItems(3).toggle();
      },
      choose(statusToChoose) {
        cy.waitGet('span > .foldable-block:nth-child(3) > .pt-3 > div')
          .children()
          .find('label')
          .then(labelElems => {
            labelElems.each((index, labelElem) => {
              if (statusToChoose === labelElem.textContent) {
                cy.waitGet(labelElem)
                  .children('.checkmark')
                  .click({ force: true });
              }
            });
          });
      },
    },
  },
  idSearch: {
    typeId(id) {
      cy.waitGet('#app > div.container > div.mt-4 > div:nth-child(2) > div.col-md-9 > div > div > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > form > div > div.form-group.mb-0.col-md-8 > div > label > input')
        .type(id);
    },
    applySearch() {
      cy.waitGet('.form-row > .col-md-3 > .btn')
        .click();
    }
  },
  getTotal(onTotalLoaded) {
    return cy.waitGet('.total').then(e => {
      const parts = e
        .text()
        .trim()
        .split(' ');
      const value = parseInt(parts[0]);
      onTotalLoaded(value);
    });
  },
};
