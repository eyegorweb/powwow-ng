Feature: Recherche de partenaires

  Je veux chercher un partenaire avec des filtres

  Scenario: Je veux chercher un partenaire depuis sa raison sociale
    Given en tant que BO
    And Je suis sur la page de gestion des partenaires
    And Je choisis le filtre Raison sociale "LYRA"
    When Je lance la recherche
    Then La table contient exactement 1 ligne
