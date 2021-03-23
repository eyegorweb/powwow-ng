import layout from './layout';
import * as filterBarSelectors from './selectors/filterbar';

import { MultiSelectFilter } from './selectors/filters';
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
  exportFile: layout.exportFile,
  openDetailPanel(id) {
    cy.get('tbody tr td div button.id-cell').each($el => {
      if ($el.text().trim() === '' + id) {
        cy.wrap($el).click();
      }
    });
  },
  detailPanel: {
    gotoDetail() {
      cy.get('.goto-detail-button button').click();
    },
  },
  filterBar: {
    apply: filterBarSelectors.applySearch,

    partner: new MultiSelectFilter(1),
    billingAccount: new MultiSelectFilter(2),
    offer: new MultiSelectFilter(3),
    alarmRange: new MultiSelectFilter(4),
    close() {
      cy.waitGet(`.ic-Arrow-Up-Icon`).click();
    },
  },
  idSearch: {
    typeId(id) {
      cy.waitGet('.d-block > input')
        .wait(500)
        .type(id);
    },
    applySearch() {
      cy.waitGet('.col-md-3 > .btn').click();
    },
  },
  getTotal() {
    return new Cypress.Promise(resolve => {
      cy.waitGet(
        '#app > div.container > div.mt-4 > div.mt-4.mb-4 > div > div > div > div > div > div > div.col-md-9 > div.row.mb-3 > div:nth-child(1) > h2 > div'
      ).then(e => {
        console.log('getTotal -> parts', e.text());
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
