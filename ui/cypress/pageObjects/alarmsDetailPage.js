import layout from './layout';

export default {
  exportFile: layout.exportFile,

  tabs: {
    chooseTab(labelToChoose) {
      cy.get('.tabs ol li a').each($el => {
        if (
          $el
            .text()
            .trim()
            .toLowerCase()
            .includes(labelToChoose.toLowerCase())
        ) {
          cy.wrap($el).click();
        }
      });
    },
  },
};
