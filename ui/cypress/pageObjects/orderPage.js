import layout from './layout';

export default {
  init() {
    layout.menu.getSim();
  },
  filterBar: {
    apply() {
      cy.get('.card > .card-body > .mb-3 > .actions > button.btn-primary').click();
    },
    partner: {
      toggle() {
        cy.get('span > .foldable-block:nth-child(1) > .d-flex > .p-0 > i').click();
      },
      choose(nth) {
        cy.get(
          `div > .checkboxes > .checkbox-container:nth-child(${nth}) > .filled > .checkmark`
        ).click();
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
