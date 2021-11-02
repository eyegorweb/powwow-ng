Feature: Recherche de partenaires

  Je veux chercher un partenaire avec des filtres

  Scenario: Je fais une recherche par raison sociale
    Given en tant que BO
    And Je vais sur la page des partenaires
    And Je filtre par "Raison sociale" nommé "LYRA NETWORK"
    When Je lance la recherche
    Then La table contient exactement 1 ligne
