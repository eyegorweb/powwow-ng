Feature: Recherche d'alarmes

  Je veux chercher des alarmes avec des filtres

  Scenario: Recherche par partenaire
    Given En tant que BO
    And je suis sur l'historique des actes de gestion
    And Je choisis  le filtre par date de création
    When Je clique sur 1 mois
    Then je peux appliquer le filtre
