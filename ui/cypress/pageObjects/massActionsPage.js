import layout from './layout';
import * as filterBarSelectors from './selectors/filterbar';

import { MultiSelectFilter } from './selectors/filters';

export default {
  init() {
    layout.menu.massActions();
  },
  clickClock() {
    cy.waitGet('.icon.ic-Clock-Icon.nb-acts').click({ force: true });
  },
  openDetailPanel(id) {
    cy.get('.id-cell').each(($el) => {
      if ($el.text().trim() === '' + id) {
        cy.wrap($el).click();
      }
    });
  },
  clickFirstId() {
    cy.waitGet('table > tbody > tr > td:first-child > div > button').click({ force: true });
  },
  verifyUrl(url) {
    cy.url().should('include', url);
  },
  tableIsVisible() {
    cy.waitGet('table').should('be.visible');
  },
  exportFile: layout.exportFile,
  setCompleteExport() {
    cy.get('.checkbox-container').click({ force: true });
  },
  idSearch: {
    typeId(id) {
      cy.waitGet('.flex-grow-1 > input').type(id);
    },
    applySearch() {
      cy.waitGet('.col-md-3 > .btn').click({ force: true });
    },
  },
  filterBar: {
    apply: filterBarSelectors.applySearch,
    partner: new MultiSelectFilter(1),
    requestCreator: new MultiSelectFilter(2),
    actionType: new MultiSelectFilter(3),
    getSelectedFilters(onFilterFoundFn) {
      cy.waitGet('.selected-filter .detail').then((e) => {
        const formatted = [];
        for (let i = 0; i < e.length; i++) {
          formatted.push(e[i].innerText);
        }
        onFilterFoundFn(formatted);
      });
    },
    removeDefaultFilter() {
      cy.waitGet('.card.filter-bar .close').click({ force: true });
    },
    deleteFilter() {
      cy.waitGet('div.selected-filter button')
        .last()
        .click({ force: true });
    },
    creationDate: {
      toggle() {
        filterBarSelectors.filterBarItems(4).toggle();
      },

      openChoices() {
        cy.waitGet('.foldable-block.is-open > .pt-3 > div > div > div').click({ force: true });
      },

      preselect(choice) {
        cy.waitGet(`body > .daterangepicker > .ranges > ul > li:nth-child(${choice})`)
          .wait(500)
          .click({ force: true });
      },
    },
  },
  getTotal() {
    return new Promise((resolve) => {
      cy.wait(200);
      cy.waitGet('.mb-3 > :nth-child(1) > .text-gray').then((e) => {
        const parts = e
          .text()
          .trim()
          .split(' ');
        const value = parseInt(parts[0]);
        resolve(value);
      });
    });
  },
};
