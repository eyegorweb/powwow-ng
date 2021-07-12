Feature: detail des lignes

  Je veux tester le detail des lignes

  Scenario: je veux verifier l'en cours d'une ligne activée
    Given en tant que BO
    And Je suis sur la page de gestion de lignes
    And je lance la recherche par ID "33669497435"
    And j'ouvre le panneau de détail de la ligne
    When je clique sur voir l'en-cours
    Then la table de l'en-cours existe

  Scenario: je veux verifier l'en cours d'une ligne non-activée
    Given en tant que BO
    And Je suis sur la page de gestion de lignes
    And je lance la recherche par ID "8933209512007559906"
    And j'ouvre le panneau de détail de la ligne
    When je clique sur voir l'en-cours
    Then la table de l'en-cours n'existe pas

  Scenario: Verification de la navigation entre les differents onglets dans le detail d'une ligne
    Given en tant que BO
    And Je suis sur la page de gestion de lignes
    And je lance la recherche par ID "33669497435"
    And j'ouvre le panneau de détail de la ligne
    When Je clique sur "Voir le detail de la ligne"
    Then Je peux naviguer entre les differents onglets

  Scenario: Verification du clickable des boutons dans le detail d'une ligne activee
    Given en tant que BO
    And Je suis sur la page de gestion de lignes
    And je lance la recherche par ID "8933203494859102801"
    And j'ouvre le panneau de détail de la ligne
    When Je clique sur "Voir le detail de la ligne"
    Then Je peux cliquer sur les boutons et les panneaux s'ouvrent

  Scenario: Verification du non clickable des boutons dans le detail d'une ligne non activee
    Given en tant que BO
    And Je suis sur la page de gestion de lignes
    And je lance la recherche par ID "8933209512007559906"
    And j'ouvre le panneau de détail de la ligne
    When Je clique sur "Voir le detail de la ligne"
    Then Je verifie que les boutons ne sont pas clickable

  Scenario: Verification de la presence du tableau de consommation dans le detail d'une ligne activee
    Given en tant que BO
    And Je suis sur la page de gestion de lignes
    And je lance la recherche par ID "33669497435"
    And j'ouvre le panneau de détail de la ligne
    When Je clique sur "Voir le detail de la ligne"
    Then Le tableau de consommation est present dans l'onglet "EN COURS DE CONSOMMATION"

  Scenario: Verification de la navigation entre les differents menus dans l'onglet d'analyse d'une ligne activee
    Given en tant que BO
    And Je suis sur la page de gestion de lignes
    And je lance la recherche par ID "33669497435"
    And j'ouvre le panneau de détail de la ligne
    When Je clique sur "Voir le detail de la ligne"
    Then Je peux cliquer sur les differents menus de l'onglet d'analyse

  Scenario: Verification de la presence du message d'avertissement dans les onglets de consommation et d'analyse dans le detail d'une ligne non activee
    Given en tant que BO
    And Je suis sur la page de gestion de lignes
    And je lance la recherche par ID "8933209512007559906"
    And j'ouvre le panneau de détail de la ligne
    When Je clique sur "Voir le detail de la ligne"
    Then Le message d'avertissement est present dans les onglets de consommation et d'analyse

  Scenario: Verification du changement de carte SIM
    Given en tant que BO
    And Je suis sur la page de gestion de lignes
    And je lance la recherche par ID "8933203494859102801"
    And j'ouvre le panneau de détail de la ligne
    And Je clique sur "Voir le detail de la ligne"
    And Je clique sur le bouton "Changer de carte SIM"
    And Je rentre le nouvel ICCID "8933209519078857391"
    When Je clique sur le bouton "Appliquer"
    Then Je confirme le changement

  Scenario: Verification du changement de MSISDN
    Given en tant que BO
    And Je suis sur la page de gestion de lignes
    And je lance la recherche par ID "8933203494859102801"
    And j'ouvre le panneau de détail de la ligne
    And Je clique sur "Voir le detail de la ligne"
    And Je clique sur le bouton "Changer de MSISDN"
    And Je rentre le nouvel MSISDN "337000039585078"
    When Je clique sur le bouton "Appliquer"
    Then Je confirme le changement

  Scenario: Verification du changement de CF
    Given en tant que BO
    And Je suis sur la page de gestion de lignes
    And je lance la recherche par ID "8933203494859102801"
    And j'ouvre le panneau de détail de la ligne
    And Je clique sur "Voir le detail de la ligne"
    And Je clique sur le bouton "Changer de CF"
    And Je selectionne le compte "TEST - 6.42661"
    When Je clique sur le bouton "Appliquer"
    Then Je confirme le changement

  # Bouton Changer d'offre désactivé
  #Scenario: Verification du changement d'offre
  #  Given en tant que BO
  #  And Je suis sur la page de gestion de lignes
  #  And je lance la recherche par ID "8933203494859102801"
  #  And j'ouvre le panneau de détail de la ligne
  #  And Je clique sur "Voir le detail de la ligne"
  #  And Je clique sur le bouton "Changer d'offre"
  #  And Je selectionne l'offre "Parc 2 forfait"
  #  When Je clique sur le bouton "Appliquer"
  #  Then Je confirme le changement

  Scenario: Ouverture de l'historique de declenchement d'une alarme activee
    Given en tant que BO
    And Je suis sur la page de gestion de lignes
    And je lance la recherche par ID "33669497435"
    And j'ouvre le panneau de détail de la ligne
    And Je clique sur "Voir le detail de la ligne"
    And Je clique sur "Liste des alarmes"
    When Je clique sur "Oui" dans la deuxieme ligne dans la colonne "Declenchement"
    Then Le panneau s'est ouvert

  Scenario: Ouverture de la modification d'alarme en cliquant sur l'ID d'une alarme
    Given en tant que BO
    And Je suis sur la page de gestion de lignes
    And je lance la recherche par ID "33669497435"
    And j'ouvre le panneau de détail de la ligne
    And Je clique sur "Voir le detail de la ligne"
    And Je clique sur "Liste des alarmes"
    When Je clique sur l'ID de la premiere alarme
    Then Le panneau s'est ouvert

  Scenario: Ouverture de la creation d'alarme
    Given en tant que BO
    And Je suis sur la page de gestion de lignes
    And je lance la recherche par ID "33669497435"
    And j'ouvre le panneau de détail de la ligne
    And Je clique sur "Voir le detail de la ligne"
    And Je clique sur "Liste des alarmes"
    When Je clique sur "Creer une alarme"
    Then Le panneau s'est ouvert

  Scenario: Ouverture de l'acte de masse d'un acte de gestion
    Given en tant que BO
    And Je suis sur la page de gestion de lignes
    And je lance la recherche par ID "8933203494859102801"
    And j'ouvre le panneau de détail de la ligne
    And Je clique sur "Voir le detail de la ligne"
    And Je clique sur "Suivi pilotage des actes de gestion"
    When Je clique sur l'acte de masse de la premiere ligne
    Then Le panneau s'est ouvert

  Scenario: Ouverture de la page de l'acte de gestion en cliquant sur "Voir le resultat de l'acte" dans le panneau
    Given en tant que BO
    And Je suis sur la page de gestion de lignes
    And je lance la recherche par ID "8933203494859102801"
    And j'ouvre le panneau de détail de la ligne
    And Je clique sur "Voir le detail de la ligne"
    And Je clique sur "Suivi pilotage des actes de gestion"
    When Je clique sur l'acte de masse de la premiere ligne
    And Je clique sur "Voir le resultat de l'acte"
    Then La page de l'acte de gestion s'est ouverte

  Scenario: Ouverture de la page de détail d'un acte de gestion puis retour sur le détail de ligne après avoir cliquer sur le bouton retour
    Given en tant que BO
    And Je suis sur la page de gestion de lignes
    And je lance la recherche par ID "33698014672"
    And j'ouvre le panneau de détail de la ligne
    And Je clique sur "Voir le detail de la ligne"
    And Je clique sur "Suivi pilotage des actes de gestion"
    And Je clique sur l'acte de masse de la premiere ligne
    And Je clique sur "Voir le resultat de l'acte"
    And Je vérifie que l'url contient "/act-detail/"
    When Je clique sur le bouton "Retour"
    Then Je vérifie que l'url contient "/line-detail/"
