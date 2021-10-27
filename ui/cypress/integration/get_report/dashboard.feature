Feature: Dashboard

  je veux tester le dashboard de gerReport

  Scenario: Je vérifie que le graphe s'affiche
    Given en tant que BO
    And Je vais sur la page du dashboard
    And je filtre par partenaire "lyra"
    When j'applique le filtre
    Then le graphe historique de consommation s'affiche correctement
