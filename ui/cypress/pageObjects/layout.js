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
        '#app > div.container > div.navbars.bg-white > div > div:nth-child(1) > div > ol > li:nth-child(2) > div > div > a.dropdown-item.menu_actHistory'
      ).click({ force: true });
    },
    userManagement: () => {
      cy.get(
        '#app > div.container > div.navbars.bg-white > div > div:nth-child(1) > div > ol > li:nth-child(5) > div > div > .menu_getAdminUsers'
      ).click({ force: true });
    },
    alarms: () => {
      cy.get('.menu_alarms').click({ force: true });
    },
  },
};
