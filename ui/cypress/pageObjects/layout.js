export default {
  menu: {
    getSim: () => {
      cy.get('.flex-part > .tabs > .tabs-bar > .tab-label:nth-child(1) > a').click();
    },
  },
};
