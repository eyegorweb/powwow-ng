import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import createActionsPage from '../../../pageObjects/createActionsPage';
import layout from '../../../pageObjects/layout';
import get from 'lodash.get';
import moment from 'moment';

let totalMassAction = 0;
let typeMassAction = '';

Given(`je suis sur la page de création d'actes de gestion`, () => {
  layout.menu.lines();
});

Given(`je regarde le nombre d'actes de gestions`, () => {
  layout.menu.massActions(true);

  cy.wrap(null).then(() => {
    return cy.waitForGQL('massActionsV2').then((response) => {
      totalMassAction = get(response, 'body.data.massActionsV2.total');
    });
  });
});

Given(`je choisis l'acte de suspension par défaut`, () => {
  typeMassAction = 'Suspension';
  createActionsPage.actionsPannel.suspend();
  createActionsPage.chooseMassPrerequisites();
  createActionsPage.actions.suspend.selectPartner('Lyra');
  createActionsPage.actions.suspend.apply();
});

Given(`je choisis l'acte d'activation par défaut`, () => {
  typeMassAction = 'Pré-activation et Activation';
  createActionsPage.actionsPannel.activate();
  createActionsPage.actions.activate.inMass();
  createActionsPage.actions.activate.selectPartner('Lyra');
  createActionsPage.actions.activate.selectBillingAccount('6.42661 - LYRA');
  createActionsPage.actions.activate.apply();
  createActionsPage.actions.activate.activation();
  createActionsPage.actions.activate.selectOffre('Parc 2 forfait');
  createActionsPage.actions.activate.validate();
});

Given(`je choisis l'acte de changement de CF par défaut`, () => {
  typeMassAction = 'Changement du compte de fac ...';
  createActionsPage.actionsPannel.nextSlider();
  createActionsPage.actionsPannel.changeBillingAccount();
  createActionsPage.actions.changeBillingAccount.selectPartner('Lyra');
  createActionsPage.actions.changeBillingAccount.selectBillingAccount('6.42661 - LYRA');
  createActionsPage.actions.changeBillingAccount.selectoffer('Parc 2 forfait');
  createActionsPage.actions.changeBillingAccount.apply();

  createActionsPage.actions.changeBillingAccount.selectNewBillingAccount('6.42662');
  createActionsPage.actions.changeBillingAccount.validate();
});

Given(`je choisis l'acte de modification des champs libres par défaut`, () => {
  typeMassAction = 'Changement des champs custom';
  createActionsPage.actionsPannel.editFreeFields();
  createActionsPage.actions.editFreeFields.inMass();
  createActionsPage.filters.massByPartner('INGENICO');
  createActionsPage.actions.editFreeFields.fillFirstFreeField('first field');
  createActionsPage.actions.editFreeFields.fillSecondFreeField('second field');
  createActionsPage.actions.editFreeFields.validate();
});

Given(`je choisis l'acte de modification de services`, () => {
  typeMassAction = 'Changement de services';
  createActionsPage.actionsPannel.editServices();
  createActionsPage.actions.editServices.selectPartner('lyra');
  createActionsPage.actions.editServices.selectOffer('parc 2 forfait');
  createActionsPage.actions.editServices.apply();
  createActionsPage.actions.editServices.desactivateService();
  createActionsPage.actions.editServices.validate();
});

const gotoResiliationAct = () => {
  typeMassAction = 'Gérer des résiliations';
  createActionsPage.actionsPannel.nextSlider();
  cy.wait(200);
  createActionsPage.actionsPannel.manageCancellation();
  createActionsPage.actions.editFreeFields.inMass();
  createActionsPage.filters.massByPartner('lyra');
};
Given(`je choisis l'acte de gestion de résiliation`, () => {
  gotoResiliationAct();
});

When('Je créé la validation avec un délai de 3 mois', () => {
  createActionsPage.actions.activate.selectSecondLine();
  createActionsPage.actions.manageCancellation.chooseDelay('3');
  createActionsPage.actions.manageCancellation.createAct();
});

Then('Je valide que la due date est à la date du jour + 3 mois', () => {
  layout.menu.massActions();
  cy.wrap(null).then(() => {
    return cy.waitForGQL('massActionsV2').then((response) => {
      const lastItem = get(response, 'body.data.massActionsV2.items[0]');
      const dueDateStr = lastItem.massAction.dueDate;
      const dueDateMonth = parseInt(dueDateStr.split(' ')[0].split('/')[1]);
      const diffInMonths = dueDateMonth - parseInt(moment().format('MM'), 10);
      expect(diffInMonths).to.equal(3);
    });
  });
});

When(`je confirme la création de l'acte`, () => {
  createActionsPage.confirm(typeMassAction);
  cy.get('.modal-wrapper', { timeout: 10000 }).should('not.exist');
});

When('je refuse les résiliations', () => {
  createActionsPage.actions.activate.selectFifthLine();
  createActionsPage.actions.manageCancellation.chooseDelay('3');
  createActionsPage.actions.manageCancellation.refuseCancellation();
});

Then('un acte de refus de résiliation est bien créé', () => {
  layout.menu.massActions();
  cy.wrap(null).then(() => {
    return cy.waitForGQL('massActionsV2').then((response) => {
      const actionType = get(response, 'body.data.massActionsV2.items[0].massAction.actionType');
      expect(actionType).to.equal('STATUS_CHANGE');
    });
  });
});

Then(`je verifie que mon acte a été créé`, () => {
  layout.menu.massActions();

  cy.wrap(null).then(() => {
    return cy.waitForGQL('massActionsV2').then((response) => {
      const newTotal = get(response, 'body.data.massActionsV2.total');

      expect(newTotal).to.be.equal(totalMassAction);

      createActionsPage.clickScheduledActs();
      cy.wait(1000);
      createActionsPage.getLastActionType().should('have.text', typeMassAction);
    });
  });
});
