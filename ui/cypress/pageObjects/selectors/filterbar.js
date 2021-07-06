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
      select(value) {
        cy.waitGet('.is-open .select > select').select(value);
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

export function deleteFilter(index) {
  cy.waitGet('body').then(($body) => {
    cy.get(
      'div.card.filter-bar > div.card-body > div:nth-child(2) > div.mb-3 > div:nth-child(' +
        index +
        ') > button'
    ).click();
  });
}
