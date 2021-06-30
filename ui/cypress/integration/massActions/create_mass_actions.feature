Feature: creation d'actes de gestion

  je veux faire des tests sur la creation d'actes de gestion

  Scenario: je veux créer un acte de suspension de ligne
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

  # Pas d'affichage de l'acte -> vérification fail
  #Scenario: je veux créer une acte de résiliation avec un délai de 3 mois
  #  Given en tant que BO
  #  And je suis sur la page de création d'actes de gestion
  #  And je choisis l'acte de gestion de résiliation
  #  When Je créé la validation avec un délai de 3 mois
  #  Then Je valide que la due date est à la date du jour + 3 mois

  Scenario: Je veux refuser les résiliations
    Given en tant que BO
    And je suis sur la page de création d'actes de gestion
    And je choisis l'acte de gestion de résiliation
    When je refuse les résiliations
    Then un acte de refus de résiliation est bien créé

#Erreur : Exception while fetching data (/changeServices) : Unknown marketing offer with code LYRA_PARC2_FORFAIT_TEST
#Scenario: je veux créer un acte de changement de services
#  Given en tant que BO
#  And je regarde le nombre d'actes de gestions
#  And je suis sur la page de création d'actes de gestion
#  And je choisis l'acte de modification de services
#  When je confirme la création de l'acte
#  Then je verifie que mon acte a été créé
