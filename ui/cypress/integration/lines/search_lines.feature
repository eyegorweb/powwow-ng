Feature: Recherche de lignes

  Je veux chercher des lignes avec des filtres globaux

  Scenario: Je fais une recherche par partenaire
    Given en tant que BO
    And Je vais sur la page des lignes
    And je choisis le filtre partenaire "lyra"
    When je lance la recherche
    Then la table contient plus de 0 resultat
    And Je supprime les filtres

  Scenario: Je fais une recherche par statut de facturation
    Given en tant que BO
    And Je vais sur la page des lignes
    And je choisis le filtre statut de facturation "Activé"
    When je lance la recherche
    Then la table contient plus de 0 resultat
    And Je supprime les filtres

  Scenario: Je fais une recherche par compte de facturation
    Given en tant que BO
    And Je vais sur la page des lignes
    And je choisis le filtre compte de facturation "TEST"
    When je lance la recherche
    Then la table contient plus de 0 resultat
    And Je supprime les filtres

  Scenario: Je fais une recherche par type de carte SIM
    Given en tant que BO
    And Je vais sur la page des lignes
    And je choisis le filtre type "M2M sim sans code pin"
    When je lance la recherche
    Then la table contient plus de 0 resultat
    And Je supprime les filtres

  Scenario: Je fais une recherche par offre associée
    Given en tant que BO
    And Je vais sur la page des lignes
    And je choisis le filtre offre "Parc 1 forfait"
    When je lance la recherche
    Then la table contient plus de 0 resultat
    And Je supprime les filtres

  Scenario: Je fais une recherche par MSISDN
    Given en tant que BO
    And Je vais sur la page des lignes
    When je lance la recherche par ID "33698014672"
    Then la table contient 1 resultat

  Scenario: Je fais une recherche par AP_ID
    Given en tant que BO
    And Je vais sur la page des lignes
    When je lance la recherche par ID "288"
    Then la table contient 1 resultat

  Scenario: Je fais une recherche par ID de commande
    Given en tant que BO
    And Je vais sur la page des lignes
    And je choisis le filtre id "2"
    When je lance la recherche
    Then la table contient 1 resultat
    And Je supprime les filtres

  Scenario: Je fais une recherche avec plusieurs filtres
    Given en tant que BO
    And Je vais sur la page des lignes
    And j'affiche tous les filtres
    And je choisis le filtre partenaire "lyra"
    And je choisis le filtre compte de facturation "6.42661"
    And je choisis le filtre type "M2M sim sans code pin"
    And je choisis le filtre offre "Parc 1 compteur"
    And je choisis le filtre statut de la ligne "Activée"
    When je lance la recherche
    Then la table contient 11 resultat

  Scenario: Vérification de l'enregistrement des filtres
    Given en tant que BO
    And Je vais sur la page des lignes
    And je choisis le filtre partenaire "lyra"
    And je choisis le filtre compte de facturation "6.42661"
    And J'enregistre les filtres sous le nom de "Test Cypress"
    And Je supprime les filtres
    When Je clique sur le filtre enregistré
    Then Les filtres "LYRA NETWORK" et "6.42661 - LYRA" sont activés

  @ignore
  Scenario: Je fais un export des lignes (Classique)
    Given en tant que BO
    And Je vais sur la page des lignes
    When je lance un Export "Classique"
    Then le fichier est bien téléchargé

  @ignore
  Scenario: Je fais un export des lignes (Complet)
    Given en tant que BO
    And Je vais sur la page des lignes
    When je lance un Export "Complet"
    Then le fichier est bien téléchargé

  @ignore
  Scenario: Je fais un export des lignes (Dernier usage)
    Given en tant que BO
    And Je vais sur la page des lignes
    When je lance un Export "Dernier usage"
    Then le fichier est bien téléchargé
    And Je ferme le message

  @ignore
  Scenario: Je fais un export des lignes (Services)
    Given en tant que BO
    And Je vais sur la page des lignes
    And j'affiche tous les filtres
    And je choisis le filtre partenaire "lyra"
    And je choisis le filtre statut de la ligne "Activée"
    And je lance la recherche
    When je lance un Export supplémentaire "Services"
    Then le fichier est bien téléchargé
