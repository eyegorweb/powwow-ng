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
    And je ferme le pannel du filtre
    And je choisis le filtre offre "Parc 2"
    When je lance la recherche
    Then la table contient plus de 0 resultat

  Scenario: Recherche par compte de facturation
    Given en tant que BO
    And je suis sur la page recherche d'alarmes
    And je choisis le filtre compte de facturation "INGENICO1"
    When je lance la recherche
    Then la table contient plus de 0 resultat

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
    Then la table contient plus de 0 resultat

  Scenario: Recherche par type d'alarme
    Given en tant que BO
    And je suis sur la page recherche d'alarmes
    And je choisis le filtre type d'alarme "Sur-consommation"
    When je lance la recherche
    Then la table contient plus de 0 resultat

  Scenario: rechercher une alarme par ID
    Given en tant que BO
    And je suis sur la page recherche d'alarmes
    When je lance la recherche par ID "86"
    Then la table contient 1 resultat

  @focus
  Scenario: Onglet alarmes mutualisées, recherche par partenaire
    Given en tant que BO
    And je suis sur la page recherche d'alarmes
    And je vais sur l'onglet alarmes mutualisées
    And je créé une alarme de sur-consommation de la flotte par défaut "TEST sur-consommation de la flotte"
    And je valide la création
    And je choisis le filtre partenaire "auchan"
    When je lance la recherche
    Then la table contient plus de 0 resultat

  @focus
  Scenario: Onglet alarmes mutualisées, recherche par compte de facturation
    Given en tant que BO
    And je suis sur la page recherche d'alarmes
    And je vais sur l'onglet alarmes mutualisées
    And je créé une alarme de sur-consommation de la flotte par défaut "TEST sur-consommation de la flotte"
    And je valide la création
    And je choisis le filtre compte de facturation "auchan1"
    When je lance la recherche
    Then la table contient plus de 0 resultat

#pas de données
#Scenario: Onglet alarmes mutualisées, recherche par offres
#  Given en tant que BO
#  And je suis sur la page recherche d'alarmes
#  And je vais sur l'onglet alarmes mutualisées
#  And je créé une alarme de sur-consommation de la flotte par défaut "TEST sur-consommation de la flotte"
#  And je choisis le filtre offre ""
#  When je lance la recherche
#  Then la table contient plus de 0 resultat
