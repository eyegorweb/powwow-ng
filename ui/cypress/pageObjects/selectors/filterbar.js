export const filterBarItems = (blocIndex) => {
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
      selectCheckbox(checkboxIndex) {
        cy.waitGet(
          `.is-open .checkbox-container:nth-child(${checkboxIndex}) > .filled > .checkmark`
        ).click({ force: true });
      },
      clickAutocomplete(index) {
        cy.waitGet(`.autocomplete-results > li:nth-child(${index})`).click();
      },
      openChoicesCalendrier() {
        cy.waitGet('.is-open > div.pt-3 > div > div > div').click();
      },
      selectPeriodeCalendrier(periode) {
        cy.waitGet(`body > .daterangepicker > .ranges > ul > li:nth-child(${periode})`)
          .wait(500)
          .click();
      },
      quantiteMin(number) {
        cy.waitGet(
          '.is-open > div.pt-3 > div > div > input.form-control.border-right-0.h-100'
        ).type(number);
      },
      quantiteMax(number) {
        cy.waitGet('.is-open > div.pt-3 > div > div > input.form-control.border-left-0.h-100').type(
          number
        );
      },
    },
  };
};

export function applySearch() {
  cy.waitGet('body').then(($body) => {
    cy.get('.apply-filters-btn').click({ force: true });
  });
}
