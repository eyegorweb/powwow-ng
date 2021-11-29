Feature: Export d'utilisateurs

  je veux exporter les utilisateurs

  @users @export_user @ignore
  Scenario: Je veux exporter les utilisateurs
    Given en tant que BO
    And Je vais sur la page des utilisateurs
    And j'ouvre l'export des tables des utilisateurs
    Then je télécharge le fichier
