export default {
  searchUserByLogin(userLogin) {
    cy.get('.d-block > input')
      .click()
      .type(userLogin)
      .wait(200)
      .get('.form-row > .col-md-3 > .btn')
      .click()
      .wait(400);
  },
  getTotal() {
    return new Promise(resolve => {
      cy.waitGet('.mb-3 > :nth-child(1) > .text-gray').then(e => {
        const parts = e
          .text()
          .trim()
          .split(' ');
        const value = parseInt(parts[0]);
        resolve(value);
      });
    });
  },
};
