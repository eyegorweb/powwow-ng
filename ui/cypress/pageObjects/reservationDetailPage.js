import layout from './layout';

export default {
  init() {
    layout.menu.getSim();
    cy.wait(1000);
    cy.waitGet('#app > div.container > div.mt-4 > div.tabs > ol > li:nth-child(2) > a').click();
  },
  openDetailPanel() {
    cy.waitGet(
      '#app > div.container > div.mt-4 > div.pt-4.pl-4 > div > div:nth-child(2) > div > div.col-md-9 > div:nth-child(2) > div:nth-child(2) > div > table > tbody > tr > td:nth-child(1) > div > button'
    ).click();
  },
  getDetailPanel() {
    cy.waitGet('.cd-panel__container').should('be.visible');
  },
  data: {
    id(id) {
      cy.waitGet(
        '.panel-vertical-container > .main-content > div:nth-child(1) > div:nth-child(3) > p'
      ).should(($p) => {
        expect($p).to.contain(id);
      });
    },
    partnerName(partnerName) {
      cy.waitGet(
        '.panel-vertical-container > .main-content > div:nth-child(3) > div:nth-child(3) > p'
      ).should(($p) => {
        expect($p).to.contain(partnerName);
      });
    },
  },
};
