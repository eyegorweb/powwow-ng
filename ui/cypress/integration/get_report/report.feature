Feature: Rapports

  Je veux tester les rapports

  Scenario: Je veux faire un rapport classique
    Given en tant que BO
    And Je vais sur la page des rapports
    And je clique sur le bouton "Créer un rapport"
    And Je choisis le partenaire "lyra"
    And Je choisis l'export classique
    And Je rentre le nom du rapport
    And Je choisis le format CSV
    When je clique sur le bouton "Enregistrer"
    Then Je verifie la création du rapport

  Scenario: Je veux faire un rapport Dernier usage
    Given en tant que BO
    And Je vais sur la page des rapports
    And je clique sur le bouton "Créer un rapport"
    And Je choisis le partenaire "lyra"
    And Je choisis l'export dernier usage
    And Je rentre le nom du rapport
    And Je choisis le format CSV
    When je clique sur le bouton "Enregistrer"
    Then Je verifie la création du rapport

  Scenario: Je veux faire un rapport Export des services
    Given en tant que BO
    And Je vais sur la page des rapports
    And je clique sur le bouton "Créer un rapport"
    And Je choisis le partenaire "lyra"
    And Je choisis l'export Export des services
    And Je rentre le nom du rapport
    And Je choisis le format CSV
    When je clique sur le bouton "Enregistrer"
    Then Je verifie la création du rapport

  Scenario: Je veux faire un rapport personnalisé
    Given en tant que BO
    And Je vais sur la page des rapports
    And je clique sur le bouton "Créer un rapport"
    And Je choisis le partenaire "lyra"
    And Je choisis l'information technique ICCID
    And Je choisis l'information Dual SIM Dual ICCID
    And Je choisis l'information commerciale Nom de l'offre
    And Je choisis l'information de la commande ID de la commande
    And Je choisis la consommation Encours Data montant
    And Je choisis l'information dernier usage Statut de la derniere connexion data
    And Je choisis de generer le rapport hebdomadairement
    And Je supprime la derniere donnee depuis les donnees du rapport
    And Je rentre le nom du rapport
    And Je choisis le format CSV
    When je clique sur le bouton "Enregistrer"
    Then Je verifie la création du rapport

  Scenario: Je veux désactiver un rapport
    Given en tant que BO
    And Je vais sur la page des rapports
    And Je cree un rapport classique
    When Je desactive le rapport
    Then Je verifie que le rapport est bien desactive

  Scenario: Je vérifie l'apparition du panneau des détails du rapport en cliquant sur le nom
    Given en tant que BO
    And Je vais sur la page des rapports
    And Je cree un rapport classique
    When Je clique sur le nom du rapport
    Then Le panneau de detail est visible
    And Je ferme le panneau

  Scenario: Je vérifie l'apparition du panneau des détails du rapport en cliquant sur "Voir le détail" dans les actions
    Given en tant que BO
    And Je vais sur la page des rapports
    And Je cree un rapport classique
    When Je clique sur "Voir le detail" dans les actions
    Then Le panneau de detail est visible
    And Je ferme le panneau
