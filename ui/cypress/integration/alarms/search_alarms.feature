Feature: Recherche d'alarmes

  Je veux chercher des alarmes avec des filtres

  Scenario: Je fais une recherche par partenaire
    Given en tant que BO
    And je suis sur la page recherche d'alarmes
    And je choisis le filtre partenaire "INGENICO"
    When je lance la recherche
    Then la table contient plus de 0 resultat
    And Je supprime les filtres

  Scenario: Je fais une recherche par compte de facturation
    Given en tant que BO
    And je suis sur la page recherche d'alarmes
    And je choisis le filtre compte de facturation "INGENICO1"
    When je lance la recherche
    Then la table contient plus de 0 resultat
    And Je supprime les filtres

  Scenario: Je fais une recherche par offre associée
    Given en tant que BO
    And je suis sur la page recherche d'alarmes
    And je choisis le filtre offre "Parc 2"
    When je lance la recherche
    Then la table contient plus de 0 resultat
    And Je supprime les filtres

  Scenario: Je fais une recherche par portée d'alarme
    Given en tant que BO
    And je suis sur la page recherche d'alarmes
    And je choisis le filtre portée de l'alarme "partenaire"
    When je lance la recherche
    Then la table contient plus de 0 resultat
    And Je supprime les filtres

  Scenario: Je fais une recherche par type d'alarme
    Given en tant que BO
    And je suis sur la page recherche d'alarmes
    And je choisis le filtre type d'alarme "Sur-consommation"
    When je lance la recherche
    Then la table contient plus de 0 resultat
    And Je supprime les filtres

  Scenario: Je fais une recherche par ID
    Given en tant que BO
    And je suis sur la page recherche d'alarmes
    When je lance la recherche par ID "86"
    Then la table contient 1 resultat

  Scenario: Je fais une recherche avec plusieurs filtres
    Given en tant que BO
    And je suis sur la page recherche d'alarmes
    And je choisis le filtre partenaire "lyra"
    And je choisis le filtre offre "Parc 2"
    When je lance la recherche
    Then la table contient plus de 0 resultat

  Scenario: Je fais une recherche par partenaire dans l'onglet des alarmes mutualisées
    Given en tant que BO
    And je suis sur la page recherche d'alarmes
    And je vais sur l'onglet alarmes mutualisées
    And je créé une alarme de sur-consommation de la flotte par défaut "TEST sur-consommation de la flotte"
    And je valide la création
    And je choisis le filtre partenaire "auchan"
    When je lance la recherche
    Then la table contient plus de 0 resultat

  Scenario: Je fais une recherche par compte de facturation dans l'onglet des alarmes mutualisées
    Given en tant que BO
    And je suis sur la page recherche d'alarmes
    And je vais sur l'onglet alarmes mutualisées
    And je créé une alarme de sur-consommation de la flotte par défaut "TEST sur-consommation de la flotte"
    And je valide la création
    And je choisis le filtre compte de facturation "auchan1"
    When je lance la recherche
    Then la table contient plus de 0 resultat

  @ignore
  #pas de données
  Scenario: Je fais une recherche par offre dans l'onglet des alarmes mutualisées
    Given en tant que BO
    And je suis sur la page recherche d'alarmes
    And je vais sur l'onglet alarmes mutualisées
    And je créé une alarme de sur-consommation de la flotte par défaut "TEST sur-consommation de la flotte"
    And je choisis le filtre offre ""
    When je lance la recherche
    Then la table contient plus de 0 resultat
