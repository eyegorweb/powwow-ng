import * as filterBarSelectors from './selectors/filterbar';
import { MultiSelectFilter } from './selectors/filters';

export default {
  contextBar: {
    writePartner(partner) {
      cy.waitGet('div.partnerSelect > div > div > label > input').type(partner);
    },
    choosePartner() {
      cy.waitGet('div.partnerSelect > div > div > div > div > div > label > span.checkmark').click({
        force: true,
      });
    },
    apply() {
      cy.waitGet('button.contextBarApply').click();
    },
    deleteSecondPartner() {
      cy.waitGet('div.partnerSelect > div > div > label > div:nth-child(3) > img').click();
    },
  },
  filterBar: {
    apply: filterBarSelectors.applySearch,
    deleteFilter: filterBarSelectors.deleteFilter,

    partner: new MultiSelectFilter(1),
  },
  orderIndicators: {
    clickOrdersToBeValidated() {
      cy.waitGet('div.col-md-3 > div:nth-child(1) > ul > li:first-child > div > button').click();
    },
    checkOrdersToBeValidated() {
      cy.waitGet(
        'div.col-md-3 > div:nth-child(1) > ul > li:first-child > div > button > span'
      ).then(($number) => {
        const ordersToBeValidated = $number.text();

        cy.waitGet(
          'div.pt-4.pl-4 > div > div:nth-child(2) > div.col-md-9 > div > div > div.row.mb-3 > div:nth-child(1) > h2'
        ).then(($text) => {
          const parts = $text
            .text()
            .trim()
            .split(' ');
          const nbrOrders = parseInt(parts[0]);
          expect(nbrOrders, 'Number of orders to be validated').to.equal(ordersToBeValidated);
        });
      });
    },
    clickOrdersBeingProcessed() {
      cy.waitGet('div.col-md-3 > div:nth-child(1) > ul > li:nth-child(2) > div > button').click();
    },
    checkOrdersBeingProcessed() {
      cy.waitGet(
        'div.col-md-3 > div:nth-child(1) > ul > li:nth-child(2) > div > button > span'
      ).then(($number) => {
        const ordersBeingProcessed = $number.text();

        cy.waitGet(
          'div.pt-4.pl-4 > div > div:nth-child(2) > div.col-md-9 > div > div > div.row.mb-3 > div:nth-child(1) > h2'
        ).then(($text) => {
          const parts = $text
            .text()
            .trim()
            .split(' ');
          const nbrOrders = parseInt(parts[0]);
          expect(nbrOrders, 'Number of orders being processed').to.equal(ordersBeingProcessed);
        });
      });
    },
    clickFailedOrders() {
      cy.waitGet('div.col-md-3 > div:nth-child(1) > ul > li:nth-child(3) > div > button').click();
    },
    checkFailedOrders() {
      cy.waitGet(
        'div.col-md-3 > div:nth-child(1) > ul > li:nth-child(3) > div > button > span'
      ).then(($number) => {
        const failedOrders = parseInt($number.text());

        cy.waitGet(
          'div.pt-4.pl-4 > div > div:nth-child(2) > div.col-md-9 > div > div > div.row.mb-3 > div:nth-child(1) > h2'
        ).then(($text) => {
          const parts = $text
            .text()
            .trim()
            .split(' ');
          const nbrOrders = parseInt(parts[0]);
          expect(nbrOrders, 'Number of failed orders').to.equal(failedOrders);
        });
      });
    },
  },
  linesIndicators: {
    clickSuspendedLines() {
      cy.waitGet('div.col-md-3 > div:nth-child(1) > ul > li:nth-child(2) > div > button').click();
    },
    checkSuspendedLines() {
      cy.waitGet(
        'div.col-md-3 > div:nth-child(1) > ul > li:nth-child(2) > div > button > span'
      ).then(($number) => {
        const suspendedLines = parseInt($number.text());

        cy.waitGet(
          'div.col-md-9.extra-bottom-margin > div > div > div.row.mb-3 > div:nth-child(1) > h2'
        ).then(($text) => {
          const parts = $text
            .text()
            .trim()
            .split(' ');
          const nbrLines = parseInt(parts[0]);
          expect(nbrLines, 'Number of suspended lines').to.equal(suspendedLines);
        });
      });
    },
    clickTraffickingLines() {
      cy.waitGet('div.col-md-3 > div:nth-child(1) > ul > li:nth-child(3) > div > button').click();
    },
    checkTraffickingLines() {
      cy.waitGet(
        'div.col-md-3 > div:nth-child(1) > ul > li:nth-child(3) > div > button > span'
      ).then(($number) => {
        const traffickingLines = parseInt($number.text());

        cy.waitGet(
          'div.col-md-9.extra-bottom-margin > div > div > div.row.mb-3 > div:nth-child(1) > h2'
        ).then(($text) => {
          const parts = $text
            .text()
            .trim()
            .split(' ');
          const nbrLines = parseInt(parts[0]);
          expect(nbrLines, 'Number of trafficking lines').to.equal(traffickingLines);
        });
      });
    },
  },
  actsIndicators: {
    clickActsInProgress() {
      cy.waitGet(
        'div.col-md-3 > div:nth-child(1) > div > ul > li:nth-child(1) > div > button'
      ).click();
    },
    checkActsInProgress() {
      cy.waitGet(
        'div.col-md-3 > div:nth-child(1) > div > ul > li:nth-child(1) > div > button > span'
      ).then(($number) => {
        const actsInProgress = parseInt($number.text());

        cy.waitGet('div.col-md-9 > div > div > div.row.mb-3 > div:nth-child(1) > h2').then(
          ($text) => {
            const parts = $text
              .text()
              .trim()
              .split(' ');
            const nbrActs = parseInt(parts[0]);
            expect(nbrActs, 'Number of acts in progress').to.equal(actsInProgress);
          }
        );
      });
    },
    clickScheduledActs() {
      cy.waitGet(
        'div.col-md-3 > div:nth-child(1) > div > ul > li:nth-child(2) > div > button'
      ).click();
    },
    checkScheduledActs() {
      cy.waitGet(
        'div.col-md-3 > div:nth-child(1) > div > ul > li:nth-child(2) > div > button > span'
      ).then(($number) => {
        const scheduledActs = parseInt($number.text());

        cy.waitGet('div.col-md-9 > div > div > div.row.mb-3 > div:nth-child(1) > h2').then(
          ($text) => {
            const parts = $text
              .text()
              .trim()
              .split(' ');
            const nbrActs = parseInt(parts[0]);
            expect(nbrActs, 'Number of scheduled acts').to.equal(scheduledActs);
          }
        );
      });
    },
  },
};
