Feature: personnaliser la page d'accueil

    je veux changer les widgets de la page d'accueil

  Scenario: je test si les changements sont sauvegardés
    Given en tant que BO
    And j'ouvre le volet de personnalisation
    And je décoche le premier élément
    And j'applique les changements
    When je recharge la page
    Then les changements doivent être sauvegardés
