Feature: Recherche d'alarmes

  Je veux chercher des alarmes avec des filtres

  Scenario: Recherche par partenaire
    Given En tant que BO
    And je suis sur la page recherche d'alarmes
    And Je choisis le partenaire "INGENICO"
    When Je lance la recherche
    Then La table contient le resultat de ma recherche

  Scenario: Recherche par plusieurs filtres
    Given En tant que BO
    And je suis sur la page recherche d'alarmes
    And Je choisis le partenaire "lyra"
    And Je choisis l'Offre "Parc 2"
    When Je lance la recherche
    Then La table contient le resultat de ma recherche

  Scenario: Recherche par compte de facturation
    Given En tant que BO
    And je suis sur la page recherche d'alarmes
    And Je choisis le compte de facturation "INGENICO1"
    When Je lance la recherche
    Then La table contient le resultat de ma recherche

  Scenario: En tant que partenaire, charger les alarmes du partenaire
    Given En tant que partenaire lyra
    And je suis sur la page recherche d'alarmes
    Then La table contient les alarmes du partenaire
