Feature: Recherche de commandes

  Je veux chercher des commandes avec des filtres

  Scenario: Recherche par partenaire
    Given en tant que BO
    And je suis sur la page recherche de commandes
    And je choisis le partenaire "lyra"
    When je lance la recherche
    Then la table contient plus de 0 resultat

  @focus
  Scenario: recherche par partenaire + offre + statut
    Given en tant que BO
    And je suis sur la page recherche de commandes
    And je choisis le partenaire "lyra"
    And je choisis l'offre "Parc 1 forfait"
    And je choisis le statut "Confirmée"
    And je choisis le type "M2M sim antivol avec code pin bobine"
    When je lance la recherche
    Then la table contient 1 resultat

  Scenario: recherche par compte de facturation
    Given en tant que BO
    And je suis sur la page recherche de commandes
    And je choisis le compte de facturation "TEST"
    When je lance la recherche
    Then la table contient 1 resultat
