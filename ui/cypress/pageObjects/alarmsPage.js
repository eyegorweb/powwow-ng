import layout from './layout';
import * as filterBarSelectors from './selectors/filterbar';

import { MultiSelectFilter } from './selectors/filters';

function itemPosition(myIndex) {
  if (cy.userIsMonoPartner) {
    return myIndex - 1;
  }

  return myIndex;
}

export default {
  init() {
    layout.menu.alarms();
  },
  exportFile: layout.exportFile,
  detailPanel: {
    gotoDetail() {
      cy.get('.goto-detail-button > button').click();
    },
  },
  filterBar: {
    apply: filterBarSelectors.applySearch,

    partner: new MultiSelectFilter(1),
    billingAccount: new MultiSelectFilter(2),
    offer: new MultiSelectFilter(3),
    alarmRange: new MultiSelectFilter(4),
    alarmType: new MultiSelectFilter(5),
    close() {
      cy.waitGet(`.ic-Arrow-Up-Icon`).click();
    },
  },
  idSearch: {
    typeId(id) {
      cy.waitGet(
        '#app > div.container > div.mt-4 > div.mt-4.mb-4 > div > div > div > div > div > div > div.col-md-9 > div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > div > form > div > div.form-group.mb-0.col-md-8 > label > input'
      )
        .wait(500)
        .type(id);
    },
    applySearch() {
      cy.waitGet(
        '#app > div.container > div.mt-4 > div.mt-4.mb-4 > div > div > div > div > div > div > div.col-md-9 > div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > div > form > div > div.form-group.col-md-3.mb-0 > button'
      ).click();
    },
  },
  clickFirstId() {
    cy.waitGet('table > tbody > tr:first-child > td:first-child > div > button').click({
      force: true,
    });
  },
  clickModifyAlarm() {
    cy.waitGet('div.footer-panel-buttons > div > div > button.btn-import').click();
  },
  verifyCreation(nbrSharedAlarms) {
    cy.waitGet('.mb-3 > :nth-child(1) > .text-gray').should(($e) => {
      const parts = $e
        .text()
        .trim()
        .split(' ');
      const value = parseInt(parts[0]);
      expect(value, 'Total shared alarms').to.equal(nbrSharedAlarms + 1);
    });
  },
  verifyModification(lastAlarmName) {
    cy.waitGet('#app > div.container > div.mt-4 > div.row.mb-5 > div.col-md-9 > h4 > span').should(
      ($alarmName) => {
        const parts = $alarmName
          .text()
          .trim()
          .split(': ');
        const value = parts[1];
        expect(value, 'New alarm name').to.not.equal(lastAlarmName);
      }
    );
  },
  sharedAlarms: {
    goTo() {
      cy.waitGet('div.mt-4.mb-4 > div > ol > li:last-child > a').click();
      cy.wait(400);
    },
    verifyModification(lastAlarmName) {
      cy.waitGet(
        'table > tbody > tr:first-child > td:nth-child(2) > div > div > div:nth-child(1)'
      ).should(($alarmName) => {
        const value = $alarmName.text();
        expect(value, 'New alarm name').to.not.equal(lastAlarmName);
      });
    },
  },
  getTotal() {
    return new Cypress.Promise((resolve) => {});
  },
};
