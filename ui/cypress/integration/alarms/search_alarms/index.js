import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

import alarmsPage from '../../../pageObjects/alarmsPage';

Given(`je suis sur la page recherche d'alarmes`, () => {
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
  alarmsPage.filterBar.alarmRange.choose(1);
});

When(`je lance la recherche par ID {string}`, id => {
  alarmsPage.idSearch.typeId(id);
  alarmsPage.idSearch.applySearch();
  cy.wait(500);
});

Then(`je ferme le pannel du filtre`, () => {
  alarmsPage.filterBar.close();
})

When(`je lance la recherche`, () => {
  alarmsPage.filterBar.apply();
  cy.wait(500);
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

//fonction ci dessous non utilisée, gardée pour une refact de waitGraphQL
Then(`la table contient les alarmes du partenaire`, () => {
  cy.wrap(null).then(() => {
    return cy.waitForGQL('alarms').then(response => {
      const alarms = get(response, 'data.alarms.items');
      const haveAlarmOfOtherPartners = !!alarms.find(a => a.party.name !== cy.testVars.userPartner);
      expect(haveAlarmOfOtherPartners).to.be.false;
    });
  });
});
