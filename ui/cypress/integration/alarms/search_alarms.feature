Feature: Recherche d'alarmes

  Je veux chercher des alarmes avec des filtres

  Scenario: Recherche par partenaire
    Given en tant que BO
    And je suis sur la page recherche d'alarmes
    And je choisis le partenaire "INGENICO"
    When je lance la recherche
    Then la table contient le resultat de ma recherche

  Scenario: Recherche par plusieurs filtres
    Given en tant que BO
    And je suis sur la page recherche d'alarmes
    And je choisis le partenaire "lyra"
    And je choisis l'offre "Parc 2"
    When je lance la recherche
    Then la table contient le resultat de ma recherche

  Scenario: Recherche par compte de facturation
    Given en tant que BO
    And je suis sur la page recherche d'alarmes
    And je choisis le compte de facturation "INGENICO1"
    When je lance la recherche
    Then la table contient le resultat de ma recherche

  Scenario: En tant que partenaire, charger les alarmes du partenaire
    Given en tant que partenaire lyra
    And je suis sur la page recherche d'alarmes
    Then la table contient les alarmes du partenaire
