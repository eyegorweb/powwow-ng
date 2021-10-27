Feature: Recherche de factures

  je veux pouvoir rechercher des factures

  Scenario: Je fais une recherche par partenaire
    Given en tant que BO
    And Je vais sur la page des factures
    And je choisis le filtre partenaire "Auchan"
    Then mon filtre a été enregistré
