Feature: Recherche de commandes

  Je veux chercher des commandes avec des filtres

  Scenario: Recherche par partenaire
    Given en tant que BO
    And je suis sur la page recherche de commandes
    And je choisis le filtre partenaire "lyra"
    When je lance la recherche
    Then la table contient plus de 0 resultat

  Scenario: recherche par partenaire + offre + statut
    Given en tant que BO
    And je suis sur la page recherche de commandes
    And je choisis le filtre partenaire "lyra"
    And je choisis le filtre offre "Parc 1 forfait"
    And je choisis le filtre statut "Confirmée"
    And je choisis le filtre type "M2M sim antivol avec code pin bobine"
    When je lance la recherche
    Then la table contient 1 resultat

  Scenario: recherche par compte de facturation
    Given en tant que BO
    And je suis sur la page recherche de commandes
    And je choisis le filtre compte de facturation "TEST"
    When je lance la recherche
    Then la table contient 1 resultat

  Scenario: Recherche par statut de commande
    Given en tant que BO
    And je suis sur la page recherche de commandes
    And je choisis le filtre statut "Confirmée"
    When je lance la recherche
    Then la table contient plus de 0 resultat

  Scenario: Recherche par type de carte SIM
    Given en tant que BO
    And je suis sur la page recherche de commandes
    And je choisis le filtre type "M2M sim antivol avec code pin bobine"
    When je lance la recherche
    Then la table contient plus de 0 resultat

  Scenario: Recherche par offre
    Given en tant que BO
    And je suis sur la page recherche de commandes
    And je choisis le filtre offre "Parc 1 forfait"
    When je lance la recherche
    Then la table contient plus de 0 resultat

  Scenario: je lance une recherche par id
    Given en tant que BO
    And je suis sur la page recherche de commandes
    When je lance la recherche par ID "33698014672"
    Then la table contient 1 resultat
