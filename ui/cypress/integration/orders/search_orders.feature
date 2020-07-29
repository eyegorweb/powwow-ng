Feature: Recherche de commandes

  Je veux chercher des commandes avec des filtres

  Scenario: Recherche par partenaire
    Given en tant que BO
    And je suis sur la page recherche de commandes
    And je choisis le partenaire "lyra"
    When je lance la recherche
    Then la table contient plus de 0 resultat

  Scenario: recherche par partenaire + offre
    Given en tant que BO
    And je suis sur la page recherche de commandes
    And je choisis le partenaire "lyra"
    And je choisis l'offre "Parc 1 forfait"
    When je lance la recherche
    Then la table contient 1 resultat
