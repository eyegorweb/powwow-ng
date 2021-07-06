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
    And Je rentre le login
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
    And Je rentre le login
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
    And Je rentre le login
    And Je rentre le mot de passe "*TestCypress01*"
    When J'enregistre l'utilisateur
    Then Je vérifie la création du nouvel utilisateur

  Scenario: Modification d'un utilisateur interne en tant que BO
    Given en tant que BO
    And Je suis sur la page de gestion des utilisateurs
    And Je créé un utilisateur de type "1" par défaut ETQU BO
    And Je recherche l'utilisateur
    And Je récupère le prénom
    And Je clique sur le bouton "Modifier"
    And Je rentre le prénom "TestModifié"
    When J'enregistre l'utilisateur
    And Je recherche l'utilisateur
    Then Je vérifie la modification de l'utilisateur

  Scenario: Modification d'un utilisateur partenaire en tant que BO
    Given en tant que BO
    And Je suis sur la page de gestion des utilisateurs
    And Je créé un utilisateur de type "2" par défaut ETQU BO
    And Je recherche l'utilisateur
    And Je récupère le prénom
    And Je clique sur le bouton "Modifier"
    And Je rentre le prénom "TestModifié"
    When J'enregistre l'utilisateur
    And Je recherche l'utilisateur
    Then Je vérifie la modification de l'utilisateur

  Scenario: Modification d'un utilisateur compte groupe en tant que BO
    Given en tant que BO
    And Je suis sur la page de gestion des utilisateurs
    And Je créé un utilisateur de type "3" par défaut ETQU BO
    And Je recherche l'utilisateur
    And Je récupère le prénom
    And Je clique sur le bouton "Modifier"
    And Je rentre le prénom "TestModifié"
    When J'enregistre l'utilisateur
    And Je recherche l'utilisateur
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
    And Je rentre le login
    And Je rentre le mot de passe "*TestCypress01*"
    And Je sélectionne le rôle "1"
    When J'enregistre l'utilisateur
    Then Je vérifie la création du nouvel utilisateur

  Scenario: Modification d'un utilisateur partenaire en tant que partenaire
    Given en tant que partenaire lyra
    And Je suis sur la page de gestion des utilisateurs
    And Je créé un utilisateur partenaire par défaut ETQU partenaire
    And Je recherche l'utilisateur
    And Je récupère le prénom
    And Je clique sur le bouton "Modifier"
    And Je rentre le prénom "TestModifié"
    When J'enregistre l'utilisateur
    And Je recherche l'utilisateur
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
    And Je rentre le login
    And Je rentre le mot de passe "*TestCypress01*"
    And Je sélectionne le rôle "1"
    When J'enregistre l'utilisateur
    Then Je vérifie la création du nouvel utilisateur

  Scenario: Modification d'un utilisateur partenaire en tant que compte groupe
    Given en tant que compte groupe
    And Je suis sur la page de gestion des utilisateurs
    And Je créé un utilisateur partenaire par défaut ETQU compte groupe
    And Je recherche l'utilisateur
    And Je récupère le prénom
    And Je clique sur le bouton "Modifier"
    And Je rentre le prénom "TestModifié"
    When J'enregistre l'utilisateur
    And Je recherche l'utilisateur
    Then Je vérifie la modification de l'utilisateur
