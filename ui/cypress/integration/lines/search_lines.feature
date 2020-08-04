  Feature: Recherche de lignes

  Je veux chercher des lignes avec des filtres

  Scenario: Clic sur "retour" depuis le détail de la ligne
    Given en tant que BO
    And je suis sur la page recherche de lignes
    And j'ouvre le détail d'une ligne
    When je clique sur retour
    Then la table contient les résultats de la page précédente

  Scenario: recherche par partenaire
    Given en tant que BO
    And je suis sur la page recherche de lignes
    And je choisis le partenaire "lyra"
    When je lance la recherche
    Then la table contient plus de 0 resultat


  Scenario: je recherche plusieurs filtres
    Given en tant que BO
    And je suis sur la page recherche de lignes
    And je choisis le partenaire "lyra"
    And je choisis le compte de facturation "TEST"
    And je choisis le type "M2M sim sans code pin"
    And je choisis l'offre "Parc 1 compteur"
    And je choisis l'id "142"
    When je lance la recherche
    Then la table contient 1 resultat

  Scenario: je cherche par id de commande
    Given en tant que BO
    And je suis sur la page recherche de lignes
    And je choisis l'id "2"
    When je lance la recherche
    Then la table contient 1 resultat
