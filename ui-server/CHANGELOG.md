# CHANGELOG

<!--- next entry here -->

## 0.11.0
2019-11-20

### Features

- brancher les services au front end (28edaaa24994b7cb7dc784a33712352cf69831a6)

### Fixes

- utiliser l'API V2 pour l'acte : Préactiver ou activer (52c03238021673c42aadce2f706d1e215250ae62)
- corriger le problème d'affichage sur laptop (a8a6d197bfb33ba89600d473cbe45cae2cd4a03f)
- mise à jour des champs de l'export de fichier des gestions de lignes (beedc1227e48a6ab095234209d6214c055180fb1)
- partie interface du changement d'offre (cb3403b5aac98802207898471c65c8e86e58d879)
- **orders:** correctif appliqué aux indicateurs de commande et aux filtres de dates (f563f90a1a021328ab0614242b279b15886577cb)
- modification des noms des types de partenaire (fad9508636f2dd6f3842d4127aa3b41709bb82bb)
- **line detail:** correctif erreur javascript (c6611ec84beb0a9a3bd87ee490f2f098e99a002d)
- mise à jour du statut commercial (5f8708f288ca4b4bbdc397017f43ce3174ac9d75)
- **lines:** filtrer la recherche de lignes en fonction du contexte des partenaires (aec2c81cbba661245dac9a5ce3a80f4c8f9f2a4f)
- **line detail:** traduction du statut commercial (21969092fd687fb879bbfe5e0cd9bfa492018ba7)
- modification du filtre de l'indicateur des actes en échec (b468c8388808a0e1f6290afb311bf13b5b274000)
- correction du filtre de préactivation/activation (0b0fd20a73e3c81223192b8958348bd522d06a1b)

## 0.10.0
2019-11-18

### Features

- Mise en place de la nouvelle gestion de la table de travail pour les actes de gestion (8065e44bffa93e5c0a1ef9002311b138e27e9694)
- historique des cellules dans le menu "réseau et itinérance" (9092c97c181ddadf30eff8a109d437c990196ed1)
- **widget:** affichage du widget Etat du parc (983d0ae79cc4885646024fe349df888393f38304)
- Limiter le choix de type de partenaires à 1 (153afc0132536c089f663d951e0b7c2b0705db93)
- intégration des indicateurs pré calculés (73d542605da715c1ff28116a49445844e6b7dc5d)
- Cacher les composants en cours de développement (72715d885a7eb0930b89e11a3eb0e5c9d7b04381)
- Intégration de l'API changement de services (7193362961054b2db4cdfb0012d0b55565709c33)

### Fixes

- Correction de bugs (a7f839def293cacbcc69ae79796ebbcd290492e8)
- utiliser un skeleton comme indicateur de chargement (b0c3ce1bad1f9b34ded0948b49f40b5c9c8cc91b)
- traduction des graphes en français (f1bc5d029c00cb705d8d2181c37e5df60ed34a0b)
- comportement recherche unitaire (commandes, actes de gestion et lignes) (83f4e0d194a794a05174e531b529b2b5b5f5e5ca)
- Gérer la largeur d'écran 1280 (524176e9b251b09f67285de9be1a9907f136acd1)
- affiche la date de fin sous le statut Terminé d'un acte de gestion (1a20b659887d246e81f7a36f47a64311e5bfee1f)
- erreur dans la recherche unitaire d'acte de masse si saisir de lettre au lieu de chiffre (686ea37fdea070a33694ff2855232338730e4a29)
- Ajouter un spinner durant le chargement de l'application (fef15f2f1139f5b72f898ab1c457b25b5c33a696)
- Améliorer l'animation du spinner (2a108687412bd860ae8d9a27a63e8fbb53d6a6db)
- mise à jour des conditions de validation pour l'envoi de SMS (c1d1eb35ae851b53af0d10fd1b9f472f9127f70d)
- Correction du lien selectionné par défaut après l'authentification (1f3f674901877f17d84c31399a005f2a8723c3b5)
- ajout d'une requête pour récupérer la liste des shortCodes en tant que partenaire (301895aa96937b6d631fd9a3dcbd915e18f86290)
- Correction de bug d'affichage lors du choix de l'offre (2695ef184312ef692495b9d1a9b0bacc27a46bc4)
- Brancher les services sur la création de commandes et changement de services (769d9c7ea4724bd575cc399e28057038fdbc22e6)

## 0.9.0
2019-10-28

### Features

- export des données de la consommation DATA (56901e04ae410f46ec58a487d1133b72fa00cacb)
- Exporter les consommations de ma ligne (c8f414c1221af2d400e7c2eb24b3ba61b9931ec1)
- **line detail:** affiche les fonctionnalités compmètes du menu Historique réseau et itinérance (472e37f44970e4bbb4fb925b4cc5377a6f8a6a1a)

### Fixes

- brancher la colonne opérateur (845d788b5d1d83ac2d246adbdc0fa0141803f7b3)
- ouverture du volet de l'acte de gestion (498cb4ec293d442fc27c17d6398389fdad0137d9)
- Afficher le nom de la société dans le détail de la commande (7dac3b0615702435de18b36bb855d8c70a3cf0ca)
- utilisation de l'API V2 pour récupérer les datas (f5a12ca6263c1b0bce96b022720e4c2c09573e4a)
- ajout de l'info asynchrone (7e7b96c6934fe8fcfe70c7458125f28ac852d76e)
- Corriger le drag & drop sur le volet supervision (36c32c95e3fff2405ef0c8c1cabcbf2655557b44)
- correction des retours (657e0ee20e1c20c496aed5b1d42b64b383b9ccce)
- Correction des retours de la review (a6d2ed3524e8102646114c520a564e83eabd1a2f)
- corriger le chargement des indicateurs (fde16a81e111cbf546a584f703323963a7c9f2ad)
- **line detail:** mise à jour des tables pour le menu Historique réseau et itinérance (9ee4c4df9f64cbf58513c5ce3b5db6456d8a3c47)
- **line detail:** correctif appliqué à la récupération des données du tableau Historique des pays visités (78fb7b73196f9e129e0973fcac2ca89fd44f7bcc)
- **line detail:** ajour du tri pour la table Historique des cellules de consommation (96d478214e2dd328355dc55ed45cff3160cc9582)
- Corriger l'accès à l'application depuis IE (1dd0e9aed89907b85967e9a63489a64fbd752c9e)
- affiche le tableau d'encours de consommation pour le type de partenaire MVNO (5edbd229ae874a9ac14946bba6e1f249e0fbf4fe)
- Corriger la création de commandes sur IE (edd20c6a441a29de48cf136613db1e708854893e)
- utiliser un timepicker pour ajouter des nouvelles demandes de contrôle de consommation (dc435b955b3f523cb62049bff0e9463bcd85643d)
- spécirfiaction du style du tableau encours de consommation (32168792ea578dcd1f3d41aeb056b603e2580f93)
- Ajouter le champ technologie sur le bloc de geolocalisation (45cddc58238efc513ed76cac03a583f7de9db2a1)
- modifier le design des gauges (c09e5b68e14d7c03014fd99915cb4772dd81bb4b)

## 0.8.0
2019-10-11

### Features

- 570 Tables pour analyser les lignes sur la même localisation (d4296a0aa62c87e309a80f74a70de6d34ff512ff)
- **line detail:** ajout de l'acte de création "Changer de compte de facturation" (8646d24bb5e2b6bbfbd4e81663cd43ee772a10b3)
- maquette pour l'écran "tester le réseau et la localisation" (14428ad54a28a6944d50911ae036182b38b2f6bd)
- Ecran : tester le réseau et la localisation (e835d4074f150975779ab678791f1517e36518a4)
- activer la levée de coupure (618af5a0b453c90d7cbe385c963ed713f7b95adf)
- 570 Barre de recherche par ligne (f23086ba83b71b740dd631f802a8c1462882009a)

### Fixes

- deploy uat (7b2ab53b0d9179e4ecf95eb94ce3c42dbc52f798)
- Afficher un message d'erreur quand la table est vide (a00887d596ad16fe81779198124bc87f6e8dae5f)
- **line detail:** mise à jour de l'API des consommations data pour afficher l'analyse de la ligne (529b7c263ec3a11fe01ad8550d9af93a9386cbf2)
- **line detail:** affichage du sous menu en fonction du type de partenaire (9eae0d8f366109704831264c8c082cfd7acf2b9d)
- adapter l'API consommation sms (d03f6b57a0fe9e9d7d03e5481805cc19dd54aecc)
- 603 Adapter la datatable à l'API de consommation Voix (e1ef22bb2357695d02c7f3161ba0c82220f9eadd)
- **line detail:** affichage de la table de consommation data (69a419b67c7a975a8e9187871a62a872007ad5bc)
- 794 formatter les nombres (f02b4f17ba604510baf643cdc262f48f82753fb5)
- 792 Ajout du message 'ouvrés' (6a7cfc08a085a92ad4713b0214d3e75d9590092b)
- **line detail:** configuration de la colonne ip (a9d66c242260d716866465f8c134937faf181598)
- 798 Corriger les colonnes champs libres pour les utilisateurs partenaires (7fc1791decf96a0b0b0d2aa3139a259e830bf952)
- affiche la liste des alarmes (da5f9afadb79c1a1aad8c4c7570e8227711a927d)
- 823 Afficher les champs libres dans la liste des lignes (0a5b4531e3a46382bbad0c865961bfe9f38f9667)
- correctif appliquant l'id de la simcardinstance (1e96c2b554def03b084b5ae1f42c9999efc7bd2b)
- affiche le msisdn lors de l'ouverture du volet du détail de la ligne (9ef570368ded18e83e040e64dcbe51417ebf95d0)
- **orders:** ouvrir le volet de l'acte de gestion à partir de l'id de gestion (a9144037a569ef8f12c6b8557d606be468b04c2a)

## 0.7.0
2019-10-02

### Features

- ajout du statut de destination dans le détail acte de masse (137a8870defcda187d386784aba3f5d7bcf61223)
- 725 Gérer la création d'actes en tant que partenaire (62501ab602d046cbeb326107d64e39f032b9ad12)
- 568 ecran-analyse-supervision-ligne (626adfa1cdacd986350d21db80be4de266127d18)
- Composant pour les graphiques (12aa61d377d5abed902582691a54e46c09fb657a)
- 737 Brancher les informations du détail de la ligne (0c64b11e9f1fb88ad748d0bc8269bc454fd94861)
- écran de consommation voix / composant toggle (0a20ed743f90750d92be569150dd8a966e656a69)
- ajouter bloc d'informations réseau (ff9a0db4f720f9aa926d11cae3150c1cb70ea7f9)
- 558 affichage des encour consommation DATA (cbd0138bad9a8bd77dd6b068067daf979588baa7)
- 559 Exporter l'encour consommation (f3754877078483511240622103757d9909625e04)
- 737 compléter les informations du détail de la ligne (ed81bb1ce9603325df5b5606a46b4188b7a547ec)
- 524 afficher les alarmes sur le détail de la ligne (e99a4790567939edf937f3cd0331c4cfa10e3146)
- Brancher l'historique des MSISDN (93b1914793a936e113489990243c8d3494954b05)
- 39 widget statut des commandes (18c7e0f54972a172689b0f900d87b0869ba239f4)
- 642  Résumé des actes de gestion dans un widget (8616454a0c7329602d5cffa62313445936968cdd)
- 638 actes de gestion dans un widget (7d1189b1c4d6805f3767dda24f779e28ca6966c4)
- 646 ajouter un bouton pour la création de commande depuis la home page (bae107bada1f71e9cf8c9f75cff19233495e0528)
- **detail de la ligne:** affiche l'information de déclenchement des alarmes (411a64c34fcfbca05ea2408de2ce3e33d68cbe9c)
- **detail de la ligne:** affiche l'information de déclenchement des alarmes (8a7b4dded3349b098be8adfa47da7b4bd8b1e911)
- les wodgets de la homepage dépendent du contexte utilisateur (0174978a9d96c21dfb1e32a28aced28e89536924)
- 750 pré-remplir les champs libres (a17ba7d2547a70ebc34937d0a15834e7e95318e5)
- 750 enlever la synthèse des champs libres lors de l'acte modification champs libres (027787ce419a6574ee2e8827c51be796c3b1d681)
- 599 consommation SMS de ma ligne (4275f5d934e6a62ba46051d45d083ddad41e8c83)
- **line detail:** affichage du tableau encours de consommation (a62b2f1f47d052603b4a67514ee8d7bdc0f37797)
- 602 Consommation Voix (e33b61d173a9bf37ed3656830a985497d28c1b04)
- 737 Historique des équipements (6efea55fd7ecc967bbf2b504b9bb3b8bfba8d69a)
- 195  je veux afficher les cartes SIM sur une commande afin d'analyser le détail des cartes SIM (55f83bd8246431a3e0444863e05e0bcd5abb69c8)
- configurer la pagination dans la table SMS (596c1c0ec703ccad0319830aa50f05e43555d0c9)
- 603 intégration initiale de la table "consommation voix" (9e172a8cfe2d4f40f18c49d47476b001507b54f5)
- 591 Première intégration de la table d'historique de demandes de consommation (eb0c0680488607fa49a4e1a9babc93d039f77e7b)
- 591 Ajouter une demande de contrôle de consommation (d2187e2fadc005f6f279fe7472e008c255bb2d84)
- la bare de recherche n'est pas ré initialisée quand au retour d'une page de détail (9b1ed63cc6bae3f161c93f9369b475a462256383)
- Colonne statut dans la table d'historique de demande de conrole (5a4cdd36e964b899c39047059b41232d67d7e65a)

### Fixes

- ajoute les changements à venir dans le détail (e5ff9a4adafc5d7005cfa0fd2e0564b9c31c2086)
- correction du prérequis "offres" (3048d9f7a36ff74b629e1acf2617e86f252b4681)
- Correction de la case à cocher sur la séléction des lignes (3354ac57c57f5b31aad477a301e51a933f1b20cc)
- change filtres par défaut pour la réactivation (74014a11f40d13ffde13d314a305d068504a2f9d)
- permet la validation de résiliation (d635650429ccffd0e5b78390f8277586283175ae)
- transfert de lignes pour le bo uniquement (a7be0cd020d646499fd751b03775d35625c58a18)
- infos facturation et offre de la ligne (9aeee342756fb9634b21d74873e9b4071386c011)
- utiliser la bonne api pour l'acte terminer la phase de test (8b1909ad7a3f674280597f90f435c00bd4922722)
- adapte un changement dans l'api terminatePhaseTest (12d4a9003c6f0d2a8253254a3588122d0aa600e9)
- update api (012c25f20b094ea6588c3e527659847a2a1298ef)
- **act-detail:** modify custom fields (cef4e232f11d5369261f3e539f69d363311de708)
- 743 ne pas afficher 0 dans le total pendant la requête est en cours (561547f365072f5195125387d8074a85ee34bcb1)
- 743 Ajouter un indicateur de chargement pour les totaux (05227ea78700efda232b2cdfd72c239992ac4e1a)
- 748 Migration vers le nouveau format d'erreurs (ddcb4a4b6b0f56d9da5a1ec46d1492dd2ec6bbc5)
- 568 Adaptation de la requête pdpConnexions (f0fbc47e22951cb25c36878dd5b315577a893288)
- 568 Correction du texte pour le statut de connexion (0f1e6860258f8dd7ac7f5c4f3df2def6031a2320)
- 752 Correction de la recherche par fichier (4d538d6764bfd505061991d94d49a0742cf22acb)
- diminuer la taille du texte du widget table (93eb6eb5bc3e3f4f01a15f567d22ecf4fe073b71)
- widget search by lines (af4c6e9b8623909a0ba263334087b4450e6a0cb5)
- Ajouter la combobox de choix des offres pour le widget des encours conso (3d97e8499d2e7949a07c52e88270de266356ce53)
- Correction de bugs dans les widgets de la Home page (76c2a15e98fdeb42425ceefd142595272ea1d427)
- gestion du contexte utilisateur pour les widgets (bde061a798892c3cfd4b2b34e8a54d07e573e604)
- 638 Le widget acte de gestion doit réagir au changements dans la bare de contexte (fb5b766dcce327d3cb5d89c8da8e6b91a8545610)
- changement du style de la gauge (f8a56c0091a412824b46e167ed1c834890558b6c)
- **line detail:** affichage de la date en cours (b7a35efaaaa72640d707d212dd75792f4062ee66)
- corriger le filtre par date du graph SMS (220561a6d4937aabe024d3e978186df7ae3cb858)
- 640 Correction dans les widgets (5661a82e4e5aff50c56cce917880c8c35d3933fc)
- Correction des requêtes avec upload de fichier (998e7aaf37e6d6b84df50c9b9f64bc19f0f66337)
- **act creation:** changement de l'ordre des actions dans le carousel (f260598e591ac804815814f3ef72523b15e5a2e5)
- **lines:** affichage de la valeur msisdn en format texte (5925eb0e5baae50b593b47ad72edf52633784505)
- **line detail:** affichage des custom fields prédéfinis (f53ee7855aaa1a3b3b49134f73f7c8590aa5d6f0)
- **line detail:** affiche les custom fields pour les infos de section (dd8724c4aa4063fcb038aebb0840f8a0ac3742ab)
- **line detail:** affiche le tableau de consommation data dans la supervision (4cac50950be83ba92bf344ae662aaeac18d1cd11)
- **line detail:** add graph conso data (087e7026020111228344b5e7ef8c70909ca5270e)
- Corriger l'appel API pour la résiliation (8161f212d313dec1d5bac66b8ad280619072f701)
- Correctifs sur la page commandes (933cdcf0fa880ce158d7081c8ea9bf28c5709da1)
- Intégration des erreurs lors de l'ajout de demandes de contrôle (fcdee8f48effaa81889b13cac38275cb63ba4212)
- **line detail:** formatage des colonnes de tableau (29d74d654c5c4bf312c0d79d4160e31fca7147b0)

## 0.6.0
2019-08-08

### Features

- intégration API changement MSISDN (5bafafd03aede99b53f5d2a2bbaf54f0a6a99402)
- Configurer le Changement de cartes SIM (08d0a02cc99f1c44685af784f2d99ca7ffeab9c2)
- 341-filtre-plage-iccid (bc38853c79ea381a0f3865d6b18b5bd68c5aa775)
- partie front pour activer/préactiver des lignes (6e825ff03c023db47231139e66b9244e3cfac747)
- ajoute-filtre-obligatoire-reactivation (81dcbe2cf94d477bbac8d5e718c5da1a83fb767f)
- ajouter service data dans la modification de services (32ddec270d1c53566b816b3066578d4e45163d62)
- création d'acte de changement ICCID (7e7225e19e817022884ec524f31f9d53bd9d171b)
- 522 Partie front de la modification de services depuis le détail d'une ligne (ceae9b1dd8f89ac54afafdf76bf3d5eff4d82a23)
- 705 Exporter les lignes (01bc1b5ea3c0717eeb8030b02e4fc4845532a983)
- **homepage:** 639 widget commandes (24053ef44ff05786591d19406174a6321180c8b3)
- **homepage:** 639 lien vers la page de commandes depuis le widget de commandes (23e7eafef78b75d008b7a0336b46d3b07681ffda)
- 639 Bouton voir plus (a29f14f688a8ae073308b0fab7e0fa063f5f00fb)
- acte-changer-offre (e88d32ea43906362ae88517d18b39fdad2af2ef3)
- detail-ligne (dd7ef5ab2c3619e5832f64aeda9f6814483d78d9)
- **homepage:** 667  Composant gauge (44864c0d172a890a6703417279da7cff32d8f3dd)
- **homepage:** 669 Composant pour afficher les dernières factures (e1f44530a36629386476cd968e263d8fe9ec7962)

### Fixes

- corriger bug sur la création d'acte (6a6c9b22585d3b55f18cc01baa6fbd9eee43647c)
- format date (fa4bc8a38ef4bb93c94e5cd5bcb24027bcd7a083)
- redirect by indicator (92fe3e88769ed8ae373cdce13451b7e7ca9be939)
- **lines:** add filter search by file import (86aafa9919d4543f1d7afa64b6c13d48369b1d89)
- correction style (71aef6b07d87718a567c01e187fa52dc119d12f5)
- label (be12af39a58daff0335b8ebb9300eec3dfdcb11a)
- Séléctionner automatiquement la France après Autocomplete de l'adresse (7cfc6762f1a0bd1eed2a52ba9f54d5fba4a3af9e)
- affichage conditionnel du form de création d'acte (e62afd75110687ff9d1bff2db017862800580b4f)
- filtre par import de fichier (8a5c9fdd9be72fbc7e83219dd36a8f65069a5bc2)
- Correction du formulaire de changement de cartes SIM (e850387cb4e06f2c497dbdb6e4e13d5ebd28dcb0)
- Ne pas lancer la recherche quand on choisi un act (a35eec111f490222c9f54e2f6e52c3591d0c4e52)
- correction de bugs d'affichage sur la création d'acte : changement service (25ef881a8129aff7251e7a56854c62202a4178cb)
- dépendence entre les partenaires de la barre de filtres et pré requis des actes (35eebdd48b3474b066034ac4c1efdfc9bc5ca497)
- local storage table lignes (7cc9d406557e0d365cee6489e25f3a5356582b6e)
- 585 Validation des inputs ICCID et MSISDN (8786e8fbe9fb508d77ac91a3793ac8cd08143286)
- 632 corriger la recherche avec prérequis (460566cb79ec43ec62f0bd9c1da462b45c7c7e46)
- 705 correction de l'export des liges (6f6363a35f22c0563022a6f4cfe21df368c3e937)
- filtre iccid (42ce52589200a2f01326ff7403e2f54168c46f43)
- 632 lancer la recherche quand un partenaire est choisi (afc3f0829a0ebcf2e4185f051661d96dad152ead)
- 536 Corriger la recherche par import de fichier (ac956b4a558e5812a92911e1c6352fadfd95e937)
- 585 corriger l'affichage des erreurs (7649d3013f6d935c60b777a312d5aa6eb8763f06)
- 521 correction de l'affichage du menu dans le détail de lignes (33ccc692bf9b319653f0e1b93540e4ab4cac55fd)
- traitement des erreurs d'import de fichiers durant la création d'actes de masse (569df3a4edfa553a73c85b55f77a13f422c7596c)
- **homepage:** 639 intialiser corectement le filtre par ID (aae485ad3a2e5a66295c1b2c5552c0005c5b988f)
- 521 corriger la valeur du status commercial (20a31c94b29f0bbb39d1f10404dede4577cb8331)
- 639 Correction des filtres du widget commandes (8d3fe0d1dc072f6d80cbfe7b2d8df76039de4eab)
- 632 séléctionner automatiquement le partenaire choisi dans la barre de contexte (dfa18c2d74589e2f67998671b18790dd599a1a7b)
- 478/change offer (7971a11936d34aa559c5baf609020297935c3680)
- Corriger le sorting sur la colonne partenaire dans la recherche de lignes (1631b723e45786f4b25c4b95da096d611a1e4c7f)

## 0.5.1
2019-07-10

### Fixes

- correction CI (d57e83c3142e61232e88d98955922f2b7adf1353)

## 0.5.0
2019-07-10

### Features

- bar search lines (6a0d6e266302daff615e7c6ccd760887d67c4a91)
- informations-de-ligne (4eca48e4b877978b3ce0336220e4035908b5172d)
- 359 resiliation + feat:433 gestion resiliation (b8917b0561827e6b1166999b23fd04e1262db455)
- changement de services (a20768053d1dd896a478eb4df37c3f89ebb07d70)
- 433/gerer resiliation (118dac91f873e35130ae4bd40891b98fea657372)

### Fixes

- corriger la persistence des colonnes des tables (7b85eac912ef89ee442cb7ef0f59b4d8a5576d8d)
- CI Deploy UAT step (cbb953f7cf4144ed4bb52f4bee25790b687a157f)
- **orders:** refresh indicators (6016a2b67225e23773a60f88f6d7f7de9e341776)
- use case color (ae9f4d64073379debe88a2ca7041ae4634aedfc0)
- fixer la liste des types de partenaires (2ec0c0bc051f508c5ee466d780980a12b0737c1e)
- message d'information sur le carousel (098b1902b2c2d14fc491ae49eb599f6fb0ef4cc0)
- **lines:** display line details (6c0afcdaa2ebf8c8048216a35ecfba40416c8c20)
- **orders:** add action validate in the contextual menu (035be66dc26a262dbcfda921434cb18bfa1b7202)
- bloc détail acte de masse qui ne s'affiche pas (7f41844e26bd28100b36755abad2290971672237)
- correction du contenu de l'infobulle (d937c0ebc1dbd95b302d8a185881624f02fa6ac4)
- **orders:** set current filters for each indicator (6cfc6e2a64eca940fd465d98c0a79c3f8dacd1b8)
- l'offre est un prérequis de pour la modification de services (2c664126afba47106fe9b5fa0cd5effaebbcb9bb)
- **lines:** search by accessPointId (329823423f0ee90a2319cad98693b834ea8db543)
- 433/gerer-resiliation-delay (eca05344004061b798f7718d147345edcbd203f0)

## 0.4.0
2019-06-25

### Features

- reactivation de ligne (e527bdde85baf5cce9a10571d204209c631adb53)
- add act creation phase test (44670904928aaa5e98efd245f69b8c6051a2319a)
- envoi SMS (7cf057141a12172723b7fe189092d5a6025ccf26)
- suspension MVNO (497aea9b06d1d60504c0233b3c1ca757500ca60a)
- acte de transfert de lignes (c5e4d3b13daab8e697dd79fb18e28fb8d4c53f8a)
- act changement CF (6fa86b339b5c42b081adead631b5331d95c7463b)

### Fixes

- correction de l'upload (76456aba8c7e5f2a896f37bf49ccaaac48317129)
- options de la reactivation (d0c8dfd8b5f4ec989c4e2dbbf6684011d5ca6599)
- reset selected lines (a5f2e7b6a752f37a2deab6031a30d73879d3fb5c)
- acte de modification des valeurs libres (d017840dff261e4fbbb5627424a4e15bb65e90bf)
- ajoute filtre obligatoire pour la suspension (5738c4348bfb7ee659cf28381d698b1d645d42ff)
- display details action send SMS (a9b11d07f0745fde24a3cb365dfa51ced43c6730)

## 0.3.0
2019-06-18

### Features

- filtre status commercial (bab68d6c5064d56d4a2b5a688553df8f0b8c7050)
- **gestion de lignes:** intégrer les indicateurs (97cf95a49a0409f691fead04fa4399e72f4ce8c3)
- structure creation acte (a1bf1b7a93ea30b78e303d48dfe4210efa874ae3)
- **création acte de gestion:** -486 Composant création acte de gestion : filtre par défaut (27de5d858d283425962981562fa0e2938a02c9b7)
- 440 gestion des incompatibilité de filtre (d97c72e52a6f74c6d93a51fcfabc1afa28651026)
- Composant de création d'acte de gestion : affichage pré_requis et formulaires (1512091ec68abaa2bf154537bb04744a7f02f5bf)
- calculer les indicateur des lignes que si in partenaire est choisi (c6823eecf6053a7bce964e62bef660ff8b9cb89a)
- filtrer mes commandes par type de carte SIM (4c87a3cf9b5e2c0b0d6482f2d7fb75caf1468265)
- quand je n'ai qu'un élément dans une liste, celui ci doit être sélectionné par défaut (0967bc2acf672316f52de7f7991c624782421e9e)
- gestion de messages d'erreurs (2c6986771deb86740d199d17c09ec1fc01f55e60)

### Fixes

- titre table des liges (6a6c4ee7ecc643abcbf641fc78bcce7a3658dac0)
- circle loader (0e8f4c7dbdc28166bc624c722f145d60ea0c2053)
- rename ICCID (04d7beaab43376481ca90774f94911bf7924ff68)
- loading indicator (ec5b6cc37205605ac75b965822950b073b9ffed2)
- custom fields après création de commande (f7968c5c337a0433e927026fa22d15f7370cc37d)
- indicateur de chargement sur l'historique d'actes (1700d629cbe7e7f36c679660f9ff5d40bdf7306d)
- unit actions (62a516044519733b94866dee8a5dc90735ee517e)
- semantic versioning (a286e6b92f7f2b343c7261448488ba697bc15eaf)
- translate statuses (3cf4ea60a4997b4cb2f273a8c1794534618865fd)
- add code info to country (5d45a176e0aa1c7db4a7ed2bf5fb9bafcb4f8551)
- corriger l'affichage des sous menus pour la résolution 1024/768 (eb7d57f4bc3b40f887888e7d1a426ad7ae62e79a)
- filtrer par pays (5da1156fb03507afbac08fdc72ca2ee518f91ad3)
- composants de base pou la création d'actes (86762f268213afa98d833a4fb409c73025af531a)
- recherche par id de unitactions (2bc47bd5614d2808cf54f83233d7c65432ee5bd4)
- lines table (e395e94f1a30dc9674e3ac5e5ec415c9423403ff)
- enlever les console.log (763bab93c01b1e85d71e9bf3689e05da871dcfdb)
- colonne checkbox ne doit pas remonter dans la conf des colonnes (88af22a2e659fadeb292bfc1fe7b075e5e1c757e)
- total unitActions (332a1d1166453a74b7643432117a08e65f65d69f)
- traduction et tronquage des actions dans l'historique des actes (df03249577739f4df0f9ebe22125f7267aa88fd9)
- tri par quantité des actes de gestion (74cf57b26aa6b879f96e57a82910b0b1b3bbc514)
- correction du libelet brevet (194a2c9fccd1f1f15628af0d56ac755b37556550)
- problème d'affichage du nom du créateur dans les actes de masse (063c887b8d3da756a288e4a88618f39e792c741d)
- corrige l'affichage de l'entête mass actions en empêchant les retours à la ligne (e860b87f310cdcd25f5ddd09073b23dc2fbc9fca)
- utiliser le code iso3 dans la recherche des lignes par pays (066f494dbc093af68949878b886dbf5e4c70596e)
- afficher les indicateurs selon le role de l'utilisateur (7f5060f139b6637a22dfdf0fe5bb591f86512fd5)
- cacher l'indicateur "actes en echec" si sa valeur est 0 (1cc407d8b1a0398d5e5d64b364029f14135361cf)
- affichage des adresses (018f876cf89aae74e7bcaf122f68dba0553fd6d1)
- filter import file (5385f8120d09779eb422e0ff50633f6bef1b7f12)
- set proxy to proxyace2 (ffd692aa682218c2a70fedfef5d15596be64afa8)
- uat release pipeline (8cdc7a3636c346f7840b4294e4ee43719f40e2e8)

## 0.3.0-master.47+20190618162402
2019-06-18

### Fixes

- uat release pipeline (8cdc7a3636c346f7840b4294e4ee43719f40e2e8)

## 0.3.0-master.46+20190618151156
2019-06-18

## 0.2.2
2019-05-29

### Fixes

- deployt UAT job (4b4337b3b24d097b0a85bb5dac4bc36c700c95a4)

## 0.2.1
2019-05-29

### Fixes

- deploy_uat step (0c16ffb3ae3d324ccb4465f53b6a3bf0b17ae8a5)

## 0.2.1-master.1+20190529153527
2019-05-29

## 0.1.0-master.53+20190529152358
2019-05-29

### Fixes

- deploy_uat step (0c16ffb3ae3d324ccb4465f53b6a3bf0b17ae8a5)

## 0.1.0-master.52+20190529144945
2019-05-29

### Features

- Initial merge (eb5b5bd821708d6107cfb8ded5b4dad56d93f1c1)

## 0.1.0-master.51+20190529135801
2019-05-29

## 0.1.0-master.50+20190529133731
2019-05-29

### Features

- filtrer les plages d'ID (e83e1ae8bd16e2c7b88ed5382fda73959cecaf41)

## 0.1.0-master.49+20190529095801
2019-05-29

### Fixes

- descending > desc (01bfaee659cae55e4812c0d54545866b973ea00f)
- pagination ie (558b1245ebdca516b57e54687483bb0ff9b795a6)

## 0.1.0-master.48+20190529093638
2019-05-29

### Features

- filtres code postal, pays et champs libres (650196cc2d533de559db7172dd387b02ba333f79)

## 0.1.0-master.47+20190529084329
2019-05-29

### Fixes

- pagination ie (558b1245ebdca516b57e54687483bb0ff9b795a6)

## 0.1.0-master.46+20190529073843
2019-05-29

### Features

- **gestion de lignes:** date filters (1db4299fb8cce9a6163d54cfde2ca519c2c00028)

## 0.1.0-master.45+20190528125007
2019-05-28

### Features

- **recherche de lignes:** filtre status de ligne (ea4425f15aa8ae0cd2292b0322359102a5cdd414)

## 0.1.0-master.44+20190528123146
2019-05-28

### Features

- filtre status de facturation + status SIM (85b978d05f9f6738dc7c8cf064948f1548c94818)

## 0.1.0-master.43+20190528100750
2019-05-28

### Fixes

- MAJ des champs libres pour utilisateurs BO (52a2851035a7cd99d940b1ee08e826e856c038ed)

## 0.1.0-master.42+20190528080620
2019-05-28

### Fixes

- ré initialiser le filtre CF à la MAJ du filtre partenaire (f36ad937150873b22e1af9f229ce102e654e3228)

## 0.1.0-master.41+20190528073315
2019-05-28

### Fixes

- afficher types sim cards (550e20afc8e3b305ad8a97901aea3ccb135291d5)

## 0.1.0-master.40+20190527140057
2019-05-27

### Fixes

- update custom field list (c834883297fd0614de344105efdb48850f636e41)

## 0.1.0-master.39+20190527125435
2019-05-27

### Features

- table lignes (0812e33f5379ec552c51b23678f18ce8a88eab40)
- tri de la colonne produit dans les commandes (44e9611b9c11386764f7c49ac16d3276dfbb4a9d)

## 0.1.0-master.38+20190527070931
2019-05-27

### Fixes

- colonne détails actes de masse (8498f32a84ef7bd5b5e5d66c3618a7138ff49c0c)

## 0.1.0-master.37+20190524153334
2019-05-24

### Features

- détails des actes de gestions (d08f5f18be85c772c80803ef9a447eb051abfc89)

### Fixes

- **mass actions:** Colonne partenaire (1ecad9b0cc9b642affdcbc8c9118679147841715)
- total des actes en cours (8a130d1fecee37e941a093ebca9757aa50af5e1e)

## 0.1.0-master.36+20190524144128
2019-05-24

### Features

- recherche par id d'actes unitaires dans l'ecran d'un acte en masse (cecabba027dd1c24de030b2b003ad4caf3f422ae)

## 0.1.0-master.35+20190524133436
2019-05-24

### Fixes

- nombre des colonne visibles (933a5fa38f85dfb3c0dbd730ff85a7e7a789f4cb)

## 0.1.0-master.33+20190524091935
2019-05-24

### Fixes

- corriger les valeurs des indicateurs mass action (9814f445f66c2a5a3b9ef99d6bd63426c7916a3e)

## 0.1.0-master.32+20190524082107
2019-05-24

### Features

- barre de recherche des massActions (9a0d98dcb45fd10016b71d8f20a0545023fcd171)

## 0.1.0-master.31+20190523131912
2019-05-23

### Features

- **actes de gestion:** Ajouter filtre "créateurde l'acte" (a2324788dfd80799245474fd9ef662a5de4198a8)

## 0.1.0-master.30+20190523125517
2019-05-23

### Fixes

- charger les offres si aucun partenaire n'est choisi (e627c0e128527565e735d10dc5d594689fe7e7e0)

## 0.1.0-master.29+20190523123301
2019-05-23

### Features

- intégrer l'api d'export d'actes uitaires (79bb0c3613cbbbe48d6ef3e315d96e7636ccc756)

## 0.1.0-master.28+20190523084829
2019-05-23

### Features

- rediriger vers la page précédant l'authentification (58da822fcd903fffbffed93ef4748952e0beb4d6)

## 0.1.0-master.27+20190522140326
2019-05-22

### Fixes

- kubernetes deployment naming (5c1e8bbd3999e49247dd38937a4d1206c2a56a2a)

## 0.1.0-master.26+20190521135012
2019-05-21

### Features

- ajoute le filtre d'offre associée pour la gestion des lignes (50ce968fb7da357859ce673c58a40e1dc53239e0)

## 0.1.0-master.25+20190521074053
2019-05-21

### Features

- selection lines directement sur la datatable (779829c30fc29c427b157fc22219e660972d9903)

## 0.1.0-master.24+20190520084610
2019-05-20

## 0.1.0-master.23+20190517095452
2019-05-17

### Fixes

- mettre à jour les requettes unit actions (dbb806c6d4ea469fe833a99a660f10568f329095)

## 0.1.0-master.22+20190517091508
2019-05-17

### Features

- intégration de la pagination dans les actes unitaires (25831b723cff513179eedfdaf5412e8ddc5d6d9d)

## 0.1.0-master.21+20190516150942
2019-05-16

### Fixes

- update custom fields headers (6de893afb60871328efd49399b2420ad75059e70)

## 0.1.0-master.20+20190516123124
2019-05-16

### Fixes

- plug api lines (3abd500a3745482c3b6b568edd62f137fb3afb61)

## 0.1.0-master.19+20190515150027
2019-05-15

### Fixes

- renommer le champ orderedSIMCard (9b4b69241d6354c390084fddefadfdd5565a99d8)

## 0.1.0-master.18+20190515144617
2019-05-15

### Fixes

- export unit actions (7e0a674a6be7ae525f7d3fbf3ab6fa3ca59d12c4)

## 0.1.0-master.17+20190515100839
2019-05-15

### Fixes

- gradle multi project (896b87947840108dc8df27c612b95e7577d53fba)

## 0.1.0-master.16+20190515100958
2019-05-15

### Fixes

- mettre à jour les colonnes stockées en local storage (bf5939e51e5d33441978b61a6e9d7c4b3197da0e)
- corriger erreurs de lint (c832d723c0104ca3d9d08fc2f43171f390081a3c)

## 0.1.0-master.15+20190515075142
2019-05-15

### Fixes

- code postal est une chaine de caractères (e4cca582e5ffc64925b350f95eec2e5e105fa7dd)

## 0.1.0-master.14+20190514160107
2019-05-14

### Fixes

- gradle multi project v2 (1bdfd684324e27242872fdd36e721b6336488230)

## 0.1.0-master.13+20190514153926
2019-05-14

## 0.1.0-master.12+20190514151402
2019-05-14

### Features

- filter lines with type sim card (6064fcae2b557311d4d9edc4d6785d91f270fdab)

## 0.1.0-master.11+20190514150108
2019-05-14

### Features

- filtres de saisie de la gestion de lignes (d1f2d6d248a26de527e36e15af98d535e1ad84a3)

## 0.1.0-master.10+20190514135618
2019-05-14

### Fixes

- gradle multi project (173391c57f4700867135f407dc8e1603f36910a6)

## 0.1.0-master.9+20190514133019
2019-05-14

## 0.1.0-master.8+20190514100330
2019-05-14

### Fixes

- utiliser le repo npm docapost (e19909669091b80740214470e6e188765383a5f4)

## 0.1.0-master.7+20190514094115
2019-05-14

### Features

- gestion lignes cf (a4e7cda819e438d84967237735b73b3f1bb6bc1c)

## 0.1.0-master.6+20190514092412
2019-05-14

### Fixes

- corriger une erreur de lint (7b41f5d47a857db8c7a3ca344591400727774278)

## 0.1.0-master.5+20190514091004
2019-05-14

### Fixes

- traduction des sous menus (732f34527619de878ec8133affb81b3fbd3f0f8f)
- noms des colonnes de la table des commandes (e6e97533c7b4ccb4aa2002af8533beba896b7391)

## 0.1.0-master.3+20190514082851
2019-05-14

### Fixes

- add another pattern for the resource handler serving index.html (15ac9e05709a60b67dde65af9fd2e3ebb7f88378)

## 0.1.0-master.2+20190514075925
2019-05-14

### Fixes

- met à jour filtre de status (79cc24da2046f276d8d53452aa18e39c885aa091)

## 0.1.0-master.1+20190513153854
2019-05-13

### Features

- ajout de composant d'animation pour collapser (589416ba1087009212ea09823755d436e2fcdfaf)
- ajout styles de base (5129299da96ddc43318b2ac661bc37f7bcea8eaf)
- **ui:** ajout de checkbox (5b13c482a77537f4bfb8a38861bb5edc5fab50a9)
- input de recherche abstrait (a99204f5832a935cd11a27b11fac21b1638a2b3a)
- Ajout d'une table avec drag&drop sur les colonnes (32ce462bd9ce9de695f53a392720e7fa642a3138)
- ajout du carousel d'actions (dd853bbfc4965f0fae9b11fb4b13636b0e611e3b)
- ajout de SlidePanel + Draggable Home (52616f95af3260be93736b2ebb35917545bef40e)
- Draggable home + SlidePanel (eb0941e0e9fde4238bf50e07595ce9026b6edfc4)
- **autocomplete:** ajout d'input d'autocomplete pour adresses (77840450f146aa84cbc5bee3b8ed935ecdd2ff0e)
- popin pour enregistrer les filtres (c2d51d5d0972c03751dbb8b7e573e560d81a2c8f)
- ajouter un menu de naigation (1e087219a134496737fc0130d8f23effff0677e7)

### Fixes

- Checkbox.vue (fa39ca32476736cbf0ceb8861f4ee2845976b620)
- création du input et select (cea839e66941cffac1a6e289c683f9979b766a76)
- création du input et select (a524f885bd960ea81ffe4d70b78aaa1443c34557)
- remove dead code (3d892b886aa85958146d25eab73b5db2bbf22518)
- refactor code and add TODO notes (bc5f49bbb71853e16b4b226b4d1c9fcadc5664f8)
- update jest-stub and vuex-mock-store (ac4de80df6b8dd73c6f0664e73279f55da337023)
- update @vue/test-utils (bd81bb12cbe6cb509f73de49c8498a5a6fc00ecd)
- use lodash-es + webpack/babel plugins (7e6a28f9ee02c28e63b8bbbbb7f0f49ad2688ba1)
- **moment:** ignore locale files by default (cf2a91b8073a345f1fe9d2289d3c872eca00a812)
- **multiselectsearch:** show less button (892b70fe729e3dd0d18405d981692b101d505257)
- **multiselectsearch:** better computed (b02bcacce4d7675e12c128eddd40c6f13804d034)
- Confirmer une commande (b1572a5cbec69294263130491ac5022983eb11be)
- selected offer description (5a349427a5906845b8eaabd21c718c18203c7756)
- temp waiting for array status from ejb (646238645b7a068ebe08284639b7f6f2df3339a3)
- return correct value for bobines selected (af01106e48a0649a2b39b9b4463971cfb7f8442f)
- **ajout d'éléments à la liste de custom fields:** #420 ETQU portail, je veux ajouter une valeur dans une liste pour un champ libre existant (ac34ed9dbb28ac63d8410e7b79d7f115debef3e1)
- régler l'affichage des adresses (7efad1f04e3c4167dba7dcbdeccca829c02112a2)
- list component (9a229de4757fdab83c23ee5e0891a90efc4efbed)
- refresh mass action (918cc2c3761c810ea9daab35d5341ec226102299)
- ajouter prefix à l'URL (879b24d6044b861fe9131e7873fe54f5f1ec0c74)
- integration semver (38f2eb50a638caeff2cee9320d65bbe54933792d)
- semver implementation in gitlab ci (94a3a714029e4d4166fedd25b58fbec427ff0023)