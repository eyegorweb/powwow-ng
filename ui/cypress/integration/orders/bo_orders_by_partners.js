import orderPage from '../../pageObjects/orderPage';

describe('Orders', function() {
  it('search with a filter', function() {
    cy.viewport(1920, 937);
    cy.startAsBO();

    orderPage.init();
    orderPage.filterBar.partner.toggle();
    orderPage.filterBar.partner.choose(2);
    orderPage.filterBar.partner.chosenItems().should('have.length', 1);
    orderPage.filterBar.apply();
    orderPage.getTotal(total => {
      expect(total).to.be.above(0);
    });
  });
});
