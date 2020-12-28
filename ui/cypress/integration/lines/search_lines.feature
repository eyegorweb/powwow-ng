Feature: Recherche de lignes

  Je veux chercher des lignes avec des filtres globaux

  Scenario: recherche par partenaire
    Given en tant que BO
    And je suis sur la page recherche de lignes
    And je choisis le filtre partenaire "lyra"
    When je lance la recherche
    Then la table contient plus de 0 resultat

  Scenario: je recherche par statut de facturation
    Given en tant que BO
    And je suis sur la page recherche de lignes
    And je choisis le filtre statut de facturation "Activé"
    When je lance la recherche
    Then la table contient plus de 0 resultat

  Scenario: recherche par compte de facturation
    Given en tant que BO
    And je suis sur la page recherche de lignes
    And je choisis le filtre compte de facturation "TEST"
    When je lance la recherche
    Then la table contient plus de 0 resultat

  Scenario: recherche par type de carte SIM
    Given en tant que BO
    And je suis sur la page recherche de lignes
    And je choisis le filtre type "M2M sim sans code pin"
    When je lance la recherche
    Then la table contient plus de 0 resultat

  Scenario: recherche par offre associée
    Given en tant que BO
    And je suis sur la page recherche de lignes
    And je choisis le filtre offre "Parc 1 forfait"
    When je lance la recherche
    Then la table contient plus de 0 resultat

  Scenario: je lance une recherche par MSISDN
    Given en tant que BO
    And je suis sur la page recherche de lignes
    When je lance la recherche par ID "33698014672"
    Then la table contient 1 resultat

  Scenario: je lance une recherche par AP_ID
    Given en tant que BO
    And je suis sur la page recherche de lignes
    When je lance la recherche par ID "288"
    Then la table contient 1 resultat

  Scenario: je recherche plusieurs filtres
    Given en tant que BO
    And je suis sur la page recherche de lignes
    And je choisis le filtre partenaire "lyra"
    And je choisis le filtre compte de facturation "6.42661"
    And je choisis le filtre type "M2M sim sans code pin"
    And je choisis le filtre offre "Parc 1 forfait"
    When je lance la recherche
    Then la table contient 3 resultat

  Scenario: je cherche par id de commande
    Given en tant que BO
    And je suis sur la page recherche de lignes
    And je choisis le filtre id "2"
    When je lance la recherche
    Then la table contient 1 resultat
