import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import partnerPage from '../../../pageObjects/partnerPage';
import partnerDetailPage from '../../../pageObjects/partnerDetailPage';

/* Instructions utilisees par plusieurs tests */

Given('Je suis sur la page de gestion des partenaires', () => {
  partnerPage.init();
  cy.wait(400); // changer a 400, 2000 ou 3000 uniquement pour connexion lente et chargement long de la page
});

Given('Je vais sur la page de detail du partenaire LYRA', () => {
  partnerPage.init();
  cy.wait(400); // changer a 400, 2000 ou 3000 uniquement pour connexion lente et chargement long de la page
  partnerDetailPage.goToPartnerDetail();
});

Given('Je clique sur le bouton "Enregistrer"', () => {
  partnerDetailPage.panel.save();
});

Given("Le panneau s'ouvre et est visible", () => {
  partnerDetailPage.panel.isVisible();
});

Given('Je ferme le panneau', () => {
  partnerDetailPage.panel.closePanel();
});

When('Je clique sur le bouton "Enregistrer"', () => {
  partnerDetailPage.panel.save();
});

Then("Le panneau s'ouvre et est visible", () => {
  partnerDetailPage.panel.isVisible();
});

/* Navigation */

Given('Je vais sur l\'onglet "Gestionnaire des utilisateurs"', () => {
  partnerDetailPage.tabs.userManagement.goTo();
});

Given('Je vais sur l\'onglet "Personnalisation"', () => {
  partnerDetailPage.tabs.customization.goTo();
});

Given('Je vais sur l\'onglet "Comptes de facturation"', () => {
  partnerDetailPage.tabs.billingAccount.goTo();
});

Given('Je vais sur l\'onglet "Offres et cartes SIM"', () => {
  partnerDetailPage.tabs.offersAndSimCards.goTo();
});

Given('Je vais sur l\'onglet "Detail du compte"', () => {
  partnerDetailPage.tabs.accountDetails.goTo();
});

Given('Je vais dans la section "Administrateurs"', () => {
  partnerDetailPage.tabs.userManagement.administrators.goTo();
});

Given('Je vais dans la section "Utilisateurs"', () => {
  partnerDetailPage.tabs.userManagement.users.goTo();
});

Given('Je vais dans la section "Listes de diffusion"', () => {
  partnerDetailPage.tabs.customization.mailingList.goTo();
});

Given('Je vais dans la section "Adresses de livraison"', () => {
  partnerDetailPage.tabs.customization.deliveryAddresses.goTo();
});

Given('Je vais dans la section "Champs libres"', () => {
  partnerDetailPage.tabs.customization.customFields.goTo();
});

Given('Je vais dans la section "Champs specifiques"', () => {
  partnerDetailPage.tabs.customization.specificFields.goTo();
});

Given('Je vais dans la section "Cartes SIM"', () => {
  partnerDetailPage.tabs.offersAndSimCards.simCards.goTo();
});

Given('Je vais dans la section "Offres"', () => {
  partnerDetailPage.tabs.offersAndSimCards.offers.goTo();
});

Given('Je vais dans la section "Options du partenaire"', () => {
  partnerDetailPage.tabs.accountDetails.partnerOptions.goTo();
});

/* Je peux naviguer entre tous les differents onglets de la page de detail d'un partenaire */

When('Je vais sur la page de detail du partenaire LYRA', () => {
  partnerDetailPage.goToPartnerDetail();
});

Then('Je peux naviguer entre tous les differents onglets', () => {
  partnerDetailPage.tabs.userManagement.goTo();
  partnerDetailPage.tabs.userManagement.administrators.goTo();
  partnerDetailPage.tabs.userManagement.users.goTo();
  partnerDetailPage.tabs.customization.goTo();
  partnerDetailPage.tabs.customization.mailingList.goTo();
  partnerDetailPage.tabs.customization.deliveryAddresses.goTo();
  partnerDetailPage.tabs.customization.customFields.goTo();
  partnerDetailPage.tabs.customization.specificFields.goTo();
  partnerDetailPage.tabs.billingAccount.goTo();
  partnerDetailPage.tabs.offersAndSimCards.goTo();
  partnerDetailPage.tabs.offersAndSimCards.offers.goTo();
  partnerDetailPage.tabs.offersAndSimCards.simCards.goTo();
  partnerDetailPage.tabs.accountDetails.goTo();
  partnerDetailPage.tabs.accountDetails.descriptionOfPartnerAccount.goTo();
  partnerDetailPage.tabs.accountDetails.partnerOptions.goTo();
});

/* Je peux modifier le prenom d'un administrateur, onglet "Gestion des utilisateurs", section "Administrateurs" */

Given('Je clique sur le bouton "Modifier" du premier administrateur', () => {
  partnerDetailPage.tabs.userManagement.administrators.clickEditButton();
  partnerDetailPage.panel.isVisible();
});

When("Je modifie le prenom actuel de l'administrateur par {string}", (newFirstname) => {
  partnerDetailPage.tabs.userManagement.administrators.edit.firstname(newFirstname);
});

Then("Le prenom de l'administrateur a bien ete modifie par {string}", (newFirstname) => {
  partnerDetailPage.tabs.userManagement.administrators.verifyName(newFirstname);
});

/* Je peux modifier le prenom d'un utilisateur, onglet "Gestion des utilisateurs", section "Utilisateurs" */

Given('Je clique sur le bouton "Modifier" du premier utilisateur', () => {
  partnerDetailPage.tabs.userManagement.users.clickEditButton();
});

When("Je modifie le prenom actuel de l'utilisateur par {string}", (newFirstname) => {
  partnerDetailPage.tabs.userManagement.users.edit.firstname(newFirstname);
});

Then("Le prenom de l'utilisateur a bien ete modifie par {string}", (newFirstname) => {
  partnerDetailPage.tabs.userManagement.users.verifyName(newFirstname);
});

/* Le panneau s'ouvre lorsque je clique sur le bouton "Ajouter un utilisateur", onglet "Gestion des utilisateurs",
section "Utilisateurs" */

When('Je clique sur bouton "Ajouter un utilisateur"', () => {
  partnerDetailPage.tabs.userManagement.users.clickAddNewUserButton();
});

/* Je cree un nouvelle liste de diffusion puis modifie le nom et ajoute une nouvelle adresse mail à cette liste
puis la supprime, onglet "Personnalisation", section "Listes de diffusion" */

Given('Je clique sur le bouton "Ajouter une liste de diffusion"', () => {
  partnerDetailPage.tabs.customization.mailingList.clickAddNewListButton();
});

Given('Je rentre le nom {string} à la liste de diffusion', (name) => {
  partnerDetailPage.tabs.customization.mailingList.edit.name(name);
});

Given("J'ajoute l'adresse mail {string} à la liste de diffusion", (email) => {
  partnerDetailPage.tabs.customization.mailingList.edit.email(email);
});

Given(
  'Je verifie la liste de diffusion avec le nom {string} et les adresses mail {string}',
  (name, email) => {
    partnerDetailPage.tabs.customization.mailingList.verifyList(name, email);
  }
);

Given('Je clique sur le bouton "Modifier" de cette nouvelle liste de diffusion', () => {
  partnerDetailPage.tabs.customization.mailingList.clickEditButton();
});

When('Je clique sur le bouton "Supprimer" de cette liste de diffusion', () => {
  partnerDetailPage.tabs.customization.mailingList.clickDeleteButton();
});

When('Je confirme la suppression de la liste de diffusion', () => {
  partnerDetailPage.tabs.customization.mailingList.confirmDelete();
});

Then("La liste de diffusion {string} n'existe plus", (name) => {
  partnerDetailPage.tabs.customization.mailingList.listDontExist(name);
});

/* Je cree une nouvelle adresse de livraison, onglet "Personnalisation", section "Adresses de livraison" */

Given('Je clique sur le bouton "Ajouter une adresse de livraison"', () => {
  partnerDetailPage.tabs.customization.deliveryAddresses.clickAddNewDeliveryAddress();
});

Given("Je rentre les informations necessaire a la creation d'une adresse de livraison", () => {
  partnerDetailPage.tabs.customization.deliveryAddresses.edit.mister();
  partnerDetailPage.tabs.customization.deliveryAddresses.edit.name('Name');
  partnerDetailPage.tabs.customization.deliveryAddresses.edit.firstname('Firstname');
  partnerDetailPage.tabs.customization.deliveryAddresses.edit.phone('0648526578');
  partnerDetailPage.tabs.customization.deliveryAddresses.edit.email('name.firstname@lyra.fr');
  partnerDetailPage.tabs.customization.deliveryAddresses.edit.company('LYRA');
  partnerDetailPage.tabs.customization.deliveryAddresses.edit.address('32 rue de Je sais pas qui');
  partnerDetailPage.tabs.customization.deliveryAddresses.edit.postalCode('75000');
  partnerDetailPage.tabs.customization.deliveryAddresses.edit.city('Paris');
  partnerDetailPage.tabs.customization.deliveryAddresses.edit.country('France');
});

When('Je clique sur le bouton "Enregistrer" Adresses de livraison', () => {
  partnerDetailPage.tabs.customization.deliveryAddresses.save();
});

Then("L'adresse de livraison a correctement ete cree", () => {
  partnerDetailPage.tabs.customization.deliveryAddresses.verifyCreationNewDeliveryAddress();
});

/* Instructions fonctionnant pour les deux types de champ */

Given('Je clique sur le bouton "Ajouter"', () => {
  partnerDetailPage.tabs.customization.fields.clickAddNewButton();
});

Given('Je clique sur le bouton "Modifier" de ce nouveau champ', () => {
  partnerDetailPage.tabs.customization.fields.clickEditButtonLastChild();
});

Given('Je rentre le titre {string}', (title) => {
  partnerDetailPage.tabs.customization.fields.edit.title(title);
});

Given('Je choisis le type "Texte"', () => {
  partnerDetailPage.tabs.customization.fields.edit.typeText();
});

Given("J'indique que le champ est obligatoire a l'activation", () => {
  partnerDetailPage.tabs.customization.fields.edit.mandatoryOnActivation();
});

Given("J'enregistre", () => {
  partnerDetailPage.tabs.customization.fields.edit.save();
});

When('Je clique sur le bouton "Modifier" de ce nouveau champ', () => {
  partnerDetailPage.tabs.customization.fields.clickEditButtonLastChild();
});

/* Je cree un nouveau champ libre puis le modifie, onglet "Personnalisation, section "Champs libres" */

Given('Je verifie la creation du nouveau champ libre {string}', (title) => {
  partnerDetailPage.tabs.customization.customFields.verifyNewCustomFieldTitle(title);
});

When('Je clique sur le bouton "Mettre a jour"', () => {
  partnerDetailPage.tabs.customization.fields.edit.save();
});

Then('Je verifie la modification du champ libre a {string}', (title) => {
  partnerDetailPage.tabs.customization.customFields.verifyNewCustomFieldTitle(title);
});

/* Je peux modifier un compte de facturation, onglet "Comptes de facturation" */

Given('Je clique sur le code de la premiere ligne', () => {
  partnerDetailPage.tabs.billingAccount.clickCodeFirstLine();
});

Given('Je modifie le libelle a {string}', (label) => {
  partnerDetailPage.tabs.billingAccount.edit.label(label);
});

Given('Je clique sur le bouton "Mettre a jour" Comptes de facturation', () => {
  partnerDetailPage.tabs.billingAccount.edit.save();
});

When('Je clique sur le bouton "Retour a la liste des C.F."', () => {
  partnerDetailPage.tabs.billingAccount.edit.return();
});

Then('Le libelle est correctement modifie a {string}', (label) => {
  partnerDetailPage.tabs.billingAccount.verifyLabelFirstLine(label);
});

/* Gestion des offres et cartes SIM, onglet "Offres et cartes SIM", sections "Offres" et "Cartes SIM" */

Given('Je clique sur le bouton de gestion', () => {
  partnerDetailPage.tabs.offersAndSimCards.manageButton();
});

When('Je clique sur le bouton "Desactiver"', () => {
  partnerDetailPage.tabs.offersAndSimCards.unselectButtonFirstCard();
});

Then("Le message de confirmation apparait et je peux confirmer l'action", () => {
  partnerDetailPage.modal.isVisible();
  partnerDetailPage.modal.saveButton();
});

/* La confirmation de modification apparait sur l'ecran apres l'enregistrement des options du partenaire, onglet "Detail du compte", section "Options du partenaire" */

When('Je clique sur le bouton "Enregistrer" Options du partenaire', () => {
  partnerDetailPage.tabs.accountDetails.partnerOptions.save();
});

Then('Le message de confirmation apparait et je peux fermer le message', () => {
  partnerDetailPage.modal.isVisible();
  partnerDetailPage.modal.cancelButton();
});
