Feature: Création de commande

  Je veux pouvoir créer des commandes

  Scenario: les services sont bien chargés
    Given en tant que BO
    And je suis sur la page de choix d'une offre dans la création de commande
    And je choisis l'activation et une offre
    When quand les services s'affichent
    Then les noms doivent apparaitre en regard des toggles
