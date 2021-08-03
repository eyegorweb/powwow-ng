Feature: recherche d'utilisateur

  je veux faire des tests sur la recherche d'utilisateur

  Scenario: je recherche un utilisateur non existant
    Given en tant que BO
    And je suis sur la page de recherche d'utilisateurs
    When je recherche l'utilisateur "nonExistentUser"
    Then la table contient 0 resultat
    And Je réinitialise la recherche

  Scenario: je recherche un utilisateur déjà existant
    Given en tant que BO
    And je suis sur la page de recherche d'utilisateurs
    When je recherche l'utilisateur "richard"
    Then la table contient 1 resultat

  Scenario: je veux rechercher par filtre nom et prénom
    Given en tant que BO
    And je suis sur la page de recherche d'utilisateurs
    And je choisis le filtre nom "lee"
    When je lance la recherche
    Then la table contient 1 resultat
    And Je supprime les filtres

  Scenario: je veux rechercher par filtre email
    Given en tant que BO
    And je suis sur la page de recherche d'utilisateurs
    And je choisis le filtre email "lyra@lyra.fr"
    When je lance la recherche
    Then la table contient 1 resultat
    And Je supprime les filtres

  Scenario: je veux rechercher par filtre partenaire
    Given en tant que BO
    And je suis sur la page de recherche d'utilisateurs
    And je choisis le filtre partenaire "lyra"
    When je lance la recherche
    Then la table contient plus de 0 resultat
    And Je supprime les filtres

  Scenario: je veux rechercher par filtre rôle
    Given en tant que BO
    And je suis sur la page de recherche d'utilisateurs
    And je choisis le filtre rôle "Administrateur demo"
    When je lance la recherche
    Then la table contient 0 resultat
    And Je supprime les filtres

  Scenario: je veux rechercher par statut actif
    Given en tant que BO
    And je suis sur la page de recherche d'utilisateurs
    And je choisis le filtre statut "Actif"
    When je lance la recherche
    Then la table contient plus de 0 resultat
    And Je supprime les filtres

  Scenario: je veux rechercher par statut non actif
    Given en tant que BO
    And je suis sur la page de recherche d'utilisateurs
    And je choisis le filtre statut "Non actif"
    When je lance la recherche
    Then la table contient 0 resultat
    And Je supprime les filtres

  Scenario: je veux rechercher par groupe de partenaires
    Given en tant que BO
    And je suis sur la page de recherche d'utilisateurs
    And je choisis le filtre groupe de partenaires "PARTY"
    When je lance la recherche
    Then la table contient plus de 0 resultat
    And Je supprime les filtres
