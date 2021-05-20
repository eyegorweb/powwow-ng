import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import get from 'lodash.get';
import massActionsPage from '../../../pageObjects/massActionsPage';
import unitActionPage from '../../../pageObjects/unitAction';

Given(`je suis sur le détail de l'acte de gestion avec l'id {int}`, (id) => {
  massActionsPage.init();
  massActionsPage.openDetailPanel(id);
  massActionsPage.detailPanel.gotoDetail();
});

When(`je lance un Export de l'acte de gestion`, () => {
  unitActionPage.exportFile.openChoice();
  unitActionPage.exportFile.chooseFormat('csv');
});

Then(`le fichier est bien téléchargé`, () => {
  cy.wait(500);
  cy.wrap(null).then(() => {
    return cy.waitUntiGQLIsSent('massActionExport').then((http) => {
      console.log('🚀 ~ file: index.js ~ line 21 ~ returncy.waitUntiGQLIsSent ~ http', http);
      const downloadUri = get(http.response, 'body.data.massActionExport.downloadUri');

      expect(downloadUri).to.not.be.undefined;
    });
  });
});
