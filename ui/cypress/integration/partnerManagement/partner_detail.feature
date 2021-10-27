Feature: Détails d'un partenaire

  Je veux tester la page de detail d'un partenaire

  Scenario: Je peux naviguer entre tous les différents onglets de la page de détail d'un partenaire
    Given en tant que BO
    And Je vais sur la page des partenaires
    When Je vais sur la page de detail du partenaire LYRA
    Then Je peux naviguer entre tous les differents onglets

  Scenario: Je peux modifier le prénom d'un administrateur, onglet "Gestion des utilisateurs", section "Administrateurs"
    Given en tant que BO
    And Je vais sur la page de detail du partenaire LYRA
    And Je vais sur l'onglet "GESTION DES UTILISATEURS" et vérifie l'URL "/users"
    And Je vais dans la section "Administrateurs" et vérifie l'URL "/users/admin"
    And Je clique sur le bouton "Modifier" du premier administrateur
    When Je modifie le prenom actuel de l'administrateur par "LYRA"
    And je clique sur le bouton "Enregistrer"
    Then Le prenom de l'administrateur a bien ete modifie par "LYRA"

  Scenario: Je peux modifier le prénom d'un utilisateur, onglet "Gestion des utilisateurs", section "Utilisateurs"
    Given en tant que BO
    And Je vais sur la page de detail du partenaire LYRA
    And Je vais sur l'onglet "GESTION DES UTILISATEURS" et vérifie l'URL "/users"
    And Je vais dans la section "Utilisateurs" et vérifie l'URL "/users/users"
    And Je clique sur le bouton "Modifier" du premier utilisateur
    When Je modifie le prenom actuel de l'utilisateur par "LYRA"
    And je clique sur le bouton "Enregistrer"
    Then Le prenom de l'utilisateur a bien ete modifie par "LYRA"

  Scenario: Je vérifie que le panneau s'ouvre lorsque je clique sur le bouton "Ajouter un utilisateur", onglet "Gestion des utilisateurs", section "Utilisateurs"
    Given en tant que BO
    And Je vais sur la page de detail du partenaire LYRA
    And Je vais sur l'onglet "GESTION DES UTILISATEURS" et vérifie l'URL "/users"
    And Je vais dans la section "Utilisateurs" et vérifie l'URL "/users/users"
    When Je clique sur le bouton "Ajouter un utilisateur"
    Then Le panneau s'ouvre et est visible

  Scenario: Je veux créer une nouvelle liste de diffusion puis modifier le nom et ajouter une nouvelle adresse mail à cette liste puis la supprimer, onglet "Personnalisation", section "Listes de diffusion"
    Given en tant que BO
    And Je vais sur la page de detail du partenaire LYRA
    And Je vais sur l'onglet "PERSONNALISATION" et vérifie l'URL "/customize"
    And Je vais dans la section "Listes de diffusion" et vérifie l'URL "/customize/broadcastlists"
    And Je clique sur le bouton "Ajouter une liste de diffusion"
    And Je rentre le nom "TestCypress" à la liste de diffusion
    And J'ajoute l'adresse mail "test.cypress@lyra.fr" à la liste de diffusion
    And je clique sur le bouton "Enregistrer"
    And Je verifie la liste de diffusion avec le nom "TestCypress" et les adresses mail "test.cypress@lyra.fr"
    And Je clique sur le bouton "Modifier" de cette nouvelle liste de diffusion
    And Je rentre le nom "TestCypressV2" à la liste de diffusion
    And J'ajoute l'adresse mail "test.cypress.v2@lyra.fr" à la liste de diffusion
    And je clique sur le bouton "Enregistrer"
    And Je verifie la liste de diffusion avec le nom "TestCypressV2" et les adresses mail "test.cypress@lyra.fr test.cypress.v2@lyra.fr"
    When Je clique sur le bouton "Supprimer" de cette liste de diffusion
    And Je confirme la suppression de la liste de diffusion
    Then La liste de diffusion "TestCypressV2" n'existe plus

  Scenario: Je veux créer une nouvelle adresse de livraison, onglet "Personnalisation", section "Adresses de livraison"
    Given en tant que BO
    And Je vais sur la page de detail du partenaire LYRA
    And Je vais sur l'onglet "PERSONNALISATION" et vérifie l'URL "/customize"
    And Je vais dans la section "Adresses de livraison" et vérifie l'URL "/customize/deliveryaddress"
    And Je clique sur le bouton "Ajouter une adresse de livraison"
    And Je rentre les informations necessaire a la creation d'une adresse de livraison
    When je clique sur le bouton "Enregistrer"
    Then L'adresse de livraison a correctement ete cree

  Scenario: Je veux créer un nouveau champ libre puis le modifier, onglet "Personnalisation, section "Champs libres"
    Given en tant que BO
    And Je vais sur la page de detail du partenaire LYRA
    And Je vais sur l'onglet "PERSONNALISATION" et vérifie l'URL "/customize"
    And Je vais dans la section "Champs libres" et vérifie l'URL "/customize/customfields"
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

  Scenario: Je vérifie l'ouverture du panneau lors de la création et de la modification d'un champ spécifique, onglet "Personnalisation, section "Champs specifique"
    Given en tant que BO
    And Je vais sur la page de detail du partenaire LYRA
    And Je vais sur l'onglet "PERSONNALISATION" et vérifie l'URL "/customize"
    And Je vais dans la section "Champs spécifiques" et vérifie l'URL "/customize/specificfields"
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
    And Je vais sur l'onglet "COMPTES DE FACTURATION" et vérifie l'URL "/billAccounts"
    And Je clique sur le code de la premiere ligne
    And Je modifie le libelle a "TestCypress"
    And Je modifie la zone de taxe a "TaxAreaCypress"
    And je clique sur le bouton "Mettre à jour"
    When Je clique sur le bouton "Retour a la liste des C.F."
    Then Le libelle est correctement modifie a "TEST"

  Scenario: Je peux ouvrir le panneau de gestion des cartes SIM et désactiver l'une d'elle, onglet "Offres et cartes SIM", section "Cartes SIM"
    Given en tant que BO
    And Je vais sur la page de detail du partenaire LYRA
    And Je vais sur l'onglet "OFFRES ET CARTES SIM" et vérifie l'URL "/offersandsim"
    And Je vais dans la section "Cartes SIM" et vérifie l'URL "/offersandsim/simcards"
    And Je clique sur le bouton de gestion
    And Le panneau s'ouvre et est visible
    And Je ferme le panneau
    When Je clique sur le bouton "Désactiver"
    Then Le message de confirmation apparait et je peux confirmer l'action

  Scenario: Je peux ouvrir le panneau de gestion des offres et désactiver l'une d'elle, onglet "Offres et cartes SIM", section "Offres"
    Given en tant que BO
    And Je vais sur la page de detail du partenaire LYRA
    And Je vais sur l'onglet "OFFRES ET CARTES SIM" et vérifie l'URL "/offersandsim"
    And Je vais dans la section "Offres" et vérifie l'URL "/offersandsim/offersCards"
    And Je clique sur le bouton de gestion
    And Le panneau s'ouvre et est visible
    And Je ferme le panneau
    When Je clique sur le bouton "Désactiver"
    Then Le message de confirmation apparait et je peux confirmer l'action

  Scenario: Je vérifie que la confirmation de modification apparait sur l'écran après l'enregistrement des options du partenaire, onglet "Detail du compte", section "Options du partenaire"
    Given en tant que BO
    And Je vais sur la page de detail du partenaire LYRA
    And Je vais sur l'onglet "DÉTAIL DU COMPTE" et vérifie l'URL "/accountDetail"
    And Je vais dans la section "Options du partenaire" et vérifie l'URL "/accountDetail/options"
    When je clique sur le bouton "Enregistrer"
    Then Le message de confirmation apparait et je peux fermer le message
