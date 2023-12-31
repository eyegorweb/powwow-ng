export default {
  selectUserType(index) {
    cy.waitGet('.user-types > div.item > button:nth-child(' + index + ')').click({ force: true });
  },
  selectGender(index) {
    cy.waitGet('.gender > label:nth-child(' + index + ') > span').click({ force: true });
  },
  selectLanguage(value) {
    cy.waitGet('.language > div > div > select').select(value);
  },
  typePartner(partner) {
    cy.waitGet('.partner > fieldset > input').type(partner);
    cy.wait(400);
    cy.waitGet('.autocomplete-result:first-child').click({ force: true });
  },
  typePartnerGroup(partnerGroup) {
    cy.waitGet('.partner-group > fieldset > input').type(partnerGroup);
    cy.wait(400);
    cy.waitGet('.autocomplete-result:first-child').click({ force: true });
  },
  typeFirstname(firstname) {
    cy.waitGet('.firstname > input')
      .clear()
      .type(firstname, { force: true });
  },
  typeLastname(lastname) {
    cy.waitGet('.lastname > input')
      .clear({ force: true })
      .type(lastname, { force: true });
  },
  typeEmail(email) {
    cy.waitGet('.email > input')
      .clear()
      .type(email, { force: true });
  },
  typeLogin(login) {
    cy.waitGet('.login > input')
      .clear()
      .type(login, { force: true });
  },
  typePassword(password) {
    cy.waitGet('.password > input').type(password), { force: true };
    cy.waitGet('.password-confirm > input').type(password, { force: true });
  },
  checkRole(index) {
    cy.waitGet('.roles > div.checkboxes > div:nth-child(' + index + ') > label > span').click({
      force: true,
    });
  },
  save() {
    cy.waitGet('.footer-panel-buttons > div > div:last-child > button').click({ force: true });
  },
};
