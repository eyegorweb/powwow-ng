Feature: Détails des actes de gestion

  Vérification de la page de détail d'un acte de gestion

  Scenario: Page de détails d'un acte de gestion, je reviens sur la liste des actes après avoir cliquer sur le bouton retour
    Given en tant que BO
    And Je vais sur la page des actes de gestion
    And Je recherche par ID "1"
    And Je clique sur l'ID de l'acte de gestion trouvé
    And Je clique sur "Voir le résultat de l'acte"
    And Je vérifie que l'url contient "act-detail/1"
    When Je clique sur le bouton "Retour"
    Then Je vérifie que l'url contient "act-history/classic"