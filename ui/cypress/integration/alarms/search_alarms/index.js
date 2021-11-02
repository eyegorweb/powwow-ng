import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

import alarmsPage from '../../../pageObjects/alarmsPage';
import createAlarmsPage from '../../../pageObjects/createAlarmsPage';

Given(`je valide la création`, () => {
  createAlarmsPage.saveAlarm();
  cy.wait(400);
});

When(`je lance la recherche par ID {string}`, (id) => {
  alarmsPage.idSearch.typeId(id);
  alarmsPage.idSearch.applySearch();
  cy.wait(500);
});

Then(`je ferme le pannel du filtre`, () => {
  alarmsPage.filterBar.close();
});

When(`je lance la recherche`, () => {
  alarmsPage.filterBar.apply();
  cy.wait(500);
});

Then(`la table contient {int} resultat`, (nbrResult) => {
  cy.waitGet('.mb-3 > :nth-child(1) > .text-gray').then((e) => {
    const parts = e
      .text()
      .trim()
      .split(' ');
    const value = parseInt(parts[0]);
    expect(value).to.be.equal(nbrResult);
  });
});

Then(`la table contient plus de {int} resultat`, (nbrResult) => {
  cy.waitGet('.mb-3 > :nth-child(1) > .text-gray').then((e) => {
    const parts = e
      .text()
      .trim()
      .split(' ');
    const value = parseInt(parts[0]);
    expect(value).to.be.above(nbrResult);
  });
});

Then('Je supprime les filtres', () => {
  alarmsPage.filterBar.deleteFilter();
});

//fonction ci dessous non utilisée, gardée pour une refact de waitGraphQL
Then(`la table contient les alarmes du partenaire`, () => {
  cy.wrap(null).then(() => {
    return cy.waitForGQL('alarms').then((response) => {
      const alarms = get(response, 'data.alarms.items');
      const haveAlarmOfOtherPartners = !!alarms.find(
        (a) => a.party.name !== cy.testVars.userPartner
      );
      expect(haveAlarmOfOtherPartners).to.be.false;
    });
  });
});
