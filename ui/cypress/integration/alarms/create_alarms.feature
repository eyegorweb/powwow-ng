Feature: création d'alarmes

  je veux créer des alarmes de changement

  Scenario: créer une alarme de changement d'operateur par défaut
    Given en tant que BO
    And je suis sur la page de création d'alarmes
    And j'enregistre le nombre d'alarmes
    And je créé une alarme de changement d'opérateur par défaut "TEST changement d'opérateur"
    When je valide la création
    Then je vérifie que mon alarme a été créé

  Scenario: créer une alarme de changement de statut par défaut
    Given en tant que BO
    And je suis sur la page de création d'alarmes
    And j'enregistre le nombre d'alarmes
    And je créé une alarme de changement de statut par défaut "TEST changement de statut"
    When je valide la création
    Then je vérifie que mon alarme a été créé

  Scenario: créer une alarme de changement d'equipement par défaut
    Given en tant que BO
    And je suis sur la page de création d'alarmes
    And j'enregistre le nombre d'alarmes
    And je créé une alarme de changement d'equipement par défaut "TEST changement d'equipement"
    When je valide la création
    Then je vérifie que mon alarme a été créé

  Scenario: créer une alarme de changement de pays par défaut
    Given en tant que BO
    And je suis sur la page de création d'alarmes
    And j'enregistre le nombre d'alarmes
    And je créé une alarme de changement de pays par défaut "TEST changement de pays"
    When je valide la création
    Then je vérifie que mon alarme a été créé
