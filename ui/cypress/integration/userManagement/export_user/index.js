import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import layout from '../../../pageObjects/layout';
import userPage from '../../../pageObjects/userSearchExport';

let myUserLogin = '';

Given(`je suis sur la page de gestion des utilisateurs`, () => {
  layout.menu.userManagement();
});

Given(`j'ouvre l'export des tables des utilisateurs`, () => {
  userPage.exportUser();
});

Then(`je télécharge le fichier`, () => {
  userPage.controlExportUsersFile();
});
