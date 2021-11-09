Feature: Création d'actes de gestion

  je veux faire des tests sur la creation d'actes de gestion

  Scenario: Je veux créer un acte de suspension de ligne
    Given en tant que BO
    And je regarde le nombre d'actes de gestions
    And Je vais sur la page des lignes
    And je choisis l'acte de suspension par défaut
    When je confirme la création de l'acte
    Then je verifie que mon acte a été créé

  Scenario: Je veux créer un acte d'activation/preactivation
    Given en tant que BO
    And Je vais sur la page des lignes
    And je regarde le nombre d'actes de gestions
    And je choisis l'acte d'activation par défaut
    When je confirme la création de l'acte
    Then je verifie que mon acte a été créé

  Scenario: Je veux créer un acte de changement de compte de facturation
    Given en tant que BO
    And Je vais sur la page des lignes
    And je regarde le nombre d'actes de gestions
    And je choisis l'acte de changement de CF par défaut
    When je confirme la création de l'acte
    Then je verifie que mon acte a été créé

  Scenario: Je veux créer un acte de modification de champs libres
    Given en tant que BO
    And Je vais sur la page des lignes
    And je regarde le nombre d'actes de gestions
    And je choisis l'acte de modification des champs libres par défaut
    When je confirme la création de l'acte
    Then je verifie que mon acte a été créé

  @ignore
  # Pas d'affichage de l'acte -> vérification fail
  Scenario: Je veux créer un acte de résiliation avec un délai de 3 mois
    Given en tant que BO
    And Je vais sur la page des lignes
    And je choisis l'acte de gestion de résiliation
    When Je créé la validation avec un délai de 3 mois
    Then Je valide que la due date est à la date du jour + 3 mois

  Scenario: Je veux refuser les résiliations
    Given en tant que BO
    And Je vais sur la page des lignes
    And je choisis l'acte de gestion de résiliation
    When je refuse les résiliations
    Then un acte de refus de résiliation est bien créé

  @ignore
  #Erreur : Exception while fetching data (/changeServices) : Unknown marketing offer with code LYRA_PARC2_FORFAIT_TEST
  Scenario: Je veux créer un acte de changement de services
    Given en tant que BO
    And je regarde le nombre d'actes de gestions
    And Je vais sur la page des lignes
    And je choisis l'acte de modification de services
    When je confirme la création de l'acte
    Then je verifie que mon acte a été créé

  @ignore
  Scenario: Je veux libérer des profils eSIM
    Given en tant que BO
    And Je vais sur la page des lignes
    And je choisis l'acte "Libérer des profils eSIM"
    And je vérifie que les filtres obligatoires "Statut de la ligne:Non préactivée,Catégorie de SIM:eSim,Type de Step:STEP2" sont actifs
    And je sélectionne l'acte en masse
    And je rentre les informations prérequises Partenaire "Lyra" et CF "6.42661"
    When Je clique sur le bouton "Appliquer"
    Then Le bouton "Valider" est présent

  @ignore
  Scenario: Je veux appliquer des Policy rules
    Given en tant que BO
    And Je vais sur la page des lignes
    And je choisis l'acte "Policy rules"
    And je vérifie que les filtres obligatoires "Catégorie de SIM:eSim,Type de Step:STEP2,Ligne Appairée:Oui" sont actifs
    And je sélectionne l'acte en masse
    And je rentre les informations prérequises Partenaire "Lyra"
    And Je clique sur le bouton "Appliquer"
    And je vérifie que l'input Sujet a la valeur "Profile" et est non modifiable
    And je vérifie que Action est un toggle et a les valeurs "Delete" et "Disable"
    And je vérifie que Qualification est un toggle et a les valeurs "Not allowed" et "Auto delete"
    When Je clique sur le bouton "Appliquer"
    Then un message de confirmation apparait

  @ignore
  Scenario: Je veux appairer des eSIM automatiquement
    Given en tant que BO
    And Je vais sur la page des lignes
    And je choisis l'acte "Appairer des eSIM"
    And je choisis l'appairage automatique
    And je rentre les informations prérequises Partenaire "Lyra", CF "6.42661" et Type de carte SIM "ESIM CARTE 5"
    When Je clique sur le bouton "Appliquer"
    Then Le bouton "Appliquer" apparait sous la table des résultats

  @ignore
  Scenario: Je veux appairer des eSIM par fichier
    Given en tant que BO
    And Je vais sur la page des lignes
    And je choisis l'acte "Appairer des eSIM"
    And je choisis l'appairage par fichier
    And je rentre les informations prérequises Partenaire "Lyra" et CF "6.42661"
    When Je clique sur le bouton "Appliquer"
    Then Une zone d'upload et le bouton "Appliquer" appairaissent sous la table des résultats

  @ignore
  Scenario: Je veux changer le statut des profils eSIM
    Given en tant que BO
    And Je vais sur la page des lignes
    And je choisis l'acte "Changer le statut des profils eSIM"
    And je vérifie que les filtres obligatoires "Statut de la ligne:Activée,Catégorie de SIM:eSim,Type de Step:STEP2,Ligne Appairée:Oui,Statut Téléchargement:Activé/Désactivé" sont actifs
    And je rentre les informations prérequises Partenaire "Lyra" et CF "6.42661"
    When Je clique sur le bouton "Appliquer"
    Then un formulaire avec la liste des statuts du profil apparait
