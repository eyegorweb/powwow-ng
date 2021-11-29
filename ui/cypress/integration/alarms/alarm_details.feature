Feature: Détails d'une alarme

  @alarms @alarm_details
  Scenario: Je vérifie que la page de détail de l'alarme créée est correcte
    Given en tant que BO
    And Je vais sur la page des alarmes
    And je créé une alarme de sur-consommation par défaut "TEST DETAILS sur-consommation"
    And je valide la création
    When je suis sur la page de détail de l'alarme créée
    Then la page de détail correspong à l'alarme créée

  @alarms @alarm_details
  Scenario: Je peux naviguer entre les différents onglets de la page de détail de l'alarme créée
    Given en tant que BO
    And Je vais sur la page des alarmes
    And je créé une alarme de sur-consommation par défaut "TEST DETAILS sur-consommation - naviguation"
    And je valide la création
    When je suis sur la page de détail de l'alarme créée
    Then je peux naviguer entre les différents onglets

  @alarms @alarm_details
  Scenario: Je fais une recherche par filtre depuis l'onglet DECLENCHEMENTS DANS LE MOIS
    Given en tant que BO
    And Je vais sur la page des alarmes
    And je créé une alarme de sur-consommation par défaut "TEST DETAILS sur-consommation - filtre : déclenchement dans le mois"
    And je valide la création
    And je suis sur la page détail de l'alarme créée
    And je choisis les alarmes "DÉCLENCHEMENTS DANS LE MOIS"
    When je filtre par motif de déclenchement "DATA"
    Then la table contient "0" résultats

  @alarms @alarm_details
  Scenario: Je fais une recherche par filtre depuis l'onglet LIGNES CIBLEES PAR L'ALARME
    Given en tant que BO
    And Je vais sur la page des alarmes
    And je créé une alarme de sur-consommation par défaut "TEST DETAILS sur-consommation - filtre : lignes ciblées par l'alarme"
    And je valide la création
    And je suis sur la page détail de l'alarme créée
    And je choisis les alarmes "LIGNES CIBLÉES PAR L'ALARMES"
    When je filtre par motif de déclenchement "DATA"
    Then la table contient "0" résultats

  @alarms @alarm_details
  Scenario: Je fais une recherche par filtre depuis l'onglet LIGNES EXCLUES
    Given en tant que BO
    And Je vais sur la page des alarmes
    And je créé une alarme de sur-consommation par défaut "TEST DETAILS sur-consommation - filtre : lignes exclues"
    And je valide la création
    And je suis sur la page détail de l'alarme créée
    And je choisis les alarmes "LIGNES EXCLUES"
    And je filtre par compte de facturation
    When je filtre par offre "Parc 2 forfait"
    Then la table contient "0" résultats

  @alarms @alarm_details
  Scenario: Je réactive l'alarme des lignes sélectionées
    Given en tant que BO
    And Je vais sur la page des alarmes
    And je créé une alarme de sur-consommation par défaut "TEST DETAILS sur-consommation - réactivation de l'alarme"
    And je valide la création
    And je suis sur la page détail de l'alarme créée
    And je choisis les alarmes "LIGNES EXCLUES"
    And je sélectionne la première lignes
    When je clique sur "Réactiver l'alarme des lignes"
    Then je peux confirmer la réactivation

  @alarms @alarm_details @ignore
  Scenario: Je fais un export des alarmes (depuis l'onglet DÉCLENCHEMENTS DANS LE MOIS)
    Given en tant que BO
    And Je vais sur la page des alarmes
    And je créé une alarme de sur-consommation par défaut "TEST DETAILS sur-consommation - export : déclenchements dans le mois"
    And je valide la création
    And je suis sur la page détail de l'alarme créée
    And je choisis les alarmes "DÉCLENCHEMENTS DANS LE MOIS"
    When je lance un Export des lignes
    Then l'export des déclenchemets dans le mois est bien téléchargé

  @alarms @alarm_details @ignore
  Scenario: Je fais un export des alarmes (depuis l'onglet LIGNES CIBLÉES PAR L'ALARME)
    Given en tant que BO
    And Je vais sur la page des alarmes
    And je créé une alarme de sur-consommation par défaut "TEST DETAILS sur-consommation - export : lignes ciblées par l'alarme"
    And je valide la création
    And je suis sur la page détail de l'alarme créée
    And je choisis les alarmes "LIGNES CIBLÉES PAR L'ALARME"
    When je lance un Export des lignes
    Then l'export des lignes ciblées est bien téléchargé

  @alarms @alarm_details @ignore
  Scenario: Je fais un export des alarmes (depuis l'onglet LIGNES EXCLUES)
    Given en tant que BO
    And Je vais sur la page des alarmes
    And je créé une alarme de sur-consommation par défaut "TEST DETAILS sur-consommation - export : lignes exclues"
    And je valide la création
    And je suis sur la page détail de l'alarme créée
    And je choisis les alarmes "LIGNES EXCLUES"
    When je lance un Export des lignes
    Then l'export des lignes exclues est bien téléchargé
