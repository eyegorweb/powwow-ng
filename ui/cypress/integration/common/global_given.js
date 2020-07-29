Given(`en tant que BO`, () => {
  cy.startAsBO();
});

Given(`en tant que partenaire {word}`, partnerName => {
  if (partnerName === 'lyra') {
    cy.testVars.userPartner = 'LYRA NETWORK';
    cy.startAsPartner();
  }
});
