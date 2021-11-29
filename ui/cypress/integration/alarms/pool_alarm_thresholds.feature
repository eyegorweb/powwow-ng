Feature: Seuils des alarmes de flotte

  Tests sur les seuils des alarmes de flotte

  #Création

  @alarms @pool_alarm_thresholds @ignore
  Scenario: Je veux créer une alarme de sur-consommation de la flotte avec 2 seuils ETQU partenaire
    Given en tant que partenaire auchan
    And Je vais sur la page des alarmes
    And Je vais sur la page des alarmes mutualisées
    And je clique sur le bouton "Créer une alarme"
    And je choisis l'alarme de sur-consommation de la flotte
    And je choisis l'offre "Parc 2 forfait"
    And je configure le seuil de Data à 100% avant la fin du mois
    And j'ajoute un deuxième seuil à "80" avant le "25" du mois
    And je configure le seuil de SMS à 100% avant la fin du mois
    And j'ajoute un deuxième seuil à "80" avant le "25" du mois
    And je configure le seuil de Voix à 100% avant la fin du mois
    And j'ajoute un deuxième seuil à "80" avant le "25" du mois
    And je donne le nom "Test seuils alarmes flotte 01_001"
    When j'enregistre l'alarme
    Then je vérifie que les données de seuil du volet correspondent aux seuils rentrés

  @alarms @pool_alarm_thresholds @ignore
  Scenario: Je veux créer une alarme de sur-consommation de la flotte avec 3 seuils ETQU partenaire
    Given en tant que partenaire auchan
    And Je vais sur la page des alarmes
    And Je vais sur la page des alarmes mutualisées
    And je clique sur le bouton "Créer une alarme"
    And je choisis l'alarme de sur-consommation de la flotte
    And je choisis l'offre "Parc 2 forfait"
    And je configure le seuil de Data à 100% avant la fin du mois
    And j'ajoute un deuxième seuil à "80" avant le "25" du mois
    And j'ajoute un troisième seuil à "50" avant le "15" du mois
    And je configure le seuil de SMS à 100% avant la fin du mois
    And j'ajoute un deuxième seuil à "80" avant le "25" du mois
    And j'ajoute un troisième seuil à "50" avant le "15" du mois
    And je configure le seuil de Voix à 100% avant la fin du mois
    And j'ajoute un deuxième seuil à "80" avant le "25" du mois
    And j'ajoute un troisième seuil à "50" avant le "15" du mois
    And je donne le nom "Test seuils alarmes flotte 01_002"
    When j'enregistre l'alarme
    Then je vérifie que les données de seuil du volet correspondent aux seuils rentrés

  @alarms @pool_alarm_thresholds
  Scenario: Je veux créer une alarme de sur-consommation de la flotte avec 2 seuils ETQU BO
    Given en tant que BO
    And Je vais sur la page des alarmes
    And Je vais sur la page des alarmes mutualisées
    And je clique sur le bouton "Créer une alarme"
    And je choisis l'alarme de sur-consommation de la flotte
    And je choisis le partenaire "auchan"
    And je choisis l'offre "26_10"
    And je configure le seuil de Data à 100% avant la fin du mois
    And j'ajoute un deuxième seuil à "80" avant le "25" du mois
    And je configure le seuil de SMS à 100% avant la fin du mois
    And j'ajoute un deuxième seuil à "80" avant le "25" du mois
    And je configure le seuil de Voix à 100% avant la fin du mois
    And j'ajoute un deuxième seuil à "80" avant le "25" du mois
    And je donne le nom "Test seuils alarmes flotte 01_003"
    When j'enregistre l'alarme
    Then je vérifie que les données de seuil du volet correspondent aux seuils rentrés

  @alarms @pool_alarm_thresholds
  Scenario: Je veux créer une alarme de sur-consommation de la flotte avec 3 seuils ETQU BO
    Given en tant que BO
    And Je vais sur la page des alarmes
    And Je vais sur la page des alarmes mutualisées
    And je clique sur le bouton "Créer une alarme"
    And je choisis l'alarme de sur-consommation de la flotte
    And je choisis le partenaire "auchan"
    And je choisis l'offre "26_10"
    And je configure le seuil de Data à 100% avant la fin du mois
    And j'ajoute un deuxième seuil à "80" avant le "25" du mois
    And j'ajoute un troisième seuil à "50" avant le "15" du mois
    And je configure le seuil de SMS à 100% avant la fin du mois
    And j'ajoute un deuxième seuil à "80" avant le "25" du mois
    And j'ajoute un troisième seuil à "50" avant le "15" du mois
    And je configure le seuil de Voix à 100% avant la fin du mois
    And j'ajoute un deuxième seuil à "80" avant le "25" du mois
    And j'ajoute un troisième seuil à "50" avant le "15" du mois
    And je donne le nom "Test seuils alarmes flotte 01_004"
    When j'enregistre l'alarme
    Then je vérifie que les données de seuil du volet correspondent aux seuils rentrés

  #Modification

  @alarms @pool_alarm_thresholds @ignore
  Scenario: Je veux modifier les seuils d'une alarme de sur-consommation de la flotte ETQU partenaire
    Given en tant que partenaire auchan
    And Je vais sur la page des alarmes
    And Je vais sur la page des alarmes mutualisées
    And je clique sur le bouton "Créer une alarme"
    And je choisis l'alarme de sur-consommation de la flotte
    And je choisis l'offre "Parc 2 forfait"
    And je configure le seuil de Data à 100% avant la fin du mois
    And j'ajoute un deuxième seuil à "75" avant le "24" du mois
    And je configure le seuil de SMS à 100% avant la fin du mois
    And j'ajoute un deuxième seuil à "75" avant le "24" du mois
    And je configure le seuil de Voix à 100% avant la fin du mois
    And j'ajoute un deuxième seuil à "75" avant le "24" du mois
    And je donne le nom "Test seuils alarmes flotte 02_001"
    And j'enregistre l'alarme
    And je clique sur l'ID de l'alarme créée
    And je clique sur le bouton "Modifier l’alarme"
    And je modifie le deuxième seuil à "80" avant le "25" du mois
    And je vais sur l'onglet SMS
    And je modifie le deuxième seuil à "80" avant le "25" du mois
    And je vais sur l'onglet Voix
    And je modifie le deuxième seuil à "80" avant le "25" du mois
    When j'enregistre l'alarme
    Then je vérifie que les données de seuil du volet correspondent aux seuils rentrés

  @alarms @pool_alarm_thresholds @ignore
  Scenario: Je veux ajouter un seuil sur une alarme de sur-consommation de la flotte ETQU partenaire
    Given en tant que partenaire auchan
    And Je vais sur la page des alarmes
    And Je vais sur la page des alarmes mutualisées
    And je clique sur le bouton "Créer une alarme"
    And je choisis l'alarme de sur-consommation de la flotte
    And je choisis l'offre "Parc 2 forfait"
    And je configure le seuil de Data à 100% avant la fin du mois
    And je configure le seuil de SMS à 100% avant la fin du mois
    And je configure le seuil de Voix à 100% avant la fin du mois
    And je donne le nom "Test seuils alarmes flotte 02_002"
    And j'enregistre l'alarme
    And je clique sur l'ID de l'alarme créée
    And je clique sur le bouton "Modifier l’alarme"
    And j'ajoute un deuxième seuil à "80" avant le "25" du mois
    And je vais sur l'onglet SMS
    And j'ajoute un deuxième seuil à "80" avant le "25" du mois
    And je vais sur l'onglet Voix
    And j'ajoute un deuxième seuil à "80" avant le "25" du mois
    When j'enregistre l'alarme
    Then je vérifie que les données de seuil du volet correspondent aux seuils rentrés

  @alarms @pool_alarm_thresholds @ignore
  Scenario: Je veux ajouter deux seuils sur une alarme de sur-consommation de la flotte ETQU partenaire
    Given en tant que partenaire auchan
    And Je vais sur la page des alarmes
    And Je vais sur la page des alarmes mutualisées
    And je clique sur le bouton "Créer une alarme"
    And je choisis l'alarme de sur-consommation de la flotte
    And je choisis l'offre "Parc 2 forfait"
    And je configure le seuil de Data à 100% avant la fin du mois
    And je configure le seuil de SMS à 100% avant la fin du mois
    And je configure le seuil de Voix à 100% avant la fin du mois
    And je donne le nom "Test seuils alarmes flotte 02_003"
    And j'enregistre l'alarme
    And je clique sur l'ID de l'alarme créée
    And je clique sur le bouton "Modifier l’alarme"
    And j'ajoute un deuxième seuil à "80" avant le "25" du mois
    And j'ajoute un troisième seuil à "50" avant le "15" du mois
    And je vais sur l'onglet SMS
    And j'ajoute un deuxième seuil à "80" avant le "25" du mois
    And j'ajoute un troisième seuil à "50" avant le "15" du mois
    And je vais sur l'onglet Voix
    And j'ajoute un deuxième seuil à "80" avant le "25" du mois
    And j'ajoute un troisième seuil à "50" avant le "15" du mois
    When j'enregistre l'alarme
    Then je vérifie que les données de seuil du volet correspondent aux seuils rentrés

  @alarms @pool_alarm_thresholds
  Scenario: Je veux modifier les seuils d'une alarme de sur-consommation de la flotte ETQU BO
    Given en tant que BO
    And Je vais sur la page des alarmes
    And Je vais sur la page des alarmes mutualisées
    And je clique sur le bouton "Créer une alarme"
    And je choisis l'alarme de sur-consommation de la flotte
    And je choisis le partenaire "auchan"
    And je choisis l'offre "26_10"
    And je configure le seuil de Data à 100% avant la fin du mois
    And j'ajoute un deuxième seuil à "75" avant le "24" du mois
    And je configure le seuil de SMS à 100% avant la fin du mois
    And j'ajoute un deuxième seuil à "75" avant le "24" du mois
    And je configure le seuil de Voix à 100% avant la fin du mois
    And j'ajoute un deuxième seuil à "75" avant le "24" du mois
    And je donne le nom "Test seuils alarmes flotte 02_001"
    And j'enregistre l'alarme
    And je clique sur l'ID de l'alarme créée
    And je clique sur le bouton "Modifier l’alarme"
    And je modifie le deuxième seuil à "80" avant le "25" du mois
    And je vais sur l'onglet SMS
    And je modifie le deuxième seuil à "80" avant le "25" du mois
    And je vais sur l'onglet Voix
    And je modifie le deuxième seuil à "80" avant le "25" du mois
    When j'enregistre l'alarme
    Then je vérifie que les données de seuil du volet correspondent aux seuils rentrés

  @alarms @pool_alarm_thresholds
  Scenario: Je veux ajouter un seuil sur une alarme de sur-consommation de la flotte ETQU BO
    Given en tant que BO
    And Je vais sur la page des alarmes
    And Je vais sur la page des alarmes mutualisées
    And je clique sur le bouton "Créer une alarme"
    And je choisis l'alarme de sur-consommation de la flotte
    And je choisis le partenaire "auchan"
    And je choisis l'offre "26_10"
    And je configure le seuil de Data à 100% avant la fin du mois
    And je configure le seuil de SMS à 100% avant la fin du mois
    And je configure le seuil de Voix à 100% avant la fin du mois
    And je donne le nom "Test seuils alarmes flotte 02_005"
    And j'enregistre l'alarme
    And je clique sur l'ID de l'alarme créée
    And je clique sur le bouton "Modifier l’alarme"
    And j'ajoute un deuxième seuil à "80" avant le "25" du mois
    And je vais sur l'onglet SMS
    And j'ajoute un deuxième seuil à "80" avant le "25" du mois
    And je vais sur l'onglet Voix
    And j'ajoute un deuxième seuil à "80" avant le "25" du mois
    When j'enregistre l'alarme
    Then je vérifie que les données de seuil du volet correspondent aux seuils rentrés

  @alarms @pool_alarm_thresholds
  Scenario: Je veux ajouter deux seuils sur une alarme de sur-consommation de la flotte ETQU BO
    Given en tant que BO
    And Je vais sur la page des alarmes
    And Je vais sur la page des alarmes mutualisées
    And je clique sur le bouton "Créer une alarme"
    And je choisis l'alarme de sur-consommation de la flotte
    And je choisis le partenaire "auchan"
    And je choisis l'offre "26_10"
    And je configure le seuil de Data à 100% avant la fin du mois
    And je configure le seuil de SMS à 100% avant la fin du mois
    And je configure le seuil de Voix à 100% avant la fin du mois
    And je donne le nom "Test seuils alarmes flotte 02_006"
    And j'enregistre l'alarme
    And je clique sur l'ID de l'alarme créée
    And je clique sur le bouton "Modifier l’alarme"
    And j'ajoute un deuxième seuil à "80" avant le "25" du mois
    And j'ajoute un troisième seuil à "50" avant le "15" du mois
    And je vais sur l'onglet SMS
    And j'ajoute un deuxième seuil à "80" avant le "25" du mois
    And j'ajoute un troisième seuil à "50" avant le "15" du mois
    And je vais sur l'onglet Voix
    And j'ajoute un deuxième seuil à "80" avant le "25" du mois
    And j'ajoute un troisième seuil à "50" avant le "15" du mois
    When j'enregistre l'alarme
    Then je vérifie que les données de seuil du volet correspondent aux seuils rentrés

  #Suppression

  @alarms @pool_alarm_thresholds @ignore
  Scenario: Je veux supprimer un seuil d'une alarme de sur-consommation de la flotte ETQU partenaire
    Given en tant que partenaire auchan
    And Je vais sur la page des alarmes
    And Je vais sur la page des alarmes mutualisées
    And je clique sur le bouton "Créer une alarme"
    And je choisis l'alarme de sur-consommation de la flotte
    And je choisis l'offre "Parc 2 forfait"
    And je configure le seuil de Data à 100% avant la fin du mois
    And j'ajoute un deuxième seuil à "80" avant le "25" du mois
    And je configure le seuil de SMS à 100% avant la fin du mois
    And j'ajoute un deuxième seuil à "80" avant le "25" du mois
    And je configure le seuil de Voix à 100% avant la fin du mois
    And j'ajoute un deuxième seuil à "80" avant le "25" du mois
    And je donne le nom "Test seuils alarmes flotte 03_001"
    And j'enregistre l'alarme
    And je clique sur l'ID de l'alarme créée
    And je clique sur le bouton "Modifier l’alarme"
    And je supprime le deuxième seuil de Data
    And je supprime le deuxième seuil de SMS
    And je supprime le deuxième seuil de Voix
    When j'enregistre l'alarme
    Then je vérifie que les données de seuil du volet correspondent aux seuils rentrés

  @alarms @pool_alarm_thresholds
  Scenario: Je veux supprimer un seuil d'une alarme de sur-consommation de la flotte ETQU BO
    Given en tant que BO
    And Je vais sur la page des alarmes
    And Je vais sur la page des alarmes mutualisées
    And je clique sur le bouton "Créer une alarme"
    And je choisis l'alarme de sur-consommation de la flotte
    And je choisis le partenaire "auchan"
    And je choisis l'offre "26_10"
    And je configure le seuil de Data à 100% avant la fin du mois
    And j'ajoute un deuxième seuil à "80" avant le "25" du mois
    And je configure le seuil de SMS à 100% avant la fin du mois
    And j'ajoute un deuxième seuil à "80" avant le "25" du mois
    And je configure le seuil de Voix à 100% avant la fin du mois
    And j'ajoute un deuxième seuil à "80" avant le "25" du mois
    And je donne le nom "Test seuils alarmes flotte 03_002"
    And j'enregistre l'alarme
    And je clique sur l'ID de l'alarme créée
    And je clique sur le bouton "Modifier l’alarme"
    And je supprime le deuxième seuil de Data
    And je supprime le deuxième seuil de SMS
    And je supprime le deuxième seuil de Voix
    When j'enregistre l'alarme
    Then je vérifie que les données de seuil du volet correspondent aux seuils rentrés
