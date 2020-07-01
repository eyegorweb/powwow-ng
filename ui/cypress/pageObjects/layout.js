export default {
  menu: {
    getSim: () => {
      cy.get('.flex-part > .tabs > .tabs-bar > .tab-label:nth-child(1) > a').click();
    },

    lines: () => {
      cy.get(
        '.tabs-bar > .tab-label:nth-child(2) > .dropdown > .dropdown-menu > .dropdown-item:nth-child(1)'
      ).click({ force: true });
    },

    massActions: () => {
      cy.get(
        '.tabs-bar > .tab-label > .dropdown > .dropdown-menu > .dropdown-item:nth-child(2)'
      ).click({ force: true });
    },

    alarms: () => {
      // cy.get('.tabs > .tabs-bar > .tab-label:nth-child(3)').trigger('mouseover');

      cy.get(
        '.menu_alarms'
      ).click({ force: true });
    },
  },
};
