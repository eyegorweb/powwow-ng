Feature: Recherche de commandes

  Je veux chercher des commandes avec des filtres

  Scenario: Recherche par partenaire
    Given en tant que BO
    And je suis sur la page recherche de commandes
    And je choisis le partenaire "lyra"
    When je lance la recherche
    Then la table contient le resultat de ma recherche
