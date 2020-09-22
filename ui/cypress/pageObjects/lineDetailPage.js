export default {
  goBack() {
    cy.waitGet('.back-btn').click({ force: true });
  },
};
