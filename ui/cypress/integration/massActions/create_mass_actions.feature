Feature: creation d'actes de gestion

  je veux faire des tests sur la creation d'actes de gestion

  Scenario: je veux créer un actes de suspension de ligne
    Given en tant que BO
    And je regarde le nombre d'actes de gestions
    And je suis sur la page de création d'actes de gestion
    And je choisis l'acte de suspension par défaut
    When je confirme la création de l'acte
    Then je verifie que mon acte a été créé

  Scenario: je veux créer un acte d'activation/preactivation
    Given en tant que BO
    And je regarde le nombre d'actes de gestions
    And je suis sur la page de création d'actes de gestion
    And je choisis l'acte d'activation par défaut
    When je confirme la création de l'acte
    Then je verifie que mon acte a été créé

  Scenario: je veux créer un acte de changement de compte de facturation
    Given en tant que BO
    And je regarde le nombre d'actes de gestions
    And je suis sur la page de création d'actes de gestion
    And je choisis l'acte de changement de CF par défaut
    When je confirme la création de l'acte
    Then je verifie que mon acte a été créé

  Scenario: je veux créer un acte de modification de champs libres
    Given en tant que BO
    And je regarde le nombre d'actes de gestions
    And je suis sur la page de création d'actes de gestion
    And je choisis l'acte de modification des champs libres par défaut
    When je confirme la création de l'acte
    Then je verifie que mon acte a été créé

  Scenario: je veux créer une acte de résiliation avec un délai de 3 mois
    Given en tant que BO
    And je suis sur la page de création d'actes de gestion
    And je choisis l'acte de gestion de résiliation
    When Je créé la validation avec un délai de 3 mois
    Then Je valide que la due date est à la date du jour + 3 mois

  Scenario: Je veux refuser les résuliations
    Given en tant que BO
    And je suis sur la page de création d'actes de gestion
    And je choisis l'acte de gestion de résiliation
    When je refuse les résiliations
    Then un act de refus de résiliation est bien créé

  Scenario: Les lignes rejetées ne doivent pas être validées lors d'une validation de résiliation
    Given en tant que BO
    And je suis sur la page de création d'actes de gestion
    And je choisis l'acte de gestion de résiliation
    When je valide pour 1 ligne avec une security_terminaison_end à null et l'autre dans le futur et je valide.
    Then J'ai bien 2 KO quand j'essaie de résilier pour ces 2 lignes


# Il nous manque le jeu de données pour faire ce test
# Scenario: je veux créer un acte de changement de services
#   Given en tant que BO
#   And je regarde le nombre d'actes de gestions
#   And je suis sur la page de création d'actes de gestion
#   And je choisis l'acte de modification de services
#   When je confirme la création de l'acte
#   Then je verifie que mon acte a été créé
