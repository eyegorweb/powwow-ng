export const filterBarItems = blocIndex => {
  return {
    toggle() {
      cy.get(`span > .foldable-block:nth-child(${blocIndex}) > .d-flex > .p-0 > i`).click();
    },
    multiselect: {
      filter(term) {
        const searchBtnWhenItsPartnerFilter = `.foldable-block:nth-child(${blocIndex}) > .pt-3 > div > div > .container > .search-input > .has-icon > input`;
        const searchBtnWhenItsNotPartnerFilter = `.foldable-block:nth-child(${blocIndex}) > .pt-3 > div > .container > .search-input > .has-icon > input`;

        cy.get('body').then($body => {
          if (!!$body.find(searchBtnWhenItsPartnerFilter).length)
            cy.get(searchBtnWhenItsPartnerFilter).type(term);
          else if (!!$body.find(searchBtnWhenItsNotPartnerFilter).length)
            cy.get(searchBtnWhenItsNotPartnerFilter).type(term);
          else
            cy.get(`.foldable-block:nth-child(${blocIndex}) > .pt-3 > .container > .search-input > .has-icon > input`).type(term);
        })
      },
      choose(checkboxIndex) {
        cy.get(
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

  cy.get('body').then($body => {
    let buttonToClick;

    if (!!$body.find(searchBtnWhenCannotSaveFiltersPath).length) {
      cy.get(searchBtnWhenCannotSaveFiltersPath).click();
    } else if (!!$body.find(searchBtnWhenSaveFiltersIsActivePath).length) {
        cy.get(searchBtnWhenSaveFiltersIsActivePath).click();
    } else if (!!$body.find(searchBtnWhenOnOrderPage).length) {
        cy.get(searchBtnWhenOnOrderPage).click();
    }
    else
      cy.get('.actions > .flex-grow-1').click();
  });
}
