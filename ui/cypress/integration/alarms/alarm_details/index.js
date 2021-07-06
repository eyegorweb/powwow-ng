import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import get from 'lodash.get';

import layout from '../../../pageObjects/layout';
import alarmsPage from '../../../pageObjects/alarmsPage';
import alarmsDetailPage from '../../../pageObjects/alarmsDetailPage';
import createAlarmsPage from '../../../pageObjects/createAlarmsPage';

let idAlarm = '';

// Instructions communes à plusieurs tests

Given(`je suis sur la page de création d'alarmes`, () => {
  layout.menu.alarms();
  cy.wait(400);
});

Given(`je suis sur la page détail de l'alarme créée`, () => {
  alarmsPage.clickFirstId();
  alarmsPage.detailPanel.gotoDetail();

  cy.wait(500);
});

Given(`je choisis les alarmes {string}`, (tabToChoose) => {
  alarmsDetailPage.tabs.chooseTab(tabToChoose);
});

Given('je valide la création', () => {
  createAlarmsPage.saveAlarm();
  cy.wait(400);
});

When("je suis sur la page de détail de l'alarme créée", () => {
  getFirstId();
  alarmsPage.clickFirstId();
  alarmsPage.detailPanel.gotoDetail();

  cy.wait(500);
});

// filtre

Given('je filtre par compte de facturation {string}', (cf) => {
  alarmsDetailPage.excludedLines.filterBar.billingAccount.toggle();
  alarmsDetailPage.excludedLines.filterBar.billingAccount.filter(cf);
  alarmsDetailPage.excludedLines.filterBar.billingAccount.choose(1);
  alarmsDetailPage.excludedLines.filterBar.billingAccount.toggle();
});

When('je filtre par offre {string}', (offer) => {
  alarmsDetailPage.excludedLines.filterBar.offers.toggle();
  alarmsDetailPage.excludedLines.filterBar.offers.filter(offer);
  alarmsDetailPage.excludedLines.filterBar.offers.choose(1);
  alarmsDetailPage.excludedLines.filterBar.apply();
  cy.wait(500);
});

When('je filtre par motif de déclenchement {string}', (value) => {
  alarmsDetailPage.triggeringWithinAMonth.filterBar.triggerMotives.toggle();
  alarmsDetailPage.triggeringWithinAMonth.filterBar.triggerMotives.select(value);
  alarmsDetailPage.triggeringWithinAMonth.filterBar.apply();
  cy.wait(500);
});

Then('la table contient {string} résultats', (result) => {
  alarmsDetailPage.table.checkResult(result);
});

// Réactivation de l'alarme des lignes sélectionées

Given('je sélectionne la première lignes', () => {
  alarmsDetailPage.selectFirstLine();
});

When('je clique sur "Réactiver l\'alarme des lignes"', () => {
  alarmsDetailPage.clickReactivateLineAlarm();
});

Then('je peux confirmer la réactivation', () => {
  alarmsDetailPage.modal.confirm();
});

// export

When(`je lance un Export des lignes`, () => {
  cy.wait(500);
  alarmsDetailPage.exportFile.openChoice();
  alarmsDetailPage.exportFile.chooseFormat('csv');
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

// Je vérifie que la page de détail de l'alarme créée est correcte

Then("la page de détail correspong à l'alarme créée", () => {
  alarmsDetailPage.verifyUrl(idAlarm);
});

// Je peux naviguer entre les différents onglets de la page de détail de l'alarme créée

Then('je peux naviguer entre les différents onglets', () => {
  alarmsDetailPage.tabs.chooseTab('DÉCLENCHEMENTS DANS LE MOIS');
  alarmsDetailPage.triggeringWithinAMonth.isSelected();
  alarmsDetailPage.tabs.chooseTab("lignes ciblées par l'alarme");
  alarmsDetailPage.linesTargetedByTheAlarm.isSelected();
  alarmsDetailPage.tabs.chooseTab('lignes exclues');
  alarmsDetailPage.excludedLines.isSelected();
});

// fonctions

function getFirstId() {
  cy.waitGet('table > tbody > tr:first-child > td:first-child > div > button').then((e) => {
    const value = e.text().trim();
    idAlarm = value;
  });
}
