export default {
  selectUserType(index) {
    cy.waitGet('.user-types > div.item > button:nth-child(' + index + ')').click({ force: true });
  },
  selectGender(index) {
    cy.waitGet('.gender > label:nth-child(' + index + ') > span').click();
  },
  selectLanguage(value) {
    cy.waitGet('.language > div > div > select').select(value);
  },
  typePartner(partner) {
    cy.waitGet('.partner > fieldset > input').type(partner);
    cy.wait(400);
    cy.waitGet('.autocomplete-result:first-child').click();
  },
  typePartnerGroup(partnerGroup) {
    cy.waitGet('.partner-group > fieldset > input').type(partnerGroup);
    cy.wait(400);
    cy.waitGet('.autocomplete-result:first-child').click({ force: true });
  },
  typeFirstname(firstname) {
    cy.waitGet('.firstname > input')
      .clear()
      .type(firstname);
  },
  typeLastname(lastname) {
    cy.waitGet('.lastname > input')
      .clear({ force: true })
      .type(lastname);
  },
  typeEmail(email) {
    cy.waitGet('.email > input')
      .clear()
      .type(email);
  },
  typeLogin(login) {
    cy.waitGet('.login > input')
      .clear()
      .type(login);
  },
  typePassword(password) {
    cy.waitGet('.password > input').type(password);
    cy.waitGet('.password-confirm > input').type(password);
  },
  checkRole(index) {
    cy.waitGet('.roles > div.checkboxes > div:nth-child(' + index + ') > label > span').click();
  },
  save() {
    cy.waitGet('.footer-panel-buttons > div > div:last-child > button').click();
  },
};
