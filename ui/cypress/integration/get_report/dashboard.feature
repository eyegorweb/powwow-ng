Feature: tests du dashboard de getReport

  je veux tester le dashboard de gerReport

  @ignore
  Scenario: je vérifie que le graphe s'affiche
    Given en tant que BO
    And je suis sur la page du dashborad getReport
    And je filtre par partenaire "lyra"
    When j'applique le filtre
    Then le graphe historique de consommation s'affiche correctement
