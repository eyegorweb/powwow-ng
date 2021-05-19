Feature: Page de detail d'un partenaire

  Je veux tester la page de detail d'un partenaire

  Scenario: Je peux naviguer entre tous les differents onglets de la page de detail d'un partenaire
    Given en tant que BO
    And Je suis sur la page de gestion des partenaires
    When Je vais sur la page de detail du partenaire LYRA
    Then Je peux naviguer entre tous les differents onglets

  Scenario: Je peux modifier le prenom d'un administrateur, onglet "Gestion des utilisateurs", section "Administrateurs"
    Given en tant que BO
    And Je vais sur la page de detail du partenaire LYRA
    And Je vais sur l'onglet "Gestionnaire des utilisateurs"
    And Je vais dans la section "Administrateurs"
    And Je clique sur le bouton "Modifier" du premier administrateur
    When Je modifie le prenom actuel de l'administrateur par "LYRA"
    And Je clique sur le bouton "Enregistrer"
    Then Le prenom de l'administrateur a bien ete modifie par "LYRA"

  Scenario: Je peux modifier le prenom d'un utilisateur, onglet "Gestion des utilisateurs", section "Utilisateurs"
    Given en tant que BO
    And Je vais sur la page de detail du partenaire LYRA
    And Je vais sur l'onglet "Gestionnaire des utilisateurs"
    And Je vais dans la section "Utilisateurs"
    And Je clique sur le bouton "Modifier" du premier utilisateur
    When Je modifie le prenom actuel de l'utilisateur par "LYRA"
    And Je clique sur le bouton "Enregistrer"
    Then Le prenom de l'utilisateur a bien ete modifie par "LYRA"

  Scenario: Le panneau s'ouvre lorsque je clique sur le bouton "Ajouter un utilisateur", onglet "Gestion des utilisateurs", section "Utilisateurs"
    Given en tant que BO
    And Je vais sur la page de detail du partenaire LYRA
    And Je vais sur l'onglet "Gestionnaire des utilisateurs"
    And Je vais dans la section "Utilisateurs"
    When Je clique sur bouton "Ajouter un utilisateur"
    Then Le panneau s'ouvre et est visible

  Scenario: Je cree un nouvelle liste de diffusion puis modifie le nom et ajoute une nouvelle adresse mail à cette liste puis la supprime, onglet "Personnalisation", section "Listes de diffusion"
    Given en tant que BO
    And Je vais sur la page de detail du partenaire LYRA
    And Je vais sur l'onglet "Personnalisation"
    And Je vais dans la section "Listes de diffusion"
    And Je clique sur le bouton "Ajouter une liste de diffusion"
    And Je rentre le nom "TestCypress" à la liste de diffusion
    And J'ajoute l'adresse mail "test.cypress@lyra.fr" à la liste de diffusion
    And Je clique sur le bouton "Enregistrer"
    And Je verifie la liste de diffusion avec le nom "TestCypress" et les adresses mail "test.cypress@lyra.fr"
    And Je clique sur le bouton "Modifier" de cette nouvelle liste de diffusion
    And Je rentre le nom "TestCypressV2" à la liste de diffusion
    And J'ajoute l'adresse mail "test.cypress.v2@lyra.fr" à la liste de diffusion
    And Je clique sur le bouton "Enregistrer"
    And Je verifie la liste de diffusion avec le nom "TestCypressV2" et les adresses mail "test.cypress@lyra.fr test.cypress.v2@lyra.fr"
    When Je clique sur le bouton "Supprimer" de cette liste de diffusion
    And Je confirme la suppression de la liste de diffusion
    Then La liste de diffusion "TestCypressV2" n'existe plus

  Scenario: Je cree une nouvelle adresse de livraison, onglet "Personnalisation", section "Adresses de livraison"
    Given en tant que BO
    And Je vais sur la page de detail du partenaire LYRA
    And Je vais sur l'onglet "Personnalisation"
    And Je vais dans la section "Adresses de livraison"
    And Je clique sur le bouton "Ajouter une adresse de livraison"
    And Je rentre les informations necessaire a la creation d'une adresse de livraison
    When Je clique sur le bouton "Enregistrer" Adresses de livraison
    Then L'adresse de livraison a correctement ete cree

  Scenario: Je cree un nouveau champ libre puis le modifie, onglet "Personnalisation, section "Champs libres"
    Given en tant que BO
    And Je vais sur la page de detail du partenaire LYRA
    And Je vais sur l'onglet "Personnalisation"
    And Je vais dans la section "Champs libres"
    And Je clique sur le bouton "Ajouter"
    And Je rentre le titre "TestCypress"
    And Je choisis le type "Texte"
    And J'indique que le champ est obligatoire a l'activation
    And J'enregistre
    And Je verifie la creation du nouveau champ libre "TestCypress"
    And Je clique sur le bouton "Modifier" de ce nouveau champ
    And Je rentre le titre "TestCypressV2"
    When Je clique sur le bouton "Mettre a jour"
    Then Je verifie la modification du champ libre a "TestCypressV2"

  Scenario: Je verifie l'ouverture du panneau lors de la creation et de la modification, onglet "Personnalisation, section "Champs specifique"
    Given en tant que BO
    And Je vais sur la page de detail du partenaire LYRA
    And Je vais sur l'onglet "Personnalisation"
    And Je vais dans la section "Champs specifiques"
    And Je clique sur le bouton "Ajouter"
    And Le panneau s'ouvre et est visible
    And Je rentre le titre "TestCypress"
    And Je choisis le type "Texte"
    And J'indique que le champ est obligatoire a l'activation
    And J'enregistre
    When Je clique sur le bouton "Modifier" de ce nouveau champ
    Then Le panneau s'ouvre et est visible

  Scenario: Je peux modifier un compte de facturation, onglet "Comptes de facturation"
    Given en tant que BO
    And Je vais sur la page de detail du partenaire LYRA
    And Je vais sur l'onglet "Comptes de facturation"
    And Je clique sur le code de la premiere ligne
    And Je modifie le libelle a "TestCypress"
    And Je clique sur le bouton "Mettre a jour" Comptes de facturation
    When Je clique sur le bouton "Retour a la liste des C.F."
    Then Le libelle est correctement modifie a "TestCypress"

  Scenario: Je peux ouvrir le panneau de gestion des cartes SIM et desactiver l'une d'elle, onglet "Offres et cartes SIM", section "Cartes SIM"
    Given en tant que BO
    And Je vais sur la page de detail du partenaire LYRA
    And Je vais sur l'onglet "Offres et cartes SIM"
    And Je vais dans la section "Cartes SIM"
    And Je clique sur le bouton de gestion
    And Le panneau s'ouvre et est visible
    And Je ferme le panneau
    When Je clique sur le bouton "Desactiver"
    Then Le message de confirmation apparait et je peux confirmer l'action

  Scenario: Je peux ouvrir le panneau de gestion des offres et desactiver l'une d'elle, onglet "Offres et cartes SIM", section "Offres"
    Given en tant que BO
    And Je vais sur la page de detail du partenaire LYRA
    And Je vais sur l'onglet "Offres et cartes SIM"
    And Je vais dans la section "Offres"
    And Je clique sur le bouton de gestion
    And Le panneau s'ouvre et est visible
    And Je ferme le panneau
    When Je clique sur le bouton "Desactiver"
    Then Le message de confirmation apparait et je peux confirmer l'action

  Scenario: La confirmation de modification apparait sur l'ecran apres l'enregistrement des options du partenaire, onglet "Detail du compte", section "Options du partenaire"
    Given en tant que BO
    And Je vais sur la page de detail du partenaire LYRA
    And Je vais sur l'onglet "Detail du compte"
    And Je vais dans la section "Options du partenaire"
    When Je clique sur le bouton "Enregistrer" Options du partenaire
    Then Le message de confirmation apparait et je peux fermer le message
