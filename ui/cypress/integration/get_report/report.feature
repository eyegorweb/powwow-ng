Feature: test des rapports

  Je veux tester les rapports

  Scenario: Je veux faire un rapport classique
    Given en tant que BO
    And Je suis sur la page de gestion des rapports
    And Je clique sur "Créer un rapport"
    And Je choisis le partenaire "lyra"
    And Je choisis l'export classique
    And Je rentre le nom du rapport
    And Je choisis le format CSV
    When Je clique sur "Enregistrer"
    Then Je verifie la création du rapport

  Scenario: Je veux faire un rapport Dernier usage
    Given en tant que BO
    And Je suis sur la page de gestion des rapports
    And Je clique sur "Créer un rapport"
    And Je choisis le partenaire "lyra"
    And Je choisis l'export dernier usage
    And Je rentre le nom du rapport
    And Je choisis le format CSV
    When Je clique sur "Enregistrer"
    Then Je verifie la création du rapport

  Scenario: Je veux faire un rapport Export des services
    Given en tant que BO
    And Je suis sur la page de gestion des rapports
    And Je clique sur "Créer un rapport"
    And Je choisis le partenaire "lyra"
    And Je choisis l'export Export des services
    And Je rentre le nom du rapport
    And Je choisis le format CSV
    When Je clique sur "Enregistrer"
    Then Je verifie la création du rapport

  Scenario: Je veux faire un rapport personnalise
    Given en tant que BO
    And Je suis sur la page de gestion des rapports
    And Je clique sur "Créer un rapport"
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
    When Je clique sur "Enregistrer"
    Then Je verifie la création du rapport

  Scenario: Je veux desactiver un rapport
    Given en tant que BO
    And Je suis sur la page de gestion des rapports
    And Je cree un rapport classique
    When Je desactive le rapport
    Then Je verifie que le rapport est bien desactive

  Scenario: Je verifie l'apparition du panneau des details du rapport en cliquant sur le nom
    Given en tant que BO
    And Je suis sur la page de gestion des rapports
    And Je cree un rapport classique
    When Je clique sur le nom du rapport
    Then Le panneau de detail est visible

  Scenario: Je verifie l'apparition du panneau des details du rapport en cliquant sur "Voir le detail" dans les actions
    Given en tant que BO
    And Je suis sur la page de gestion des rapports
    And Je cree un rapport classique
    When Je clique sur "Voir le detail" dans les actions
    Then Le panneau de detail est visible
