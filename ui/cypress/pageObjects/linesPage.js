import layout from './layout';
import * as filterBarSelectors from './selectors/filterbar';

function itemPosition(myIndex) {
  if (cy.userIsMonoPartner) {
    return myIndex - 1;
  }
  return myIndex;
}

export default {
  init() {
    layout.menu.lines();
  },

  showAllLines() {
    cy.get('.show-all-lines').click({ force: true });
  },

  getRows(callback) {
    cy.get('table tbody tr').then(elements => callback(elements));
  },

  panel: {
    openForLine(index) {
      cy.get(`table tbody tr:nth-child(${index}) td button`).click({ force: true });
    },
    goToDetail() {
      cy.get('#main-sliding-panel button.btn-primary').click({ force: true });
    },
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
    billingAccount: {
      toggle() {
        filterBarSelectors.filterBarItems(itemPosition(2)).toggle();
      },

      choose(nth) {
        filterBarSelectors.filterBarItems(itemPosition(2)).multiselect.choose(nth);
      },
      filter(searchTerm) {
        filterBarSelectors.filterBarItems(itemPosition(2)).multiselect.filter(searchTerm);
      },
    },
    offer: {
      toggle() {
        filterBarSelectors.filterBarItems(5).toggle();
      },
      choose(nth) {
        filterBarSelectors.filterBarItems(5).multiselect.choose(nth);
      },
      filter(searchTerm) {
        filterBarSelectors.filterBarItems(5).multiselect.filter(searchTerm);
      },
    },
    id: {
      toggle() {
        filterBarSelectors.filterBarItems(6).toggle();
      },
      choose(nth) {
        filterBarSelectors.filterBarItems(6).multiselect.choose(nth);
      },
      filter(searchTerm) {
        cy.get(`.foldable-block:nth-child(6) > .pt-3 > div > label > input`).click()
          .type(searchTerm)
      },
    },
    type: {
      toggle() {
        filterBarSelectors.filterBarItems(4).toggle();
      },
      choose(nth) {
        filterBarSelectors.filterBarItems(4).multiselect.choose(nth);
      },
      filter(searchTerm) {
        filterBarSelectors.filterBarItems(4).multiselect.filter(searchTerm);
      },
    },
  },

  getTotal(onTotalLoaded) {
    return cy.get('#app > div.container > div.mt-4 > div:nth-child(3) > div.col-md-9.extra-bottom-margin > div > div > div.row.mb-3 > div:nth-child(1) > h2').then(e => {
      const parts = e
        .text()
        .trim()
        .split(' ');
      const value = parseInt(parts[0]);
      onTotalLoaded(value);
    });
  },
};
