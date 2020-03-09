import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

import alarmsPage from '../../../pageObjects/alarmsPage';
import { waitForGQL } from '../../../utils/query';

Given(`je suis sur la page recherche d'alarmes`, () => {
  cy.server();
  cy.route('POST', '/api/graphql').as('gql-call');

  alarmsPage.init();

  cy.wait(500);
});

Given(`Je choisis le partenaire {string}`, partnerName => {
  alarmsPage.filterBar.partner.toggle();
  alarmsPage.filterBar.partner.filter(partnerName);
  alarmsPage.filterBar.partner.choose(1);
});

Given(`Je choisis le compte de facturation {string}`, cf => {
  alarmsPage.filterBar.billingAccount.toggle();
  alarmsPage.filterBar.billingAccount.filter(cf);
  alarmsPage.filterBar.billingAccount.choose(1);
});

Given(`Je choisis l'Offre {string}`, offer => {
  alarmsPage.filterBar.offer.toggle();
  alarmsPage.filterBar.offer.filter(offer);
  alarmsPage.filterBar.offer.choose(1);
});

When(`Je lance la recherche`, () => {
  alarmsPage.filterBar.apply();
});

Then(`La table contient le resultat de ma recherche`, () => {
  alarmsPage.getTotal(total => {
    expect(total).to.be.above(0);
  });
});

Then(`La table contient les alarmes du partenaire`, () => {
  waitForGQL('alarms', xhr => {
    const alarms = xhr.responseBody.data.alarms.items;
    const haveAlarmOfOtherPartners = !!alarms.find(a => a.party.name !== cy.testVars.userPartner);
    expect(haveAlarmOfOtherPartners).to.be.true;
  });
});
