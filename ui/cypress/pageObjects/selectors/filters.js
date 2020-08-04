import * as filterBarSelectors from './filterbar';

export function MultiSelectFilter(index) {
  this.myIndex = index;
  this.toggle = () => {
    filterBarSelectors.filterBarItems(this.myIndex).toggle();
  }

  this.choose = (nth) => {
    filterBarSelectors.filterBarItems(this.myIndex).multiselect.choose(nth);
  }

  this.filter = (searchTerm) => {
    filterBarSelectors.filterBarItems(this.myIndex).multiselect.filter(searchTerm);
  }
}

export const partnersFilter = new MultiSelectFilter(1);
partnersFilter.chosenItems = () => {
  return cy.get('.selected-filter');
};
