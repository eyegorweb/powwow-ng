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
  getTotal(onTotalLoaded) {
    return cy.get('.mb-3 > :nth-child(1) > .text-gray > div').then(e => {
      const parts = e
        .text()
        .trim()
        .split(' ');
      const value = parseInt(parts[0]);
      onTotalLoaded(value);
    });
  },
}
