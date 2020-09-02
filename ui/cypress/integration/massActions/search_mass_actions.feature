Feature: Recherche d'actes de gestion

  Je veux chercher des alarmes avec des filtres

  Scenario: Recherche par date de création
    Given en tant que BO
    And je suis sur l'historique des actes de gestion
    And je choisis le filtre par date de création
    When je clique sur 1 mois
    Then je peux appliquer le filtre

  Scenario: recherche partenaire
    Given en tant que BO
    And je suis sur l'historique des actes de gestion
    And je choisis le filtre partenaire "lyra"
    When je lance la recherche
    Then la table contient 1 resultat

  Scenario: recherche createur de la demande
    Given en tant que BO
    And je suis sur l'historique des actes de gestion
    And je choisis le filtre createur de la demande "bruce"
    When je lance la recherche
    Then la table contient 1 resultat

  Scenario: recherche type d'acte
    Given en tant que BO
    And je suis sur l'historique des actes de gestion
    And j'enlève le filtre par défaut
    And je choisis le filtre type d'acte "activation"
    When je lance la recherche
    Then la table contient 3 resultat

  Scenario: je lance une recherche par id
    Given en tant que BO
    And je suis sur l'historique des actes de gestion
    When je lance la recherche par ID "33698014672"
    Then la table contient 1 resultat
