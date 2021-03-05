export const filterBarItems = blocIndex => {
  return {
    toggle() {
      cy.waitGet(`span > .foldable-block:nth-child(${blocIndex}) > .d-flex > .p-0 > i`).click();
    },
    multiselect: {
      filter(term) {
        cy.waitGet('.is-open .cmp-ui-input input').type(term);
      },
      choose(checkboxIndex) {
        cy.waitGet(
          `.foldable-block:nth-child(${blocIndex}) .checkboxes > .checkbox-container:nth-child(${checkboxIndex}) > .filled > .checkmark`
        ).click({ force: true });
      },
    },
  };
};

export function applySearch() {
  cy.waitGet('body').then($body => {
    cy.get('.apply-filters-btn').click({ force: true });
  });
}
