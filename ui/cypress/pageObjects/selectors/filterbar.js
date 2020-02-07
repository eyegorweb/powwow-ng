export const filterBarItems = blocIndex => {
  return {
    toggle() {
      cy.get(`span > .foldable-block:nth-child(${blocIndex}) > .d-flex > .p-0 > i`).click();
    },
    multiselect: {
      filterByName(term) {
        cy.get(
          `.foldable-block:nth-child(${blocIndex}) > .pt-3 > .container > .search-input > .has-icon > input`
        ).type(term);
      },
      choose(checkboxIndex) {
        cy.get(
          `.foldable-block:nth-child(${blocIndex}) .checkboxes > .checkbox-container:nth-child(${checkboxIndex}) > .filled > .checkmark`
        ).click();
      },
    },
  };
};

export function applySearch() {
  cy.get('.card.filter-bar > .card-body > .mb-3 > .actions > button.btn-primary').click();
}

export function getTotal(onTotalLoaded) {
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
}
