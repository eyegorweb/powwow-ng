Feature: Recherche d'alarmes

  Je veux chercher des alarmes avec des filtres

  @alarms @search_alarms
  Scenario: Je fais une recherche par partenaire
    Given en tant que BO
    And Je vais sur la page des alarmes
    And Je filtre par "Partenaires" nommé "INGENICO"
    When je lance la recherche
    Then la table contient plus de 0 resultat
    And Je supprime les filtres

  @alarms @search_alarms
  Scenario: Je fais une recherche par compte de facturation
    Given en tant que BO
    And Je vais sur la page des alarmes
    And Je filtre par "Compte de facturation" nommé "Auchan1 - Auchan1"
    When je lance la recherche
    Then la table contient plus de 0 resultat
    And Je supprime les filtres

  @alarms @search_alarms
  Scenario: Je fais une recherche par offre associée
    Given en tant que BO
    And Je vais sur la page des alarmes
    And Je filtre par "Offres" nommé "offre Transics"
    When je lance la recherche
    Then la table contient plus de 0 resultat
    And Je supprime les filtres

  @alarms @search_alarms
  Scenario: Je fais une recherche par portée d'alarme
    Given en tant que BO
    And Je vais sur la page des alarmes
    And Je filtre par "Portée de l'alarme" nommé "Ligne"
    When je lance la recherche
    Then la table contient plus de 0 resultat
    And Je supprime les filtres

  @alarms @search_alarms
  Scenario: Je fais une recherche par type d'alarme
    Given en tant que BO
    And Je vais sur la page des alarmes
    And Je filtre par sélection "Type d'alarme" nommé "Sur-consommation"
    When je lance la recherche
    Then la table contient plus de 0 resultat
    And Je supprime les filtres

  @alarms @search_alarms
  Scenario: Je fais une recherche par ID
    Given en tant que BO
    And Je vais sur la page des alarmes
    When je lance la recherche par ID "86"
    Then la table contient 1 resultat

  @alarms @search_alarms
  Scenario: Je fais une recherche avec plusieurs filtres
    Given en tant que BO
    And Je vais sur la page des alarmes
    And Je filtre par "Partenaires" nommé "LYRA NETWORK"
    And Je filtre par "Offres" nommé "Parc 2 forfait"
    When je lance la recherche
    Then la table contient plus de 0 resultat

  @alarms @search_alarms
  Scenario: Je fais une recherche par partenaire dans l'onglet des alarmes mutualisées
    Given en tant que BO
    And Je vais sur la page des alarmes
    And Je vais sur la page des alarmes mutualisées
    And je créé une alarme de sur-consommation de la flotte par défaut "TEST sur-consommation de la flotte"
    And je valide la création
    And Je filtre par "Partenaires" nommé "AUCHAN"
    When je lance la recherche
    Then la table contient plus de 0 resultat

  @alarms @search_alarms
  Scenario: Je fais une recherche par compte de facturation dans l'onglet des alarmes mutualisées
    Given en tant que BO
    And Je vais sur la page des alarmes
    And Je vais sur la page des alarmes mutualisées
    And je créé une alarme de sur-consommation de la flotte par défaut "TEST sur-consommation de la flotte"
    And je valide la création
    And Je filtre par "Compte de facturation" nommé "Auchan1 - Auchan1"
    When je lance la recherche
    Then la table contient plus de 0 resultat

  @alarms @search_alarms @ignore
  #pas de données
  Scenario: Je fais une recherche par offre dans l'onglet des alarmes mutualisées
    Given en tant que BO
    And Je vais sur la page des alarmes
    And Je vais sur la page des alarmes mutualisées
    And je créé une alarme de sur-consommation de la flotte par défaut "TEST sur-consommation de la flotte"
    And je choisis le filtre offre ""
    When je lance la recherche
    Then la table contient plus de 0 resultat
