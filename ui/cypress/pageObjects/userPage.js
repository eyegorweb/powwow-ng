export default {
  addUser() {
    cy.waitGet('button.btn-accent').click();
  },
  searchUserByLogin(userLogin) {
    cy.get('.d-block > input')
      .click()
      .clear()
      .type(userLogin)
      .wait(200)
      .get('.form-row > .col-md-3 > .btn')
      .click()
      .wait(400);
  },
  clickModifyButton() {
    cy.waitGet(
      'table > tbody > tr:nth-child(1) > td:nth-child(9) > div > div > div > button'
    ).click();
    cy.wait(400);
    cy.waitGet(
      'table > tbody > tr:nth-child(1) > td:nth-child(9) > div > div > div > div > div > div > button:nth-child(3)'
    ).click();
  },
  getTotal() {
    return new Promise((resolve) => {
      cy.waitGet('.mb-3 > :nth-child(1) > .text-gray').then((e) => {
        const parts = e
          .text()
          .trim()
          .split(' ');
        const value = parseInt(parts[0]);
        cy.log(value);
        resolve(value);
      });
    });
  },
  verifyUserCreation(nbrUsers) {
    cy.waitGet('.mb-3 > :nth-child(1) > .text-gray').should(($e) => {
      const parts = $e
        .text()
        .trim()
        .split(' ');
      const value = parseInt(parts[0]);
      expect(value, 'Total user number').to.equal(nbrUsers + 1);
    });
  },
  verifyUserModification(lastFirstname) {
    cy.waitGet('table > tbody > tr:first-child > td:nth-child(4) > div > div').should(
      ($firstname) => {
        const parts = $firstname
          .text()
          .trim()
          .split(' ');
        const value = parts[0];
        expect(value, 'New firstname').to.not.equal(lastFirstname);
      }
    );
  },
};
