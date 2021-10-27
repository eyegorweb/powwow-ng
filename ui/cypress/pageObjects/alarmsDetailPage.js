import layout from './layout';
import * as filterBarSelectors from './selectors/filterbar';
import { MultiSelectFilter } from './selectors/filters';

export default {
  exportFile: layout.exportFile,
  tabs: {
    chooseTab(labelToChoose) {
      cy.get('.tabs ol li a').each(($el) => {
        if (
          $el
            .text()
            .trim()
            .toLowerCase()
            .includes(labelToChoose.toLowerCase())
        ) {
          cy.wrap($el).click({ force: true });
        }
      });
    },
  },
  modal: {
    confirm() {
      cy.waitGet('.modal-footer > div > .btn-success').click({ force: true });
    },
  },
  selectFirstLine() {
    cy.waitGet('table > tbody > tr:first-child > td:first-child > div > div > label > span').click({
      force: true,
    });
  },
  clickReactivateLineAlarm() {
    cy.waitGet('.reactivate-line-alarm').click({ force: true });
  },
  verifyUrl(id) {
    cy.url().should('include', '/alarm/' + id);
  },
  table: {
    checkResult(result) {
      cy.waitGet('.mb-3 > :nth-child(1) > .text-gray').then((e) => {
        const parts = e
          .text()
          .trim()
          .split(' ');
        const value = parts[0];
        expect(value).to.be.equal(result);
      });
    },
  },
  triggeringWithinAMonth: {
    isSelected() {
      cy.waitGet('.alarm-tab:first-child').should('have.class', 'is-selected');
    },
    filterBar: {
      apply: filterBarSelectors.applySearch,

      triggerMotives: new MultiSelectFilter(1),
      lastTriggerDate: new MultiSelectFilter(2),
    },
  },
  linesTargetedByTheAlarm: {
    isSelected() {
      cy.waitGet('.alarm-tab:nth-child(2)').should('have.class', 'is-selected');
    },
    filterBar: {
      apply: filterBarSelectors.applySearch,

      triggerMotives: new MultiSelectFilter(1),
      lastTriggerDate: new MultiSelectFilter(2),
      filterFromAFile: new MultiSelectFilter(3),
    },
  },
  excludedLines: {
    isSelected() {
      cy.waitGet('.alarm-tab:last-child').should('have.class', 'is-selected');
    },
    filterBar: {
      apply: filterBarSelectors.applySearch,

      billingAccount: new MultiSelectFilter(1),
      offers: new MultiSelectFilter(2),
      filterFromAFile: new MultiSelectFilter(3),
    },
  },
};
