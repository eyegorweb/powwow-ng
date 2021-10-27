import get from 'lodash.get';

export default {
  export: {
    historyConsoExport() {
      cy.wait(500)
        .get('.cy-export-history-conso button')
        .click({ force: true })
        .wait(100)
        .get('.export-button span')
        .first()
        .click({ force: true });
    },

    parcStateExport() {
      cy.wait(500)
        .get('.cy-export-parcState button')
        .click({ force: true })
        .wait(100)
        .get('.export-button span')
        .first()
        .click({ force: true });
    },

    controlExportFile() {
      cy.wait(500);
      cy.wrap(null).then(() => {
        return cy.waitUntiGQLIsSent('consumtionHistoyExport').then((http) => {
          const downloadUri = get(http.response, 'body.data.consumtionHistoyExport.downloadUri');
          expect(downloadUri).to.not.be.undefined;
        });
      });
    },
  },
};
