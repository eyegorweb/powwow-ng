Feature: creation d'actes de gestion

  je veux faire des tests sur la creation d'actes de gestion

  @ignore
  Scenario: je veux créer un actes de suspension de ligne
    Given en tant que BO
    And je regarde le nombre d'actes de gestions
    And je suis sur la page de création d'actes de gestion
    And je choisis l'acte de suspension par défaut
    When je confirme la création de l'acte
    Then je verifie que mon acte a été créé

  @ignore
  Scenario: je veux créer un acte d'activation/preactivation
    Given en tant que BO
    And je regarde le nombre d'actes de gestions
    And je suis sur la page de création d'actes de gestion
    And je choisis l'acte d'activation par défaut
    When je confirme la création de l'acte
    Then je verifie que mon acte a été créé

  @ignore
  Scenario: je veux créer un acte de changement de compte de facturation
    Given en tant que BO
    And je regarde le nombre d'actes de gestions
    And je suis sur la page de création d'actes de gestion
    And je choisis l'acte de changement de CF par défaut
    When je confirme la création de l'acte
    Then je verifie que mon acte a été créé

  @ignore
  Scenario: je veux créer un acte de modification de champs libres
    Given en tant que BO
    And je regarde le nombre d'actes de gestions
    And je suis sur la page de création d'actes de gestion
    And je choisis l'acte de modification des champs libres par défaut
    When je confirme la création de l'acte
    Then je verifie que mon acte a été créé

  @ignore
  Scenario: je veux créer un acte de changement de services
    Given en tant que BO
    And je regarde le nombre d'actes de gestions
    And je suis sur la page de création d'actes de gestion
    And je choisis l'acte de modification de services
    When je confirme la création de l'acte
    Then je verifie que mon acte a été créé
