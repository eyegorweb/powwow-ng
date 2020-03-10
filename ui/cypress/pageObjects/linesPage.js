import layout from './layout';

export default {
  init() {
    layout.menu.lines();
  },

  showAllLines() {
    cy.get('.col-md-9 > .position-relative > div > .alert > .flex-grow-1').click({ force: true });
  },

  getRows(callback) {
    cy.get('table tbody tr').then(elements => callback(elements));
  },

  panel: {
    openForLine(index) {
      cy.get(`table tbody tr:nth-child(${index}) td button`).click({ force: true });
    },
    goToDetail() {
      cy.get('#main-sliding-panel button.btn-primary').click({ force: true });
    },
  },
};
