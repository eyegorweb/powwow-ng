Feature: detail des lignes

  Je veux tester le detail des lignes

  Scenario: je veux verifier l'en cours d'une ligne activée
    Given en tant que BO
    And je suis sur la page détail d'une ligne
    And je lance la recherche par ID "33669497435"
    And j'ouvre le panneau de détail de la ligne
    When je clique sur voir l'en-cours
    Then la table de l'en-cours existe

  Scenario: je veux verifier l'en cours d'une ligne non-activée
    Given en tant que BO
    And je suis sur la page détail d'une ligne
    And je lance la recherche par ID "8933209512007559906"
    And j'ouvre le panneau de détail de la ligne
    When je clique sur voir l'en-cours
    Then la table de l'en-cours n'existe pas
