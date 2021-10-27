import * as filterBarSelectors from './selectors/filterbar';
import { MultiSelectFilter } from './selectors/filters';

export default {
  search: {
    typeUser(user) {
      cy.get(
        '#app > div.container > div.mt-4 > div:nth-child(2) > div > div.col-md-9 > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div > div > form > div > div.form-group.mb-0.col-md-8 > label > input[type=text]'
      )
        .click({ force: true })
        .clear({ force: true })
        .type(user);
    },
    launchSearch() {
      cy.get(
        '#app > div.container > div.mt-4 > div:nth-child(2) > div > div.col-md-9 > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div > div > form > div > div.form-group.col-md-3.mb-0 > button'
      ).click({ force: true });
    },
    reinit() {
      cy.waitGet('div.col-md-9 > div:nth-child(2) > div > div:nth-child(1) > button').click({
        force: true,
      });
    },
  },
  filterBar: {
    apply: filterBarSelectors.applySearch,
    name: new MultiSelectFilter(1),
    email: new MultiSelectFilter(2),
    role: new MultiSelectFilter(3),
    partnerGroup: new MultiSelectFilter(5),
    partner: new MultiSelectFilter(6),
    status: {
      toggle() {
        cy.waitGet('span > .foldable-block:nth-child(4) > .d-flex > .p-0 > i').click({
          force: true,
        });
      },
      selectStatus(status) {
        let path;
        if (status == 'Actif') path = '.item > :nth-child(1)';
        else if (status == 'Non actif') path = '.item > :nth-child(2)';
        cy.waitGet(path).click({ force: true });
      },
    },
    getSelectedFilters(onFilterFoundFn) {
      cy.waitGet('.selected-filter .detail').then((e) => {
        const formatted = [];
        for (let i = 0; i < e.length; i++) {
          formatted.push(e[i].innerText);
        }
        onFilterFoundFn(formatted);
      });
    },
    deleteFilter() {
      cy.waitGet('div.selected-filter button')
        .first()
        .click({ force: true });
    },
  },
};
