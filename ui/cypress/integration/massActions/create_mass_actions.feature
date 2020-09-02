Feature: creation d'actes de gestion

  je veux faire des tests sur la creation d'actes de gestion

  Scenario: je veux créer un actes de suspension de ligne
    Given en tant que BO
    And je suis sur la page de création d'actes de gestion
    And je choisis l'acte de suspension par défaut
    When je confirme la création de l'acte
    Then je verifie que mon acte a été créé

  Scenario: je veux créer un acte d'activation/preactivation
    Given en tant que BO
    And je suis sur la page de création d'actes de gestion
    And je choisis l'acte d'activation par défaut
    When je confirme la création de l'acte
    Then je verifie que mon acte a été créé
