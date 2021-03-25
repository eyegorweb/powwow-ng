import get from 'lodash.get';

export default {
  exportUser() {
    cy.get('.export-link')
      .click()
      .wait(100)
      .get('.export-button span')
      .first()
      .click();
  },

  controlExportUsersFile() {
    cy.wait(500);
    cy.wrap(null).then(() => {
      return cy.waitUntiGQLIsSent('exportUsers').then(http => {
        const downloadUri = get(http.response, 'body.data.exportUsers.downloadUri');
        expect(downloadUri).to.not.be.undefined;
      });
    });
  },
};
