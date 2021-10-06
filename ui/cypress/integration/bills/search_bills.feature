Feature: recherche de factures

  je veux pouvoir rechercher des factures

  Scenario: Je fais une recherche par partenaire
    Given en tant que BO
    And je suis sur la page factures
    And je choisis le filtre partenaire "Auchan"
    Then mon filtre a été enregistré
