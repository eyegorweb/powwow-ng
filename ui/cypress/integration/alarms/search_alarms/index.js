import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

import alarmsPage from '../../../pageObjects/alarmsPage';

Given(`je suis sur la page recherche d'alarmes`, () => {
  alarmsPage.init();

  cy.wait(500);
});

Given("je vais sur l'onglet alarmes mutualisées", () => {
  alarmsPage.sharedAlarms.goTo();
  cy.wait(400);
});

Given(`je choisis le filtre partenaire {string}`, (partnerName) => {
  alarmsPage.filterBar.partner.toggle();
  alarmsPage.filterBar.partner.filter(partnerName);
  alarmsPage.filterBar.partner.choose(1);
});

Given(`je choisis le filtre compte de facturation {string}`, (cf) => {
  alarmsPage.filterBar.billingAccount.toggle();
  alarmsPage.filterBar.billingAccount.filter(cf);
  alarmsPage.filterBar.billingAccount.choose(1);
});

Given(`je choisis le filtre offre {string}`, (offer) => {
  alarmsPage.filterBar.offer.toggle();
  alarmsPage.filterBar.offer.filter(offer);
  alarmsPage.filterBar.offer.choose(1);
});

Given(`je choisis le filtre portée de l'alarme {string}`, (alarmRange) => {
  alarmsPage.filterBar.alarmRange.toggle();
  alarmsPage.filterBar.alarmRange.filter(alarmRange);
  alarmsPage.filterBar.alarmRange.choose(1);
});

Given("je choisis le filtre type d'alarme {string}", (value) => {
  alarmsPage.filterBar.alarmType.toggle();
  alarmsPage.filterBar.alarmType.select(value);
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
