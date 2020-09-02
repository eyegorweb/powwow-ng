Feature: Recherche d'alarmes

  Je veux chercher des alarmes avec des filtres

  Scenario: Recherche par partenaire
    Given en tant que BO
    And je suis sur la page recherche d'alarmes
    And je choisis le filtre partenaire "INGENICO"
    When je lance la recherche
    Then la table contient plus de 0 resultat

  Scenario: Recherche par plusieurs filtres
    Given en tant que BO
    And je suis sur la page recherche d'alarmes
    And je choisis le filtre partenaire "lyra"
    And je choisis le filtre offre "Parc 2"
    When je lance la recherche
    Then la table contient plus de 0 resultat

  Scenario: Recherche par compte de facturation
    Given en tant que BO
    And je suis sur la page recherche d'alarmes
    And je choisis le filtre compte de facturation "INGENICO1"
    When je lance la recherche
    Then la table contient plus de 0 resultat

  Scenario: En tant que partenaire, charger les alarmes du partenaire
    Given en tant que partenaire lyra
    And je suis sur la page recherche d'alarmes
    Then la table contient les alarmes du partenaire

  Scenario: Recherche par offre associée
    Given en tant que BO
    And je suis sur la page recherche d'alarmes
    And je choisis le filtre offre "Parc 2"
    When je lance la recherche
    Then la table contient plus de 0 resultat

  Scenario: recherche par portée d'alarmes
    Given en tant que BO
    And je suis sur la page recherche d'alarmes
    And je choisis le filtre portée de l'alarme "partenaire"
    When je lance la recherche
    Then la table contient 0 resultat

  Scenario: rechercher une alarme par ID
    Given en tant que BO
    And je suis sur la page recherche d'alarmes
    When je lance la recherche par ID "86"
    Then la table contient plus de 0 resultat
