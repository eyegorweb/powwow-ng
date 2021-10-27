export default {
  clickBackButton() {
    cy.waitGet('button.btn.btn-link.back-btn').click({ force: true });
    cy.wait(400);
  },
};
