export default {
  openHomeCustomizer() {
    cy.get('#app > div.container > div.mt-2 > button > span')
      .click({ force: true });
  },
  uncheckElement() {
    cy.get('#main-sliding-panel > div > div > div > div > div.data-detail-container.main-content > div')
      .children()
      .find('div')
      .then(checkboxes => {
        if (!(checkboxes[0].className[2] == ('activate'))) {
          cy.get('#main-sliding-panel > div > div > div > div > div.data-detail-container.main-content > div > div:nth-child(1) > div > div.b-check.d-flex.justify-content-center.pl-3.pt-2 > div > label > span')
            .click();
        }
      });
  },
  getCheckboxes(expectation) {
    cy.get('#main-sliding-panel > div > div > div > div > div.data-detail-container.main-content > div')
    .children()
    .find('div').then(checkboxes => {
      expectation(checkboxes);
    })
  },
  apply() {
    cy.get('.action-buttons > :nth-child(2) > .btn')
      .click();
  },
  refresh() {
    cy.startAsBO();
  },
}
