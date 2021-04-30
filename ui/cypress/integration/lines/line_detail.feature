Feature: detail des lignes

  Je veux tester le detail des lignes

  Scenario: je veux verifier l'en cours d'une ligne activée
    Given en tant que BO
    And Je suis sur la page de gestion de lignes
    And je lance la recherche par ID "33669497435"
    And j'ouvre le panneau de détail de la ligne
    When je clique sur voir l'en-cours
    Then la table de l'en-cours existe

  Scenario: je veux verifier l'en cours d'une ligne non-activée
    Given en tant que BO
    And Je suis sur la page de gestion de lignes
    And je lance la recherche par ID "8933209512007559906"
    And j'ouvre le panneau de détail de la ligne
    When je clique sur voir l'en-cours
    Then la table de l'en-cours n'existe pas

  @focus
  Scenario: Verification de la navigation entre les differents onglets dans le detail d'une ligne
    Given en tant que BO
    And Je suis sur la page de gestion de lignes
    And je lance la recherche par ID "33669497435"
    And j'ouvre le panneau de détail de la ligne
    When Je clique sur "Voir le detail de la ligne"
    Then Je peux naviguer entre les differents onglets
