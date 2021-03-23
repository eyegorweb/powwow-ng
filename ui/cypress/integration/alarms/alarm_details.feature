Feature: Détail d'une alarme

  Scenario: Export des alarmes (depuis l'onglet DÉCLENCHEMENTS DANS LE MOIS)
    Given en tant que BO
    And je suis sur la page détail de l'alarme 85
    And je choisis les alarmes "DÉCLENCHEMENTS DANS LE MOIS"
    When je lance un Export des lignes
    Then l'export des déclenchemets dans le mois est bien téléchargé

  Scenario: Export des alarmes (depuis l'onglet LIGNES CIBLÉES PAR L'ALARME)
    Given en tant que BO
    And je suis sur la page détail de l'alarme 85
    And je choisis les alarmes "LIGNES CIBLÉES PAR L'ALARME"
    When je lance un Export des lignes
    Then l'export des lignes ciblées est bien téléchargé

  Scenario: Export des alarmes (depuis l'onglet LIGNES EXCLUES)
    Given en tant que BO
    And je suis sur la page détail de l'alarme 85
    And je choisis les alarmes "LIGNES EXCLUES"
    When je lance un Export des lignes
    Then l'export des lignes ciblées est bien téléchargé
