Feature: Recherche de factures

  je veux pouvoir rechercher des factures

  @bills @search_bills
  Scenario: Je fais une recherche par partenaire
    Given en tant que BO
    And Je vais sur la page des factures
    And Je filtre par liste "Partenaires" en choississant la valeur "AUCHAN"
    Then mon filtre a été enregistré
