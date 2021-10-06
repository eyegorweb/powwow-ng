Feature: export d'utilisateurs

    je veux exporter les utilisateurs

  @ignore
  Scenario: Je veux exporter les utilisateurs
    Given en tant que BO
    And je suis sur la page de gestion des utilisateurs
    And j'ouvre l'export des tables des utilisateurs
    Then je télécharge le fichier
