Feature: Recherche de commandes

  Je veux chercher des commandes avec des filtres globaux

  Scenario: Je fais une recherche par partenaire
    Given en tant que BO
    And Je vais sur la page des commandes
    And Je créé une commande par défaut pour le partenaire AUCHAN
    And Je filtre par "Partenaires" nommé "AUCHAN"
    When je lance la recherche
    Then la table contient plus de 0 resultat
    And Je supprime les filtres

  Scenario: Je fais une recherche par compte de facturation
    Given en tant que BO
    And Je vais sur la page des commandes
    And Je filtre par "Comptes de facturation" nommé "TEST - 6.42661"
    When je lance la recherche
    Then la table contient plus de 0 resultat
    And Je supprime les filtres

  Scenario: Je fais une recherche par statut de commande
    Given en tant que BO
    And Je vais sur la page des commandes
    And Je filtre par "Statut de la commande" nommé "Confirmée"
    When je lance la recherche
    Then la table contient plus de 0 resultat
    And Je supprime les filtres

  #ignore -> erreur du find lors de la recherche de type de carte SIM
  @ignore
  Scenario: Je fais une recherche par type de carte SIM
    Given en tant que BO
    And Je vais sur la page des commandes
    And Je filtre par "Type de carte SIM" nommé "M2M sim sans code pin"
    When je lance la recherche
    Then la table contient plus de 0 resultat
    And Je supprime les filtres

  Scenario: Je fais une recherche par offre
    Given en tant que BO
    And Je vais sur la page des commandes
    And Je filtre par "Offres" nommé "offre Transics"
    When je lance la recherche
    Then la table contient 0 resultat
    And Je supprime les filtres

  Scenario: Je fais une recherche par ID
    Given en tant que BO
    And Je vais sur la page des commandes
    When je lance la recherche par ID "33698014672"
    Then la table contient 1 resultat

  @ignore
  Scenario: Je fais un export des commandes
    Given en tant que BO
    And Je vais sur la page des commandes
    When je lance un Export
    Then le fichier est bien téléchargé
