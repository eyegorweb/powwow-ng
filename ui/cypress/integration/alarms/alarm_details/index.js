import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import get from 'lodash.get';

import alarmsPage from '../../../pageObjects/alarmsPage';
import alarmDetailPage from '../../../pageObjects/alarmsDetailPage';

Given(`je suis sur la page détail de l'alarme {int}`, (id) => {
  alarmsPage.init();
  alarmsPage.openDetailPanel(id);
  alarmsPage.detailPanel.gotoDetail();

  cy.wait(500);
});

Given(`je choisis les alarmes {string}`, (tabToChoose) => {
  alarmDetailPage.tabs.chooseTab(tabToChoose);
});

When(`je lance un Export des lignes`, () => {
  cy.wait(500);
  alarmDetailPage.exportFile.openChoice();
  alarmDetailPage.exportFile.chooseFormat('csv');
});
Then(`l'export des déclenchemets dans le mois est bien téléchargé`, () => {
  cy.wait(500);
  cy.wrap(null).then(() => {
    return cy.waitUntiGQLIsSent('alarmsWithTriggersExport').then((http) => {
      const downloadUri = get(http.response, 'body.data.alarmsWithTriggersExport.downloadUri');
      expect(downloadUri).to.not.be.undefined;
    });
  });
});

Then(`l'export des lignes ciblées est bien téléchargé`, () => {
  cy.wait(500);
  cy.wrap(null).then(() => {
    return cy.waitUntiGQLIsSent('linesBoundToAlarmExport').then((http) => {
      const downloadUri = get(http.response, 'body.data.linesBoundToAlarmExport.downloadUri');
      expect(downloadUri).to.not.be.undefined;
    });
  });
});

Then(`l'export des lignes exclues est bien téléchargé`, () => {
  cy.wait(500);
  cy.wrap(null).then(() => {
    return cy.waitUntiGQLIsSent('linesBoundToAlarmExport').then((http) => {
      const downloadUri = get(http.response, 'body.data.linesBoundToAlarmExport.downloadUri');
      expect(downloadUri).to.not.be.undefined;
    });
  });
});
