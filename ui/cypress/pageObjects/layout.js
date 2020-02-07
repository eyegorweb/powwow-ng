export default {
  menu: {
    getSim: () => {
      cy.get('.flex-part > .tabs > .tabs-bar > .tab-label:nth-child(1) > a').click();
    },

    alarms: () => {
      // cy.get('.tabs > .tabs-bar > .tab-label:nth-child(3)').trigger('mouseover');

      cy.get(
        '.tabs-bar > .tab-label:nth-child(3) > .dropdown > .dropdown-menu > .dropdown-item'
      ).click({ force: true });
    },
  },
};
