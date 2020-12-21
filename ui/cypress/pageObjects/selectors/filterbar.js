export const filterBarItems = blocIndex => {
  return {
    toggle() {
      cy.waitGet(`span > .foldable-block:nth-child(${blocIndex}) > .d-flex > .p-0 > i`).click();
    },
    multiselect: {
      filter(term) {
            cy.waitGet('.is-open .has-icon > input').type(term);
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
  const searchBtnWhenCannotSaveFiltersPath =
    '#app > div.container > div.mt-4 > div.mt-4.mb-4 > div > div > div > div > div.col-md-3.pl-0 > div > div > div.mb-3 > div.actions.d-flex.flex-column.flex-md-row.mb-2 > button';
  const searchBtnWhenSaveFiltersIsActivePath =
    '#app > div.container > div.mt-4 > div:nth-child(3) > div.col-md-3 > div.card.filter-bar > div.card-body.hide-all-filters > div:nth-child(2) > div.actions.d-flex.flex-column.flex-md-row > button';
  const searchBtnWhenOnOrderPage =
    '#app > div.container > div.mt-4 > div:nth-child(2) > div.col-md-3 > div.card.filter-bar > div.card-body.hide-all-filters > div:nth-child(2) > div.actions.d-flex.flex-column.flex-md-row > button';

  cy.waitGet('body').then($body => {
    let buttonToClick;

    if (!!$body.find(searchBtnWhenCannotSaveFiltersPath).length) {
      cy.waitGet(searchBtnWhenCannotSaveFiltersPath).click();
    } else if (!!$body.find(searchBtnWhenSaveFiltersIsActivePath).length) {
      cy.waitGet(searchBtnWhenSaveFiltersIsActivePath).click();
    } else if (!!$body.find(searchBtnWhenOnOrderPage).length) {
      cy.waitGet(searchBtnWhenOnOrderPage).click();
    } else cy.waitGet('.actions > .flex-grow-1').click();
  });
}
