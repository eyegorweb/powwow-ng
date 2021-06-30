Given(`en tant que BO`, () => {
  cy.startAsBO();
});

Given(`en tant que partenaire {word}`, (partnerName) => {
  //token non fonctionnel, redirection vers page de login
  /*if (partnerName === 'lyra') {
    cy.testVars.userPartner = 'LYRA NETWORK';
    cy.startAsPartner();
  }*/
  cy.login('lyra', 'admin');
});

Given('en tant que compte groupe', () => {
  cy.startAsGroupAccount();
});
