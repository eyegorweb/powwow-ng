export default {
  goBack() {
    cy.get('.back-btn').click({ force: true });
  },
};
