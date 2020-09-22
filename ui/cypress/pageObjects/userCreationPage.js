export default {
  addUser() {
    cy.waitGet('#app > div.container > div.mt-4 > div.row.mb-5 > div.col-md-3 > button').click();
  },
  checkUserSex(userSex) {
    let checkboxPath = '';

    if (userSex === 'M')
      checkboxPath =
        '#main-sliding-panel > div > div > div > div > div.data-detail-container.main-content > div > div.row.mb-3 > div > div > label.radio-container.mr-3 > span';
    else
      checkboxPath =
        '#main-sliding-panel > div > div > div > div > div.data-detail-container.main-content > div > div.row.mb-3 > div > div > label:nth-child(2) > span';
    cy.waitGet(checkboxPath).click();
  },
  fillUserFirstName(userFirstName) {
    cy.waitGet(
      '#main-sliding-panel > div > div > div > div > div.data-detail-container.main-content > div > div:nth-child(4) > div:nth-child(1) > div > input'
    )
      .click()
      .type(userFirstName);
  },
  fillUserLastName(userLastName) {
    cy.waitGet(
      '#main-sliding-panel > div > div > div > div > div.data-detail-container.main-content > div > div:nth-child(4) > div.form-entry.pl-2 > div > input'
    )
      .click()
      .type(userLastName);
  },
  fillUserEmail(email) {
    cy.waitGet(
      '#main-sliding-panel > div > div > div > div > div.data-detail-container.main-content > div > div:nth-child(5) > div > div > input'
    )
      .click()
      .type(email);
  },
  fillUserLogin(userLogin) {
    cy.waitGet(
      '#main-sliding-panel > div > div > div > div > div.data-detail-container.main-content > div > div:nth-child(6) > div > div > input'
    )
      .click()
      .type(userLogin);
  },
  fillUserPassword(userLogin) {
    cy.waitGet(
      '#main-sliding-panel > div > div > div > div > div.data-detail-container.main-content > div > div:nth-child(7) > div:nth-child(1) > div > input'
    )
      .click()
      .type(userLogin);
    cy.waitGet(
      '#main-sliding-panel > div > div > div > div > div.data-detail-container.main-content > div > div:nth-child(7) > div.form-entry.pl-2 > div > input'
    )
      .click()
      .type(userLogin);
  },
  chooseRole() {
    cy.waitGet('#main-sliding-panel > div > div > div > div > div.data-detail-container.main-content > div > div:nth-child(9) > div > div > div > div:nth-child(2) > label > span')
      .click();
      // changer la maniere dont on choisis le role de l'utilisateur
  },
  saveUser() {
    cy.waitGet('#main-sliding-panel > div > div > div > div > div.footer-panel-buttons > div > div:nth-child(2) > button')
      .click();
  }
};
