import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import layout from '../../../pageObjects/layout';
import userCreationPage from '../../../pageObjects/userCreationPage';
import userPage from '../../../pageObjects/userPage'

let myUserLogin = '';

Given(`je suis sur la page de gestion des utilisateurs`, () => {
  layout.menu.userManagement();
});

Given(`je créé un nouvel utilisateur interne`, () => {
  userCreationPage.addUser();
});


Given(`je lui donne pour sexe {string}`, userSex => {
    userCreationPage.checkUserSex(userSex);
});

Given(`je lui donne pour prénom {string}`, userFirstName => {
  userCreationPage.fillUserFirstName(userFirstName);
});

Given(`je lui donne pour nom {string}`, userLastName => {
  userCreationPage.fillUserLastName(userLastName);
});

Given(`je lui donne pour email {string}`, email => {
  userCreationPage.fillUserEmail(email);
});

Given(`je lui donne pour login {string}`, userLogin => {
  myUserLogin = userLogin;
  userCreationPage.fillUserLogin(userLogin);
});

Given(`je lui donne pour mdp {string}`, password => {
  userCreationPage.fillUserPassword(password);
})


Given(`je lui donne pour rôle {string}`, userRole => {
  userCreationPage.chooseRole();
  // changer la maniere dont on selectionne le role
});


Given(`j'enregistre la création de l'utilisateur`, () => {
  userCreationPage.saveUser();
});

When(`je recherche le login de mon utilisateur`, () => {
  userPage.searchUserByLogin(myUserLogin);
});

Then(`la table contient {int} resultat`, nbrResult => {
  userPage.getTotal(total => {
    expect(total).to.equal(nbrResult);
  });
});
