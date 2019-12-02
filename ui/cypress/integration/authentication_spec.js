context('Authentication', () => {
  it('Should authentify to app', () => {
    cy.login('richard', 'admin');
  });
});
