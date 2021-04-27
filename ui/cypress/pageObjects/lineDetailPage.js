export default {
  goBack() {
    cy.waitGet('.back-btn').click({ force: true });
  },
  openDetailPannel() {
    cy.waitGet(
      '#app > div.container > div.mt-4 > div:nth-child(3) > div.col-md-9.extra-bottom-margin > div > div > div:nth-child(2) > div:nth-child(2) > div > table > tbody > tr > td:nth-child(1) > div > button'
    ).click();
  },
  inProgress: {
    openInProgress() {
      cy.waitGet(
        '#main-sliding-panel > div > div > div > div > div > div.data-detail-container.main-content > div > div:nth-child(2) > div:nth-child(8) > div > div > button'
      ).click();
    },
    getTable() {
      return cy.waitGet(
        '#app > div.container > div.mt-4 > div.mt-4.mb-4 > div.pt-4.pl-4 > div > div > table'
      );
    },
  },
};
