Feature: Creation et modification d'utilisateurs

  Je veux creer et modifier des utilisateurs en tant que BO, partenaire et compte groupe

  #ETQU BO => Création / Modification d'un utilisateur interne - Création / Modification d'un utilisateur partenaire - Création / Modification d'un utilisateur compte groupe

  Scenario: Creation d'un utilisateur interne en tant que BO
    Given en tant que BO
    And Je suis sur la page de gestion des utilisateurs
    And Je clique sur "Ajouter un utilisateur"
    And Je choisis le type d'utilisateur "1"
    And Je choisis le genre "1"
    And Je sélectionne le language "Français"
    And Je rentre le prénom "Test"
    And Je rentre le nom "Cypress"
    And Je rentre l'email "test.cypress@gmail.com"
    And Je rentre le login "TestCypressInternUser878"
    And Je rentre le mot de passe "*TestCypress01*"
    And Je sélectionne le rôle "1"
    When J'enregistre l'utilisateur
    Then Je vérifie la création du nouvel utilisateur

  Scenario: Creation d'un utilisateur partenaire en tant que BO
    Given en tant que BO
    And Je suis sur la page de gestion des utilisateurs
    And Je clique sur "Ajouter un utilisateur"
    And Je choisis le type d'utilisateur "2"
    And Je choisis le genre "1"
    And Je sélectionne le language "Français"
    And Je sélectionne le partenaire "lyra"
    And Je rentre le prénom "Test"
    And Je rentre le nom "Cypress"
    And Je rentre l'email "test.cypress@gmail.com"
    And Je rentre le login "TestCypressUserPartner98"
    And Je rentre le mot de passe "*TestCypress01*"
    And Je sélectionne le rôle "1"
    When J'enregistre l'utilisateur
    Then Je vérifie la création du nouvel utilisateur

  Scenario: Creation d'un utilisateur compte groupe en tant que BO
    Given en tant que BO
    And Je suis sur la page de gestion des utilisateurs
    And Je clique sur "Ajouter un utilisateur"
    And Je choisis le type d'utilisateur "3"
    And Je choisis le genre "1"
    And Je sélectionne le language "Français"
    And Je sélectionne le groupe de partenaire "party groupe 1"
    And Je rentre le prénom "Test"
    And Je rentre le nom "Cypress"
    And Je rentre l'email "test.cypress@gmail.com"
    And Je rentre le login "TestCypressUserGroupAccount2"
    And Je rentre le mot de passe "*TestCypress01*"
    When J'enregistre l'utilisateur
    Then Je vérifie la création du nouvel utilisateur

  Scenario: Modification d'un utilisateur interne en tant que BO
    Given en tant que BO
    And Je suis sur la page de gestion des utilisateurs
    And Je recherche l'utilisateur "TestCypressInternUser"
    And Je récupère le prénom
    And Je clique sur le bouton "Modifier"
    And Je rentre le prénom "TestModifié"
    When J'enregistre l'utilisateur
    And Je recherche l'utilisateur "TestCypressInternUser"
    Then Je vérifie la modification de l'utilisateur

  Scenario: Modification d'un utilisateur partenaire en tant que BO
    Given en tant que BO
    And Je suis sur la page de gestion des utilisateurs
    And Je recherche l'utilisateur "TestCypressUserPartner9"
    And Je récupère le prénom
    And Je clique sur le bouton "Modifier"
    And Je rentre le prénom "TestModifié"
    When J'enregistre l'utilisateur
    And Je recherche l'utilisateur "TestCypressUserPartner9"
    Then Je vérifie la modification de l'utilisateur

  Scenario: Modification d'un utilisateur compte groupe en tant que BO
    Given en tant que BO
    And Je suis sur la page de gestion des utilisateurs
    And Je recherche l'utilisateur "TestCypressUserGroupAccount"
    And Je récupère le prénom
    And Je clique sur le bouton "Modifier"
    And Je rentre le prénom "TestModifié"
    When J'enregistre l'utilisateur
    And Je recherche l'utilisateur "TestCypressUserGroupAccount"
    Then Je vérifie la modification de l'utilisateur

  #ETQU partenaire => Création / Modification d'un utilisateur partenaire

  Scenario: Creation d'un utilisateur partenaire en tant que partenaire
    Given en tant que partenaire lyra
    And Je suis sur la page de gestion des utilisateurs
    And Je clique sur "Ajouter un utilisateur"
    And Je choisis le genre "1"
    And Je sélectionne le language "Français"
    And Je rentre le prénom "Test"
    And Je rentre le nom "Cypress"
    And Je rentre l'email "test.cypress@gmail.com"
    And Je rentre le login "TestCypressUserPartnertByPartner"
    And Je rentre le mot de passe "*TestCypress01*"
    And Je sélectionne le rôle "1"
    When J'enregistre l'utilisateur
    Then Je vérifie la création du nouvel utilisateur

  Scenario: Modifcation d'un utilisateur partenaire en tant que partenaire
    Given en tant que partenaire lyra
    And Je suis sur la page de gestion des utilisateurs
    And Je recherche l'utilisateur "TestCypressUserPartnertByPartner"
    And Je récupère le prénom
    And Je clique sur le bouton "Modifier"
    And Je rentre le prénom "TestModifié"
    When J'enregistre l'utilisateur
    And Je recherche l'utilisateur "TestCypressUserPartnertByPartner"
    Then Je vérifie la modification de l'utilisateur

  #ETQU compte groupe => Création / Modification d'un utilisateur partenaire

  Scenario: Creation d'un utilisateur partenaire en tant que compte groupe
    Given en tant que compte groupe
    And Je suis sur la page de gestion des utilisateurs
    And Je clique sur "Ajouter un utilisateur"
    And Je choisis le genre "1"
    And Je sélectionne le language "Français"
    And Je sélectionne le partenaire "lyra"
    And Je rentre le prénom "Test"
    And Je rentre le nom "Cypress"
    And Je rentre l'email "test.cypress@gmail.com"
    And Je rentre le login "TestCypressUserPartnerByGroupAccount"
    And Je rentre le mot de passe "*TestCypress01*"
    And Je sélectionne le rôle "1"
    When J'enregistre l'utilisateur
    Then Je vérifie la création du nouvel utilisateur

  Scenario: Modification d'un utilisateur partenaire en tant que compte groupe
    Given en tant que compte groupe
    And Je suis sur la page de gestion des utilisateurs
    And Je recherche l'utilisateur "TestCypressUserPartnerByGroupAccount"
    And Je récupère le prénom
    And Je clique sur le bouton "Modifier"
    And Je rentre le prénom "TestModifié"
    When J'enregistre l'utilisateur
    And Je recherche l'utilisateur "TestCypressUserPartnerByGroupAccount"
    Then Je vérifie la modification de l'utilisateur
