Feature: Recherche de stocks

  Je veux chercher des stocks avec des filtres

  Scenario: Recherche par partenaire
    Given en tant que BO
    And Je suis sur la page de gestion des stocks
    And Je choisis le filtre partenaire "LYRA"
    When Je lance la recherche
    Then La table contient plus de 0 resultat
