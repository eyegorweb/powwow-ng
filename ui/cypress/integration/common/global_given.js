Given(`En tant que BO`, () => {
  cy.startAsBO();
});

Given(`En tant que partenaire {word}`, partnerName => {
  if (partnerName === 'lyra') {
    cy.testVars.userPartner = 'LYRA NETWORK';
    cy.startAsPartner();
  }
});
