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

  Scenario: Verification de la navigation entre les differents onglets dans le detail d'une ligne
    Given en tant que BO
    And Je suis sur la page de gestion de lignes
    And je lance la recherche par ID "33669497435"
    And j'ouvre le panneau de détail de la ligne
    When Je clique sur "Voir le detail de la ligne"
    Then Je peux naviguer entre les differents onglets

  Scenario: Verification du clickable des boutons dans le detail d'une ligne activee
    Given en tant que BO
    And Je suis sur la page de gestion de lignes
    And je lance la recherche par ID "33669497435"
    And j'ouvre le panneau de détail de la ligne
    When Je clique sur "Voir le detail de la ligne"
    Then Je peux cliquer sur les boutons et les panneaux s'ouvrent

  Scenario: Verification du non clickable des boutons dans le detail d'une ligne non activee
    Given en tant que BO
    And Je suis sur la page de gestion de lignes
    And je lance la recherche par ID "8933209512007559906"
    And j'ouvre le panneau de détail de la ligne
    When Je clique sur "Voir le detail de la ligne"
    Then Je verifie que les boutons ne sont pas clickable

  Scenario: Verification de la presence du tableau de consommation dans le detail d'une ligne activee
    Given en tant que BO
    And Je suis sur la page de gestion de lignes
    And je lance la recherche par ID "33669497435"
    And j'ouvre le panneau de détail de la ligne
    When Je clique sur "Voir le detail de la ligne"
    Then Le tableau de consommation est present dans l'onglet "EN COURS DE CONSOMMATION"

  Scenario: Verification de la navigation entre les differents menus dans l'onglet d'analyse d'une ligne activee
    Given en tant que BO
    And Je suis sur la page de gestion de lignes
    And je lance la recherche par ID "33669497435"
    And j'ouvre le panneau de détail de la ligne
    When Je clique sur "Voir le detail de la ligne"
    Then Je peux cliquer sur les differents menus de l'onglet d'analyse

  Scenario: Verification de la presence du message d'avertissement dans les onglets de consommation et d'analyse dans le detail d'une ligne non activee
    Given en tant que BO
    And Je suis sur la page de gestion de lignes
    And je lance la recherche par ID "8933209512007559906"
    And j'ouvre le panneau de détail de la ligne
    When Je clique sur "Voir le detail de la ligne"
    Then Le message d'avertissement est present dans les onglets de consommation et d'analyse
