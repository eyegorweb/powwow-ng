Feature: Détail d'un acte de gestion

  Scenario: Export des actes de gestion
    Given en tant que BO
    And je suis sur le détail de l'acte de gestion avec l'id 1
    When je lance un Export de l'acte de gestion
    Then le fichier est bien téléchargé