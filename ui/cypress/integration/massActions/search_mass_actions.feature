Feature: Recherche d'actes de gestion

  Je veux chercher des alarmes avec des filtres

  Scenario: Recherche par date de création
    Given en tant que BO
    And je suis sur l'historique des actes de gestion
    And je choisis le filtre par date de création
    When je clique sur 1 mois
    Then je peux appliquer le filtre
    And Je supprime les filtres

  Scenario: recherche partenaire
    Given en tant que BO
    And je suis sur l'historique des actes de gestion
    And je choisis le filtre partenaire "lyra"
    When je lance la recherche
    Then la table contient plus de 0 resultat
    And Je supprime les filtres

  Scenario: recherche createur de la demande
    Given en tant que BO
    And je suis sur l'historique des actes de gestion
    And je choisis le filtre createur de la demande "bruce"
    When je lance la recherche
    Then la table contient plus de 0 resultat
    And Je supprime les filtres

  Scenario: recherche type d'acte
    Given en tant que BO
    And je suis sur l'historique des actes de gestion
    And j'enlève le filtre par défaut
    And je choisis le filtre type d'acte "activation"
    When je lance la recherche
    Then la table contient plus de 0 resultat
    And Je supprime les filtres

  Scenario: je lance une recherche par id
    Given en tant que BO
    And je suis sur l'historique des actes de gestion
    When je lance la recherche par ID "33698014672"
    Then la table contient 1 resultat

  Scenario: Voir l'historique des actes depuis la page d'accueil en cliquant sur la pendule
    Given en tant que BO
    And Je clique sur la pendule
    When Je clique sur "Voir l'historique complet"
    Then Je suis sur l'historique des actes de gestion

  Scenario: Export des actes de gestion (Classique)
    Given en tant que BO
    And je suis sur l'historique des actes de gestion
    When je lance un Export Classique
    Then le fichier est bien téléchargé

  Scenario: Export des actes de gestion (Complet)
    Given en tant que BO
    And je suis sur l'historique des actes de gestion
    When je lance un Export Complet
    Then le fichier est bien téléchargé
