Feature: Modification d'alarmes

  Je veux créer puis modifier des alarmes

  Scenario: Je modifie une alarme de sur-consommation de la flotte
    Given en tant que BO
    And Je vais sur la page des alarmes
    And Je vais sur la page des alarmes mutualisées
    And j'enregistre le nom de l'alarme "TEST POUR MODIF sur-consommation de la flotte"
    And je créé une alarme de sur-consommation de la flotte par défaut "TEST POUR MODIF sur-consommation de la flotte"
    And je valide la création
    And je clique sur l'ID de cette alarme
    And je clique sur le bouton "Modifier l’alarme"
    And je modifie le nom de l'alarme par "TEST MODIF sur-consommation de la flotte"
    When je valide la création
    Then je vérifie la modification du nom de l'alarme mutualisée

  Scenario: Je modifie une alarme de sur-consommation par défaut
    Given en tant que BO
    And Je vais sur la page des alarmes
    And j'enregistre le nom de l'alarme "TEST POUR MODIF sur-consommation"
    And je créé une alarme de sur-consommation par défaut "TEST POUR MODIF sur-consommation"
    And je valide la création
    And je clique sur l'ID de cette alarme
    And je clique sur le bouton "Modifier l’alarme"
    And je modifie le nom de l'alarme par "TEST MODIF sur-consommation"
    When je valide la création
    Then je vérifie la modification du nom de l'alarme

  Scenario: Je modifie une alarme de sous-consommation par défaut
    Given en tant que BO
    And Je vais sur la page des alarmes
    And j'enregistre le nom de l'alarme "TEST POUR MODIF sous-consommation"
    And je créé une alarme de sous-consommation par défaut "TEST POUR MODIF sous-consommation"
    And je valide la création
    And je clique sur l'ID de cette alarme
    And je clique sur le bouton "Modifier l’alarme"
    And je modifie le nom de l'alarme par "TEST MODIF sous-consommation"
    When je valide la création
    Then je vérifie la modification du nom de l'alarme

  Scenario: Je modifie une alarme de changement d'opérateur par défaut
    Given en tant que BO
    And Je vais sur la page des alarmes
    And j'enregistre le nom de l'alarme "TEST POUR MODIF changement d'opérateur"
    And je créé une alarme de changement d'opérateur par défaut "TEST POUR MODIF changement d'opérateur"
    And je valide la création
    And je clique sur l'ID de cette alarme
    And je clique sur le bouton "Modifier l’alarme"
    And je modifie le nom de l'alarme par "TEST MODIF changement d'opérateur"
    When je valide la création
    Then je vérifie la modification du nom de l'alarme

  Scenario: Je modifie une alarme de changement de statut par défaut
    Given en tant que BO
    And Je vais sur la page des alarmes
    And j'enregistre le nom de l'alarme "TEST POUR MODIF changement de statut"
    And je créé une alarme de changement de statut par défaut "TEST POUR MODIF changement de statut"
    And je valide la création
    And je clique sur l'ID de cette alarme
    And je clique sur le bouton "Modifier l’alarme"
    And je modifie le nom de l'alarme par "TEST MODIF changement de statut"
    When je valide la création
    Then je vérifie la modification du nom de l'alarme

  Scenario: Je modifie une alarme de changement de changement de statut de profil par défaut
    Given en tant que BO
    And Je vais sur la page des alarmes
    And j'enregistre le nom de l'alarme "TEST POUR MODIF changement de statut de profil"
    And je créé une alarme de changement de statut de profil par défaut "TEST POUR MODIF changement de statut de profil"
    And je valide la création
    And je clique sur l'ID de cette alarme
    And je vérifie que les données Partenaire "LYRA NETWORK" et Portée "Partenaire" sont correctement préremplies
    And je clique sur le bouton "Modifier l’alarme"
    And je vérifie que je ne peux pas modifier le partenaire et la portée
    And je modifie le nom de l'alarme par "TEST MODIF changement de statut de profil"
    When je valide la création
    Then je vérifie la modification du nom de l'alarme

  Scenario: Je modifie une alarme de changement de module par défaut
    Given en tant que BO
    And Je vais sur la page des alarmes
    And j'enregistre le nom de l'alarme "TEST POUR MODIF changement de module"
    And je créé une alarme de changement de module par défaut "TEST POUR MODIF changement de module"
    And je valide la création
    And je clique sur l'ID de cette alarme
    And je clique sur le bouton "Modifier l’alarme"
    And je modifie le nom de l'alarme par "TEST MODIF changement de module"
    When je valide la création
    Then je vérifie la modification du nom de l'alarme

  Scenario: Je modifie une alarme de changement de pays par défaut
    Given en tant que BO
    And Je vais sur la page des alarmes
    And j'enregistre le nom de l'alarme "TEST POUR MODIF changement de pays"
    And je créé une alarme de changement de pays par défaut "TEST POUR MODIF changement de pays"
    And je valide la création
    And je clique sur l'ID de cette alarme
    And je clique sur le bouton "Modifier l’alarme"
    And je modifie le nom de l'alarme par "TEST MODIF changement de pays"
    When je valide la création
    Then je vérifie la modification du nom de l'alarme
