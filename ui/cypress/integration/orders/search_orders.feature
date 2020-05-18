Feature: Recherche de commandes

  Je veux chercher des commandes avec des filtres

  Scenario: Recherche par partenaire
    Given En tant que BO
    And je suis sur la page recherche de commandes
    And Je choisis le partenaire "lyra"
    When Je lance la recherche
    Then La table contient le resultat de ma recherche
