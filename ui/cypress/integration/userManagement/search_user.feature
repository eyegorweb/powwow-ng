Feature: Recherche d'utilisateurs

  je veux faire des tests sur la recherche d'utilisateur

  @users @search_user
  Scenario: Je fais une recherche d'un utilisateur non existant
    Given en tant que BO
    And Je vais sur la page des utilisateurs
    When je recherche l'utilisateur "nonExistentUser"
    Then la table contient 0 resultat
    And Je réinitialise la recherche

  @users @search_user
  Scenario: Je fais une recherche d'un utilisateur déjà existant
    Given en tant que BO
    And Je vais sur la page des utilisateurs
    When je recherche l'utilisateur "richard"
    Then la table contient 1 resultat

  @users @search_user
  Scenario: Je fais une recherche par nom et prénom
    Given en tant que BO
    And Je vais sur la page des utilisateurs
    And Je filtre par insertion "Nom ou prénom" avec une valeur de "lee"
    When je lance la recherche
    Then la table contient 1 resultat
    And Je supprime les filtres

  @users @search_user
  Scenario: Je fais une recherche par email
    Given en tant que BO
    And Je vais sur la page des utilisateurs
    And Je filtre par insertion "Email" avec une valeur de "lyra@lyra.fr"
    When je lance la recherche
    Then la table contient 1 resultat
    And Je supprime les filtres

  @users @search_user @ignore
  Scenario: Je fais une recherche par partenaire
    Given en tant que BO
    And Je vais sur la page des utilisateurs
    And Je filtre par "Partenaires" nommé "INGENICO"
    When je lance la recherche
    Then la table contient plus de 0 resultat
    And Je supprime les filtres

  @users @search_user
  Scenario: Je fais une recherche par rôle
    Given en tant que BO
    And Je vais sur la page des utilisateurs
    And Je filtre par "Rôles" nommé "Administrateur"
    When je lance la recherche
    Then la table contient 14 resultat
    And Je supprime les filtres

  @users @search_user
  Scenario: Je fais une recherche par statut actif
    Given en tant que BO
    And Je vais sur la page des utilisateurs
    And Je filtre par item "Statut" valant "Actif"
    When je lance la recherche
    Then la table contient plus de 0 resultat
    And Je supprime les filtres

  @users @search_user
  Scenario: Je fais une recherche par statut non actif
    Given en tant que BO
    And Je vais sur la page des utilisateurs
    And Je filtre par item "Statut" valant "Non actif"
    When je lance la recherche
    Then la table contient 0 resultat
    And Je supprime les filtres

  @users @search_user
  Scenario: Je fais une recherche par groupe de partenaires
    Given en tant que BO
    And Je vais sur la page des utilisateurs
    And Je filtre par "Groupe de partenaire" nommé "PARTY groupe 1"
    When je lance la recherche
    Then la table contient plus de 0 resultat
    And Je supprime les filtres
