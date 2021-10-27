import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import userPage from '../../../pageObjects/userSearchExport';

Given(`j'ouvre l'export des tables des utilisateurs`, () => {
  userPage.exportUser();
});

Then(`je télécharge le fichier`, () => {
  userPage.controlExportUsersFile();
});
