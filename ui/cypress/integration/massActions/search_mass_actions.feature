Feature: Recherche d'actes de gestion

  Je veux chercher des alarmes avec des filtres

  #ignore -> erreur cypress inconnue atm
  @massActions @search_mass_actions @ignore
  Scenario: Je fais une recherche par date de création
    Given en tant que BO
    And Je vais sur la page des actes de gestion
    And Je filtre par date "Date de création de l’acte" avec une période "1"
    When je lance la recherche
    Then je peux appliquer le filtre
    And Je supprime les filtres

  @massActions @search_mass_actions
  Scenario: Je fais une recherche par partenaire
    Given en tant que BO
    And Je vais sur la page des actes de gestion
    And Je filtre par "Partenaires" nommé "LYRA NETWORK"
    When je lance la recherche
    Then la table contient plus de 0 resultat
    And Je supprime les filtres

  @massActions @search_mass_actions
  Scenario: Je fais une recherche par créateur de la demande
    Given en tant que BO
    And Je vais sur la page des actes de gestion
    And Je filtre par "Créateur de la demande" nommé "Bruce Lee"
    When je lance la recherche
    Then la table contient plus de 0 resultat
    And Je supprime les filtres

  @massActions @search_mass_actions
  Scenario: Je fais une recherche par type d'acte
    Given en tant que BO
    And Je vais sur la page des actes de gestion
    And j'enlève le filtre par défaut
    And Je filtre par "Type d'actes de gestion" nommé "Activation"
    When je lance la recherche
    Then la table contient plus de 0 resultat
    And Je supprime les filtres

  @massActions @search_mass_actions
  Scenario: Je fais une recherche par ID
    Given en tant que BO
    And Je vais sur la page des actes de gestion
    When je lance la recherche par ID "33698014672"
    Then la table contient 1 resultat

  @massActions @search_mass_actions
  Scenario: Je veux voir l'historique des actes depuis la page d'accueil en cliquant sur la pendule
    Given en tant que BO
    And Je clique sur la pendule
    When je clique sur le bouton "Voir l'historique complet"
    Then Je vais sur la page des actes de gestion

  @massActions @search_mass_actions @ignore
  Scenario: Je fais un export des actes de gestion (Classique)
    Given en tant que BO
    And Je vais sur la page des actes de gestion
    When je lance un Export Classique
    Then le fichier est bien téléchargé

  @massActions @search_mass_actions @ignore
  Scenario: Je fais un export des actes de gestion (Complet)
    Given en tant que BO
    And Je vais sur la page des actes de gestion
    When je lance un Export Complet
    Then le fichier est bien téléchargé
