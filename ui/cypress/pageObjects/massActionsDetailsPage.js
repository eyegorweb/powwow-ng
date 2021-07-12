export default {
  clickBackButton() {
    cy.waitGet('button.btn.btn-link.back-btn').click();
    cy.wait(400);
  },
};
