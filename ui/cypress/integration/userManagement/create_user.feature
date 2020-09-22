Feature: creation d'utilisateur

    je veux créer des utilisateurs

  Scenario: je veux créer un utilisateur et voir si il existe
    Given en tant que BO
    And je suis sur la page de gestion des utilisateurs
    And je créé un nouvel utilisateur interne
    And je lui donne pour sexe "M"
    And je lui donne pour prénom "charles"
    And je lui donne pour nom "henri"
    And je lui donne pour email "charles.henri@gmail.com"
    And je lui donne pour login "Anakin"
    And je lui donne pour mdp "Testlong1!"
    And je lui donne pour rôle ""
    And j'enregistre la création de l'utilisateur
    When je recherche le login de mon utilisateur
    Then la table contient 1 resultat
