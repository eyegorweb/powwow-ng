Feature: Recherche de lignes

  Je veux chercher des lignes avec des filtres

  Scenario: Clic sur "retour" depuis le détail de la ligne
    Given En tant que BO
    And je suis sur la page recherche de lignes
    And J'ouvre le détail d'une ligne
    When Je clique sur retour
    Then La table contient les résultats de la page précédente
