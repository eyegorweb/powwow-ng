import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

import alarmsPage from '../../../pageObjects/alarmsPage';
import { waitForGQL } from '../../../utils/query';

Given(`je suis sur la page recherche d'alarmes`, () => {
  cy.server();
  cy.route('POST', '/api/graphql').as('gql-call');

  alarmsPage.init();

  cy.wait(500);
});

Given(`je choisis le filtre partenaire {string}`, partnerName => {
  alarmsPage.filterBar.partner.toggle();
  alarmsPage.filterBar.partner.filter(partnerName);
  alarmsPage.filterBar.partner.choose(1);
});

Given(`je choisis le filtre compte de facturation {string}`, cf => {
  alarmsPage.filterBar.billingAccount.toggle();
  alarmsPage.filterBar.billingAccount.filter(cf);
  alarmsPage.filterBar.billingAccount.choose(1);
});

Given(`je choisis le filtre offre {string}`, offer => {
  alarmsPage.filterBar.offer.toggle();
  alarmsPage.filterBar.offer.filter(offer);
  alarmsPage.filterBar.offer.choose(1);
});

Given(`je choisis le filtre portée de l'alarme {string}`, alarmRange => {
  alarmsPage.filterBar.alarmRange.toggle();
  alarmsPage.filterBar.alarmRange.filter(alarmRange);
  alarmsPage.filterBar.alarmRange.choose(1)
});

When(`je lance la recherche par ID {string}`, id => {
  alarmsPage.idSearch.typeId(id);
  alarmsPage.idSearch.applySearch();
});

When(`je lance la recherche`, () => {
  alarmsPage.filterBar.apply();
});

Then(`la table contient {int} resultat`, nbrResult => {
  alarmsPage.getTotal(total => {
    expect(total).to.be.equal(nbrResult);
  });
});

Then(`la table contient plus de {int} resultat`, nbrResult => {
  alarmsPage.getTotal(total => {
    expect(total).to.be.above(nbrResult);
  });
});

Then(`la table contient moins de {int} resultat`, nbrResult => {
  alarmsPage.getTotal(total => {
    expect(total).to.be.below(nbrResult);
  });
});

Then(`la table contient les alarmes du partenaire`, () => {
  waitForGQL('alarms', xhr => {
    const alarms = xhr.responseBody.data.alarms.items;
    console.log('alarms >> ', alarms);
    const haveAlarmOfOtherPartners = !!alarms.find(a => a.party.name !== cy.testVars.userPartner);
    expect(haveAlarmOfOtherPartners).to.be.false;
  });
});
