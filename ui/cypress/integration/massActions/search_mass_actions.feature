Feature: Recherche d'alarmes

  Je veux chercher des alarmes avec des filtres

  Scenario: Recherche par partenaire
    Given en tant que BO
    And je suis sur l'historique des actes de gestion
    And je choisis le filtre par date de création
    When je clique sur 1 mois
    Then je peux appliquer le filtre
