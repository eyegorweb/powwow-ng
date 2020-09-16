import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import layout from '../../../pageObjects/layout';
import homePage from '../../../pageObjects/homePage';

Given(`j'ouvre le volet de personnalisation`, () => {
  homePage.openHomeCustomizer();
});

Given(`je décoche le premier élément`, () => {
  homePage.uncheckElement();
});

Given(`j'applique les changements`, () => {
  homePage.apply();
});

When(`je recharge la page`, () => {
  homePage.refresh();
});

Then(`les changements doivent être sauvegardés`, () => {
  homePage.openHomeCustomizer();
  homePage.getCheckboxes(checkboxes => {
      expect(checkboxes[0].className).to.not.include('activate');
    });
});
