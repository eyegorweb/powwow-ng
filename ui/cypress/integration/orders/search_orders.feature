Feature: Recherche de commandes

  Je veux chercher des commandes avec des filtres globaux

  Scenario: Je fais une recherche par partenaire
    Given en tant que BO
    And je suis sur la page recherche de commandes
    And je choisis le filtre partenaire "lyra"
    When je lance la recherche
    Then la table contient plus de 0 resultat
    And Je supprime les filtres

  Scenario: Je fais une recherche par compte de facturation
    Given en tant que BO
    And je suis sur la page recherche de commandes
    And je choisis le filtre compte de facturation "TEST"
    When je lance la recherche
    Then la table contient plus de 0 resultat
    And Je supprime les filtres

  Scenario: Je fais une recherche par statut de commande
    Given en tant que BO
    And je suis sur la page recherche de commandes
    And je choisis le filtre statut "Confirmée"
    When je lance la recherche
    Then la table contient plus de 0 resultat
    And Je supprime les filtres

  Scenario: Je fais une recherche par type de carte SIM
    Given en tant que BO
    And je suis sur la page recherche de commandes
    And je choisis le filtre type "M2M sim antivol avec code pin bobine"
    When je lance la recherche
    Then la table contient plus de 0 resultat
    And Je supprime les filtres

  Scenario: Je fais une recherche par offre
    Given en tant que BO
    And je suis sur la page recherche de commandes
    And je choisis le filtre offre "offre TimerBV"
    When je lance la recherche
    Then la table contient plus de 0 resultat
    And Je supprime les filtres

  Scenario: Je fais une recherche par ID
    Given en tant que BO
    And je suis sur la page recherche de commandes
    When je lance la recherche par ID "33698014672"
    Then la table contient 1 resultat

  @ignore
  Scenario: Je fais un export des commandes
    Given en tant que BO
    And je suis sur la page recherche de commandes
    When je lance un Export
    Then le fichier est bien téléchargé
