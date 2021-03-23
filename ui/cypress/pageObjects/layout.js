export default {
  menu: {
    getSim: () => {
      cy.startObservationGql();
      cy.waitGet('.flex-part > .tabs > .tabs-bar > .tab-label:nth-child(1) > a').click();
    },
    dashboard() {
      cy.startObservationGql();
      cy.waitGet(':nth-child(5) > .dropdown > div > a:nth-child(3)').click({ force: true });
    },
    report() {
      cy.startObservationGql();
      cy.waitGet(':nth-child(5) > .dropdown > div > a:nth-child(1)').click({ force: true });
    },
    lines: () => {
      cy.startObservationGql();

      cy.waitGet(
        '.tabs-bar > .tab-label:nth-child(2) > .dropdown > .dropdown-menu > .dropdown-item:nth-child(1)'
      ).click({ force: true });
    },
    massActions: () => {
      cy.startObservationGql();

      cy.waitGet(
        '#app > div.container > div.navbars.bg-white > div > div:nth-child(1) > div > ol > li:nth-child(2) > div > div > a.dropdown-item.menu_actHistory'
      ).click({ force: true });
    },
    userManagement: () => {
      cy.startObservationGql();

      cy.waitGet(
        '#app > div.container > div.navbars.bg-white > div > div:nth-child(1) > div > ol > li:nth-child(7) > div > div > a.dropdown-item.menu_getAdminUsers'
      ).click({ force: true });
    },
    alarms: () => {
      cy.startObservationGql();
      cy.waitGet('.menu_alarms').click({ force: true });
    },
    bills: () => {
      cy.waitGet('.menu_reportsBill').click();
    },
  },
  exportFile: {
    openChoice() {
      cy.get('.export-file-button').click({ force: true });
    },
    chooseFormat(format) {
      cy.get(`.export-${format}-format`).click({ force: true });
    },
    confirmExport() {
      cy.get('.btn-success').click();
    },
  },
};
