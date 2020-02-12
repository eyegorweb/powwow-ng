import alarmsPage from '../../pageObjects/alarmsPage';

describe('Alarms', function() {
  it('search with a filter', function() {
    cy.viewport(1920, 937);
    cy.startAsBO();

    alarmsPage.init();

    alarmsPage.filterBar.partner.toggle();
    alarmsPage.filterBar.partner.filter('lyra');
    alarmsPage.filterBar.partner.choose(1);

    alarmsPage.filterBar.offer.toggle();
    alarmsPage.filterBar.offer.filter('Parc 2');
    alarmsPage.filterBar.offer.choose(1);

    alarmsPage.filterBar.apply();

    alarmsPage.getTotal(total => {
      expect(total).to.be.above(0);
    });
  });
});
