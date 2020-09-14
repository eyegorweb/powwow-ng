Feature: Création de commande

  Je veux pouvoir créer des commandes

  Scenario: les services sont bien chargés
    Given en tant que BO
    And je suis sur la page de choix d'une offre dans la création de commande
    And je choisis l'activation et une offre
    When quand les services s'affichent
    Then les noms doivent apparaitre en regard des toggles

  Scenario: je veux créer une nouvelle commande par defaut
    Given en tant que BO
    And je crée une nouvelle commande
    And je choisis la commande par défaut
    When j'enregistre la commande
    Then ma commande a été enregistrée

  Scenario: je veux créer une commande personnalisée
    Given en tant que BO
    And je crée une nouvelle commande
    And je choisis comme partenaire de commande "Lyra"
    And je choisis comme CF de commande "6.42661"
    And je vais à la prochaine étape
    And je choisis le type de SIM 1
    And je choisis la quantité 3
    And je vais à la prochaine étape
    And je souhaite la préactivation
    And je souhaite l'activation
    And je sélectionne l'offre "EDELIA_V2"
    And je vais à la prochaine étape
    And je choisis la dernière adresse de livraison
    And je vais à la prochaine étape
    When j'enregistre la commande
    Then ma commande a été enregistrée
