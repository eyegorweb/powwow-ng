Feature: Création d'alarmes

  Je veux créer des alarmes

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

  Scenario: Créer une alarme de changement de module par défaut
    Given en tant que BO
    And je suis sur la page de création d'alarmes
    And j'enregistre le nombre d'alarmes
    And je créé une alarme de changement de module par défaut "TEST changement de module"
    When je valide la création
    Then je vérifie que mon alarme a été créé

  Scenario: créer une alarme de changement de pays par défaut
    Given en tant que BO
    And je suis sur la page de création d'alarmes
    And j'enregistre le nombre d'alarmes
    And je créé une alarme de changement de pays par défaut "TEST changement de pays"
    When je valide la création
    Then je vérifie que mon alarme a été créé

  Scenario: Créer une alarme de sur-consommation par défaut
    Given en tant que BO
    And je suis sur la page de création d'alarmes
    And j'enregistre le nombre d'alarmes
    And je créé une alarme de sur-consommation par défaut "TEST sur-consommation"
    When je valide la création
    Then je vérifie que mon alarme a été créé

  Scenario: Créer une alarme de sous-consommation par défaut
    Given en tant que BO
    And je suis sur la page de création d'alarmes
    And j'enregistre le nombre d'alarmes
    And je créé une alarme de sous-consommation par défaut "TEST sous-consommation"
    When je valide la création
    Then je vérifie que mon alarme a été créé

  Scenario: Créer une alarme de sur-consommation de la flotte par défaut
    Given en tant que BO
    And je suis sur la page de création d'alarmes
    And je vais sur l'onglet des alarmes mutualisées
    And j'enregistre le nombre d'alarmes mutualisées
    And je créé une alarme de sur-consommation de la flotte par défaut "TEST sur-consommation de la flotte"
    When je valide la création
    Then je vérifie que mon alarme a été créé
