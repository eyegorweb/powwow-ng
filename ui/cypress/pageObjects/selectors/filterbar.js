export const filterBarItems = blocIndex => {
  return {
    toggle() {
      cy.get(`span > .foldable-block:nth-child(${blocIndex}) > .d-flex > .p-0 > i`).click();
    },
    multiselect: {
      filter(term) {
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
