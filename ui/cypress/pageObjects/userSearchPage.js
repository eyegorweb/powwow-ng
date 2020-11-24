import * as filterBarSelectors from './selectors/filterbar';
import { MultiSelectFilter } from './selectors/filters';

export default {
  search: {
    typeUser(user) {
      cy.get(
        '#app > div.container > div.mt-4 > div:nth-child(2) > div > div.col-md-9 > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div > div > form > div > div.form-group.mb-0.col-md-8 > label > input[type=text]'
      )
        .click()
        .type(user);
    },
    launchSearch() {
      cy.get(
        '#app > div.container > div.mt-4 > div:nth-child(2) > div > div.col-md-9 > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div > div > form > div > div.form-group.col-md-3.mb-0 > button'
      ).click();
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
        cy.waitGet(':nth-child(4) > .d-flex > .p-0 > .ic-Arrow-Down-Icon').click();
      },
      selectStatus(status) {
        let path;
        if (status == 'Actif') path = '.item > :nth-child(1)';
        else if (status == 'Non actif') path = '.item > :nth-child(2)';
        cy.waitGet(path).click();
      },
    },
    getSelectedFilters(onFilterFoundFn) {
      cy.waitGet('.selected-filter .detail').then(e => {
        const formatted = [];
        for (let i = 0; i < e.length; i++) {
          formatted.push(e[i].innerText);
        }
        onFilterFoundFn(formatted);
      });
    },
  },
};
