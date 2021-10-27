Feature: Détails d'une ligne

  Je veux tester le detail des lignes

  Scenario: Je veux vérifier l'en cours d'une ligne activée
    Given en tant que BO
    And Je vais sur la page des lignes
    And je lance la recherche par ID "33669497435"
    And j'ouvre le panneau de détail de la ligne
    When je clique sur le bouton "Voir l'en-cours"
    Then la table de l'en-cours existe
    And je clique sur le bouton "Retour"

  Scenario: Je veux vérifier l'en cours d'une ligne non-activée
    Given en tant que BO
    And Je vais sur la page des lignes
    And je lance la recherche par ID "8933209512007559906"
    And j'ouvre le panneau de détail de la ligne
    When je clique sur le bouton "Voir l'en-cours"
    Then la table de l'en-cours n'existe pas
    And je clique sur le bouton "Retour"

  Scenario: Je veux vérifier la navigation entre les differents onglets dans le détail d'une ligne
    Given en tant que BO
    And Je vais sur la page des lignes
    And je lance la recherche par ID "33669497435"
    And j'ouvre le panneau de détail de la ligne
    When je clique sur le bouton "Voir le détail de la ligne"
    Then Je peux naviguer entre les differents onglets
    And je clique sur le bouton "Retour"

  Scenario: Je veux vérifier le clickable des boutons dans le détail d'une ligne activée
    Given en tant que BO
    And Je vais sur la page des lignes
    And je lance la recherche par ID "8933203494859102801"
    And j'ouvre le panneau de détail de la ligne
    When je clique sur le bouton "Voir le détail de la ligne"
    Then Je peux cliquer sur les boutons et les panneaux s'ouvrent
    And je clique sur le bouton "Retour"

  Scenario: Je veux vérifier le non clickable des boutons dans le détail d'une ligne non activée
    Given en tant que BO
    And Je vais sur la page des lignes
    And je lance la recherche par ID "8933209512007559906"
    And j'ouvre le panneau de détail de la ligne
    When je clique sur le bouton "Voir le détail de la ligne"
    Then Je verifie que les boutons ne sont pas clickable
    And je clique sur le bouton "Retour"

  Scenario: Je veux vérifier la presence du tableau de consommation dans le détail d'une ligne activée
    Given en tant que BO
    And Je vais sur la page des lignes
    And je lance la recherche par ID "33669497435"
    And j'ouvre le panneau de détail de la ligne
    When je clique sur le bouton "Voir le détail de la ligne"
    Then Le tableau de consommation est present dans l'onglet "EN COURS DE CONSOMMATION"
    And je clique sur le bouton "Retour"

  Scenario: Je veux vérifier la navigation entre les différents menus dans l'onglet d'analyse d'une ligne activée
    Given en tant que BO
    And Je vais sur la page des lignes
    And je lance la recherche par ID "33669497435"
    And j'ouvre le panneau de détail de la ligne
    When je clique sur le bouton "Voir le détail de la ligne"
    Then Je peux cliquer sur les differents menus de l'onglet d'analyse
    And je clique sur le bouton "Retour"

  Scenario: Je veux vérifier la présence du message d'avertissement dans les onglets de consommation et d'analyse dans le détail d'une ligne non activée
    Given en tant que BO
    And Je vais sur la page des lignes
    And je lance la recherche par ID "8933209512007559906"
    And j'ouvre le panneau de détail de la ligne
    When je clique sur le bouton "Voir le détail de la ligne"
    Then Le message d'avertissement est present dans les onglets de consommation et d'analyse
    And je clique sur le bouton "Retour"

  Scenario: Je veux vérifier le changement de carte SIM
    Given en tant que BO
    And Je vais sur la page des lignes
    And je lance la recherche par ID "8933203494859102801"
    And j'ouvre le panneau de détail de la ligne
    And je clique sur le bouton "Voir le détail de la ligne"
    And Je clique sur le bouton "Changer de carte SIM"
    And Je rentre le nouvel ICCID "8933209519078857391"
    When je clique sur le bouton "Appliquer"
    Then Je confirme le changement
    And je clique sur le bouton "Retour"

  Scenario: Je veux vérifier le changement de MSISDN
    Given en tant que BO
    And Je vais sur la page des lignes
    And je lance la recherche par ID "8933203494859102801"
    And j'ouvre le panneau de détail de la ligne
    And je clique sur le bouton "Voir le détail de la ligne"
    And Je clique sur le bouton "Changer de MSISDN"
    And Je rentre le nouvel MSISDN "337000039585078"
    When je clique sur le bouton "Appliquer"
    Then Je confirme le changement
    And je clique sur le bouton "Retour"

  @ignore
  Scenario: Je veux vérifier le changement de CF
    Given en tant que BO
    And Je vais sur la page des lignes
    And je lance la recherche par ID "8933203494859102801"
    And j'ouvre le panneau de détail de la ligne
    And je clique sur le bouton "Voir le détail de la ligne"
    And Je clique sur le bouton "Changement de C.F."
    And Je selectionne le compte "TEST"
    When je clique sur le bouton "Appliquer"
    Then Je confirme le changement
    And je clique sur le bouton "Retour"

  Scenario: Je veux vérifier le changement d'offre
    Given en tant que BO
    And Je vais sur la page des lignes
    And je lance la recherche par ID "8933203494859102801"
    And j'ouvre le panneau de détail de la ligne
    And je clique sur le bouton "Voir le détail de la ligne"
    And Je clique sur le bouton "Changer d'offre"
    And Je selectionne l'offre "Parc 2 forfait"
    When je clique sur le bouton "Appliquer"
    Then Je confirme le changement

  Scenario: Je veux ouvrir l'historique de déclenchement d'une alarme activée
    Given en tant que BO
    And Je vais sur la page des lignes
    And je lance la recherche par ID "33669497435"
    And j'ouvre le panneau de détail de la ligne
    And je clique sur le bouton "Voir le détail de la ligne"
    And Je clique sur "Liste des alarmes"
    When Je clique sur "Oui" dans la deuxieme ligne dans la colonne "Declenchement"
    Then Le panneau s'est ouvert
    And je clique sur le bouton "Retour"

  Scenario: Je veux ouvrir la modification d'alarme en cliquant sur l'ID d'une alarme
    Given en tant que BO
    And Je vais sur la page des lignes
    And je lance la recherche par ID "33669497435"
    And j'ouvre le panneau de détail de la ligne
    And je clique sur le bouton "Voir le détail de la ligne"
    And Je clique sur "Liste des alarmes"
    When Je clique sur l'ID de la premiere alarme
    Then Le panneau s'est ouvert
    And je clique sur le bouton "Retour"

  Scenario: Je veux ouvrir la création d'alarme
    Given en tant que BO
    And Je vais sur la page des lignes
    And je lance la recherche par ID "33669497435"
    And j'ouvre le panneau de détail de la ligne
    And je clique sur le bouton "Voir le détail de la ligne"
    And Je clique sur "Liste des alarmes"
    When je clique sur le bouton "Créer une alarme"
    Then Le panneau s'est ouvert
    And je clique sur le bouton "Retour"

  Scenario: Je veux ouvrir l'acte de masse d'un acte de gestion
    Given en tant que BO
    And Je vais sur la page des lignes
    And je lance la recherche par ID "8933203494859102801"
    And j'ouvre le panneau de détail de la ligne
    And je clique sur le bouton "Voir le détail de la ligne"
    And Je clique sur "Suivi pilotage des actes de gestion"
    When Je clique sur l'acte de masse de la premiere ligne
    Then Le panneau s'est ouvert
    And je clique sur le bouton "Retour"

  Scenario: Je veux ouvrir la page de l'acte de gestion en cliquant sur "Voir le résultat de l'acte" dans le panneau
    Given en tant que BO
    And Je vais sur la page des lignes
    And je lance la recherche par ID "8933203494859102801"
    And j'ouvre le panneau de détail de la ligne
    And je clique sur le bouton "Voir le détail de la ligne"
    And Je clique sur "Suivi pilotage des actes de gestion"
    When Je clique sur l'acte de masse de la premiere ligne
    And je clique sur le bouton "Voir le résultat de l'acte"
    Then La page de l'acte de gestion s'est ouverte
    And je clique sur le bouton "Retour"

  Scenario: Je veux ouvrir la page de détail d'un acte de gestion puis retour sur le détail de ligne après avoir cliquer sur le bouton retour
    Given en tant que BO
    And Je vais sur la page des lignes
    And je lance la recherche par ID "33698014672"
    And j'ouvre le panneau de détail de la ligne
    And je clique sur le bouton "Voir le détail de la ligne"
    And Je clique sur "Suivi pilotage des actes de gestion"
    And Je clique sur l'acte de masse de la premiere ligne
    And je clique sur le bouton "Voir le résultat de l'acte"
    And Je vérifie que l'url contient "/act-detail/"
    When je clique sur le bouton "Retour"
    Then Je vérifie que l'url contient "/line-detail/"
