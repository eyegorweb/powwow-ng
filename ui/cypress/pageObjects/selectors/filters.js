import * as filterBarSelectors from './filterbar';

export function MultiSelectFilter(index) {
  this.myIndex = index;
  this.toggle = () => {
    filterBarSelectors.filterBarItems(this.myIndex).toggle();
  };

  this.choose = nth => {
    filterBarSelectors.filterBarItems(this.myIndex).multiselect.choose(nth);
  };

  this.filter = searchTerm => {
    filterBarSelectors.filterBarItems(this.myIndex).multiselect.filter(searchTerm);
  };

  this.closeFilter = () => {
    filterBarSelectors.filterBarItems(this.myIndex).close();
  }
}

export const partnersFilter = new MultiSelectFilter(1);
partnersFilter.chosenItems = () => {
  return cy.waitGet('.selected-filter');
};

export const idFilter = new MultiSelectFilter(6);
idFilter.filter = searchTerm => {
  cy.waitGet(`.foldable-block:nth-child(6) > .pt-3 > div > label > input`)
    .click()
    .type(searchTerm);
};
