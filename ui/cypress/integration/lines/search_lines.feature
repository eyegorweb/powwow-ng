Feature: Recherche de lignes

  Je veux chercher des lignes avec des filtres globaux

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
    And Je filtre par insertion "Id de la commande" avec une valeur de "2"
    When je lance la recherche
    Then la table contient 1 resultat
    And Je supprime les filtres

  Scenario: Je fais une recherche avec plusieurs filtres
    Given en tant que BO
    And Je vais sur la page des lignes
    And Je filtre par "Partenaires" nommé "AUCHAN"
    And Je filtre par "Comptes de facturation" nommé "Auchan1 - Auchan1"
    And Je filtre par "Type de carte SIM" nommé "M2M sim sans code pin"
    And Je filtre par "Offre associée" nommé "AUCHAN_OFFRE_DATA2"
    And Je filtre par "Statut de facturation" nommé "Activée"
    When je lance la recherche
    Then la table contient 0 resultat

  Scenario: Vérification de l'enregistrement des filtres
    Given en tant que BO
    And Je vais sur la page des lignes
    And Je filtre par "Partenaires" nommé "AUCHAN"
    And Je filtre par "Comptes de facturation" nommé "Auchan1 - Auchan1"
    And J'enregistre les filtres sous le nom de "Test Cypress"
    And Je supprime les filtres
    When Je clique sur le filtre enregistré
    Then Les filtres "AUCHAN" et "Auchan1 - Auchan1" sont activés

  Scenario: J'initialise le filtre Type de carte SIM selon le filtre Catégorie de SIM
    Given en tant que BO
    And Je vais sur la page des lignes
    And je récupère la longueur de la liste du filtre "Type de carte SIM"
    And j'affiche tous les filtres
    And Je filtre par sélection "Catégorie de SIM" nommé "ESIM"
    When je récupère la longueur de la liste du filtre "Type de carte SIM"
    Then je vérifie que la liste compte moins d'éléments lorsque le filtre "Catégorie de SIM" est actif à "ESIM"

  Scenario: Je fais une recherche avec des filtres eSIM
    Given en tant que BO
    And Je vais sur la page des lignes
    And j'affiche tous les filtres
    And Je vérifie que les filtres "Type de Step,Statut de téléchargement,Ligne Appairée,SMSRID" sont grisés
    And Je filtre par sélection "Catégorie de SIM" nommé "ESIM"
    And Je filtre par "Type de carte SIM" nommé "ESIM CARTE 2 ESIMM2M002"
    And Je filtre par sélection "Type de Step" nommé "STEP2"
    And Je filtre par sélection "Statut de téléchargement" nommé "ENABLED"
    And Je filtre par sélection "Ligne Appairée" nommé "YES"
    When je lance la recherche
    Then la table contient 0 resultat

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
