import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import layout from '../../../pageObjects/layout';
import userCreationPage from '../../../pageObjects/userCreationPage';
import userPage from '../../../pageObjects/userPage';

let nbrUsers = 0;
let firstname = '';

// Instructions communes

Given('Je suis sur la page de gestion des utilisateurs', () => {
  layout.menu.userManagement();
  cy.wait(400);
});

Given('Je rentre le prénom {string}', (firstname) => {
  userCreationPage.typeFirstname(firstname);
});

When("J'enregistre l'utilisateur", () => {
  userCreationPage.save();
  cy.wait(400);
});

// Création utilisateur

Given('Je clique sur "Ajouter un utilisateur"', () => {
  getTotal();
  userPage.addUser();
});

Given("Je choisis le type d'utilisateur {string}", (index) => {
  userCreationPage.selectUserType(index);
});

Given('Je choisis le genre {string}', (index) => {
  userCreationPage.selectGender(index);
});

Given('Je sélectionne le language {string}', (langage) => {
  userCreationPage.selectLanguage(langage);
});

Given('Je sélectionne le partenaire {string}', (partner) => {
  userCreationPage.typePartner(partner);
});

Given('Je sélectionne le groupe de partenaire {string}', (partnerGroup) => {
  userCreationPage.typePartnerGroup(partnerGroup);
});

Given('Je rentre le nom {string}', (lastname) => {
  userCreationPage.typeLastname(lastname);
});

Given("Je rentre l'email {string}", (email) => {
  userCreationPage.typeEmail(email);
});

Given('Je rentre le login {string}', (login) => {
  userCreationPage.typeLogin(login);
});

Given('Je rentre le mot de passe {string}', (password) => {
  userCreationPage.typePassword(password);
});

Given('Je sélectionne le rôle {string}', (index) => {
  userCreationPage.checkRole(index);
});

Then('Je vérifie la création du nouvel utilisateur', () => {
  userPage.verifyUserCreation(nbrUsers);
});

// Modification utilisateur

Given("Je recherche l'utilisateur {string}", (userLogin) => {
  userPage.searchUserByLogin(userLogin);
});

Given('Je clique sur le bouton "Modifier"', () => {
  userPage.clickModifyButton();
});

Given('Je récupère le prénom', () => {
  getFirstname();
});

When("Je recherche l'utilisateur {string}", (userLogin) => {
  userPage.searchUserByLogin(userLogin);
});

Then("Je vérifie la modification de l'utilisateur", () => {
  userPage.verifyUserModification(firstname);
});

// Fonctions

function getTotal() {
  cy.waitGet('.mb-3 > :nth-child(1) > .text-gray').then((e) => {
    const parts = e
      .text()
      .trim()
      .split(' ');
    const value = parseInt(parts[0]);
    nbrUsers = value;
  });
}

function getFirstname() {
  cy.waitGet('table > tbody > tr:first-child > td:nth-child(4) > div > div').then((e) => {
    const parts = e
      .text()
      .trim()
      .split();
    const value = parts[0];
    firstname = value;
  });
}
