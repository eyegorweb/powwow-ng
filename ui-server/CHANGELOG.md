# CHANGELOG

<!--- next entry here -->

## 1.12.3
2020-11-02

### Fixes

- 2029 mise à jour de la colonne Dernier pays pour la gestion des lignes du parc (34c39f52ed1716bd9b6f087abd3a883ddecbceea)
- le clic sur l'id de l'acte dans la liste des actes de gestion (c4e87cafbe180f049bcd0a2242e4c0cadd21dfea)
- possibilité de séléctionner un identifiant (621d6d1e72de32aec8323cbca52f29c116467a4e)

## 1.12.2
2020-10-31

### Fixes

- Correction de l'appel graphql pour afficher la page détail de ligne (5dc1fea418d23c3b5a5cdd955c17f93483837e06)

## 1.12.1
2020-10-30

### Fixes

- Ajouter le party id dans la requête de création d'utilisateurs pour les partenaires (66710bb03490d860aa21f6f1d5066f5e101ed8d8)

## 1.12.0
2020-10-30

### Features

- Ajout de la langue dans la création de user (9c66e6d0ed1ee824f3e7d0c5b9edab99b3bb26a4)
- Conditionnement du changement de service dans le changement offre (f67000a68eac2c96a3077c88a4bfbd13bd13c950)

### Fixes

- Suppression du bouton autour des chiffres pour le widget top 5 alarmes (7a006c1e43e035089566f9ca82a9dcc01dd19367)
- Debug du nombre de SMS dans encours conso du panel detail de ligne (ad71d98c203843d399f59ba0ccf60e917d48df82)
- 2005 ajout des permissions pour la redirection depuis les liens Voir plus des widgets de la homepage (f7944009ce3b67b3b719913e08ce84bd613ea12f)
- cacher "en cours de consommation" pour les utilisateurs autres que partenaire (adaef770c94aef7fe12784d00b2a3109e0a7438b)
- Suppression du bouton de consultation dans le widget recherche par id (ec858b7ef75597bfce151e84a3da778ef40c74d5)
- 2008 formattage 24h du widget Lignes les plus consomatrices pour le type d'usage VOIX (86e55cd374c9479766ddd59b1fa30da6f5745423)
- Problèmes de traduction sur le graph SMS dans le tableau de bord (ad9a408c7a03e555e0ef52c6a1f6fac9094f1ab4)
- 2023 gestion de la modification de l'utilisateur selon les utilisateurs connectés et les utilisateurs à mettre à jour (aa9ad71f3ed4c2255661a20d3c379a2520ee57a4)
- détail d'un acte de masse non visible depuis le détail de la ligne (75cb8074072bfc0ba2693157da433e8f308febee)
- Traduction du tableau en Voice des legends (5d2c57a7577e75fbee8b37aa1be612f36c1d67e8)
- Si modificaition user alors on récupère la langue du user dans le form (0aa842cc41ca6562bfd3c49f057be626a857bbdb)
- 2026 mise en place d'une gestion pour désactiver le préremplissage des champs de formulaire d'identification (c46d3693181642b651357e1ecefd00b4231a18cb)
- 2030 gestion de la permission pour modifier un utilisateur (0a4e63691e1229a70f0b3e61e0ff1d3ffc131a9d)
- afficher toutes les offres dans les prérequis de l'actes "changement de services" (3c78fd66ad92aa7e1d5510b32068fff23cd73f7c)
- 2023 mise à jour de la modification d'un utilisateur (d69c634b0f86d35504084cadb21dd55b162b8993)
- Changement du nom du label du widget de conso (8c6b468273900101d8905f1834ee158151c485d7)
- 2029 récupération de l'info Dernier pays pour la gestion de lignes (bb03d3d09f8d82d07acd8cf07a601ab25b2e422e)

## 1.11.0
2020-10-23

### Features

- Ajout de l'action de suspension de facturation (8cc8b6c17c434e0316708c41ff9db9afe37faa8b)

### Fixes

- Nouvelles colonnes invisible sur TST test fix (d912a5c099016190ba8ee2cd7db5724891921f6c)
- désactiver les toggles dans l'écran tranche M2M (ae2770c4a31e6a67847b7bfa27ddce82740da435)
- Problème de croix sur UIInput (593a18921688eb270b0e797663bfd444d53de13d)
- Suppression de la croix quand input désactivé (f7455d4596225eaf0d6d2bc33d91d73ed2da071b)
- Ajout des données "en cours de conso" dans le panel de detail de ligne (abb5a2f1f82281b77827bc24c7d171b144c04898)
- 1992 gestion des paramètres des encours conso (f8f6e01b29f47eeb6d0f582a2962ff354e4c0287)
- chercher une ligne par ID comme prérequis de la création d'un acte de gestion (92ebdea12e7a8c6629116465a46a8b6af16434d9)
- Bouton annulation dans services details de ligne plus disponible apres sauvagarde (7608187a87b70e8369f7a80d16dc7edaef94da44)
- 2009 mise en place des permissions sur les liens Voir plus des widgets (b3d9f3803fbb1bb60b3ffe7a8074e51704529eb7)
- 1747 amélioration du filtre type de carte sim (261b51064acc605edc683d46413e974086cb6ae7)
- Correction du choix du CF lors d'une activation (1547d2b734c9d4f3ac5b531fb269f1341ef46fcc)
- le formulaire de preactivation doit être affiché même si le CF n'est pas séléctionné (dba7f960b490f715aec6c2e265f25cba802c75a8)

## 1.10.1
2020-10-21

### Fixes

- Enlever les mocks des menus (9724d94249ca02b77b01bde5dd5ebbb28756fbb3)
- Ajout de la traduction pour fréquences théoriques en anglais (5b0592b26b93cf37fff4f31cc41954ece1b6c2de)
- 1997 récupération des rôles pour le mode création d'utilisateur en tant qu'utilisateur partenaire connecté (6efc77164d2bc73bca1fb2d5ce3cc8a7722f97ad)

## 1.10.0
2020-10-20

### Features

- Ajout du tri sur la table de transfer de sim (caa39623616e0f902a947f5938074e1cfc4e7442)
- Ajout de la colonne email dans la recherche d'utilisateurs (5f14f1b5c83ecd8db26d7a2cce93175c6be763e8)
- Ajout de la croix pour effacer le contenu input autocomplete (ea2cb18199976eb90f7950c09f00d6f7d365a4c3)
- ajout de colonne dans l'export des lignes (41740a485be9ce1b3e89f033d308be3e11007e67)
- tranches MSISN d'un partenaire MVNO (03e070aa6a21a8ef698f6078bfcff35bd8ad2780)
- Ajout de menus et traduction des menus (deed39efc47def45c10c58cf884609477de22b52)
- Gestion du preac en fonction du detail partenaire sur la commande de SIM (b0978942b7f1e98017bbcf33017f1708d248251b)

### Fixes

- Correction orthographe panel alarme (8cdd594f5cc7542d25cb486daedee050401b0d65)
- Correction du filtres d'actes de gestions (9099047083b0b347a653faeaf8fbe8f62c331d6f)
- Taille du label et traduction dans le panel de creation alarme (4fa4dc45d312e4d7a1765009d6db88aefe07f856)
- 1955 ajout du style des menus actifs (5b562545d77e561e68dda75d08a023bef332b77f)
- La croix était transparente sur linput de recherche (457d85fdc5bc40d4506f1d1b3ad729758a06490a)
- dans le détail d'une ligne, le champ partenaire doit être masqué et la portée de l'alarme doit être en numéro 1 (631fdadf612345117363bd62d35c155162699dd2)
- 1956 ajout des permissions pour gérer le détail des partenaires (33d74f4f77a33eea07098d322868f65e706e06b5)
- Problème de pagination limit dans le tableau des rapports (261f81c1749943a8e12ccf50d430283ceb196a38)
- Modification des services en masse (42c369696cf8ba002b16893092ff6183ffb40b99)
- 1738 mise à jour de l'api du graphe Nbre de lignes facturées et détail des montants facturés (28bfa1fb2eaa9f0af0c71d8dd2202d5cbe2730ea)
- Changer SIRET pour SIREN sur le CF Marque blanche (b545747c1ba67483948ac52670896644614e083d)
- Désactivation du survol sur les chiffres inactif du widget top 5 alarmes déclenché (1f5eaa576b5cfcbf6bb4f236ee72e2266c5b3c27)
- Enlever la mention "depuis le" en double (ca6badec73c36091f70698a0704764c99513dfb6)
- 1969 mise à jour de l'acte de gestion de préactivation / activation (e80d1a1c3d3ec38df672e5e6c94317b47ae87737)
- Orthographe sur le detail historique acte de gestion (6df032bbc86484b7a23fc05e250ac1179370274b)
- 1975 mise en place d'un loader pour la confirmation d'actes de gestion longs (3cb9241963e100df78ddff164c217df34d807f3d)
- Add new export getparc (c63c3166af9495a6beccd71945ace2fad5680288)
- Sorting transfer sim table (8f9701a6869f079428548c28caf568779baf4db7)
- Changement du point API pour la traduction du statut commercial (3fdb26e2d505a11399c66494ea5509a97f0a458d)
- 1975 amélioration de l'affichage du loader pour les actes liées à la résiliation (bd915f3e2b2e720bd5d9457cab5feebcb8549a71)
- 1912 suppression du filtre partenaire sur les alarmes pour les utilisateurs connectés en tant que partenaire (e207589c33652beaabf87121210869dca618ef95)
- Gestion des appels API et scroll sur le changement offre, service, preac (58240b43dca1ea16da0e22ca759fe301f43e4e89)
- revert de la croix pour réinitialiser l'input de recherche (313a17a4396d5add5d1e0c92dd319c9914c3cf4b)
- Ajout dune ligne dans lappel api pour le statut commercial traduit (411e35c9ccef3e1e90465ee1f326cc9bb24c2748)
- 1969 mise à jour de l'acte de gestion de préactivation / activation pour les MVNO (c02c4f8ba1292d945d5b4cd731e685cff09b3769)
- Zoom sur le département lors de la recherche par code postale (4c70a83cf0c54a977c592b980ef53d07aad4d44a)
- Colonnes en doubles sur la table des lignes (47046bbb948e7f3575127a6bf8c6aa403b896670)
- Croix pour réinitialiser la combobox (95d6ae3012dde88d131324cef29fa3aa5986e796)
- 1969 mise à jour de l'acte de gestion de préactivation / activation (4e4c3739e093adf5a2e5f1e38527a467b4be11a6)
- 1997 récupération des rôles pour le mode création d'utilisateur en tant qu'utilisateur partenaire connecté (176822e767171715c6fe0130651f3ce390f9973a)
- 1969 mise à jour de l'acte de gestion de préactivation/activation (2f86fc33d5f8955e1ad472086d15eafb54eb2a53)
- Ajout du drag&drop sur la colonne succès/fail de la table historyTable (843474b37a3f8755c9c33d8d578d0f3528b4ebc5)
- 1981 gestion de la permission pour la création d'un utilisateur (8e39787d3cefc0f841f2589dacf4975bbf70939c)

## 1.9.0
2020-10-13

### Features

- Récupération des filtres en cas de retour au tableau des actes de gestion (66414ffc48449b35e7cd6a81d0eb15616e7ba9b8)
- Ajout des colonnes CF, Statut commercial et Date dactivation dans la table des lignes (376c33d54a78090d3fc8935b278f5184ecddc28c)

### Fixes

- 1956 gestion des permissions pour le détail d'un partenaire (47d93b59c61d79bf1e1c76d07675c8960f7d5609)
- correction du style des adresses dans le détail partenaire (352bd8eb41097272865a025db820f857f45e9105)
- 1956 ajout des permissions pour la gestion du détail de partenaire (1d9bc1613f970d0c36bf397654b4ea04eb6f5f2f)
- Traduction des graphes (6eebae9ac38218842023259a6bcce94f8b36a16f)
- Gestion de la date de fin de forfait. (b95c756b65adb67fa64ff07f3639b2eaffe64d6b)

## 1.8.0
2020-10-09

### Features

- 1945 paramétrage des langues (edaa6186f99f239c8f30867701656155cc41b9d6)

### Fixes

- traduction de la supervision (0df532e251997933acc446fa74629d2da6c0eb3a)
- traduction de la partie alarmes (d8d7231440dc14ea70cefbc5125610911755f1d0)
- correction dans le choix du menu actif (f25a500de4856a4f991db5e24859a4c53861e6a9)
- traduction des graphes du tableau de bord (a9fc2337b1d7a8c7723c11b6e2aa78548ae8592d)
- Correction du filtre status de facturation (5b140a31814d0820609c707875b100da40638224)
- traductions du tableau de bord et des gestions utilisateurs et partenaires (df99e4e5278f0296d1ded1862c9015cdb186ddd8)
- enlever le délai avant d'afficher les resultats du coach (ea95614a472d471bcf925f351fa3247a5382abfb)
- Masquer des informations pour le M2M (352077f841b89c01c284d8f695d24bfc7c6a6ebc)
- mise à jour des traductions de la partie getdevice (628e17b8eb98df9954450c9d0d36d5d10c0d0261)
- pagination dans la liste des offres commerciales (b4e63864348eb63295f2a0308803f297fe4c9c7e)
- ajouter les filtres dans lors de l'appel de l'api exportMassAction (f4cb3749e1fb9c5a47284a2690ef55e8e7896f67)
- ajouter la pagination à la table des offres (06ac54143a49eaef79fac22f61c92e5f875dd35f)
- Ajout de traductions anglaises (323a6813e3ed7eb26565d4e8db39f7f4f4c2f9f9)
- afficher la carte du monde si l'utilisateur a la permission read_dashboard_worldmap (94cb25af8d11971d15bca9ab88db95004a15d445)
- traduction de statuts (15bab0ec908764e9b2cc84bd2bbc5afcc85a831a)
- correction de la requête geoList pour les USA (a717fa2a5941ec0f29483a9d515e3c0575a63748)
- 1925 ajout d'un loader lors de l'enregistrement de la commande (ad8ee8d991b0ecd9264db6e250d1c048aed7305b)
- Correction du clic sur les marqueurs USA dans supervision (e81f9c7c89382aa3af931e726adf12d769638518)
- Changement de la gestion de traduction pour le sim statut dans le detail de ligne (de1f1cb08d3fc052d190634236f4d469765e7c76)
- corriger le détail de lignes (5bfa36893194879caa68154046a560c143bd7f39)
- 1925 ajout d'un loader lors de l'enregistrement d'une commande (334251ecfcf4724970713c8b99c02a2e1d6e10f9)
- 1845 réglages d'affichage dans le détail d'un partenaire MVNO (14537ea41365a7a4e716377c06c0521383845c93)
- correction du build (d6d1335e074112c99df7093b569a72a1cfc310f0)
- 1845 1956 gestion des permissions pour le détail de partenaire (294ee2851648b16e7513afa3b48d767270bc1303)

## 1.7.1
2020-10-02

### Fixes

- enlever le mockde le l'i18n (37eab58f1faf8eb85282236bd786acc20cc77b3c)
- cacher le sous menu "Information réseau" (8c766db4096134eeedf6709e67fdd6305fe45b1b)
- Correction du bug d'affichage sur la recherche d'utilisateurs (2ccfe02e91f5970661fc22f365f5579a3ee584b2)
- afficher correctement le type d'alarme mutualisée (29a683491ccb224bb0cf02b33f59f78e59396840)
- mise à jour des traductions (8139c1cec4ef82c4f879d2f45d4516d6f9efffe7)
- mise à jour des traductions (298d932fbb724df9757a41e23294da29eba3206f)
- Afficher un message d'erreur en cas de problèmes durant l'upload (80b40c3c90cdef5463e78531f502882a23d3c642)

## 1.7.0
2020-09-30

### Features

- ajout de l'export pour les compteurs de supervision (f677a6d16ca9bf593daaa567152c1e906454f19c)

### Fixes

- 1892 export de l'ensemble de la consommation pour tout type d'usage (b35bbfecf4b0f0ae7c726d2ac19d45cd4f7f79cc)
- 1608 correction de l'api pour afficher le détail des alarmes (36e7ecd665ef94254184e400e9c1f40048c7cb29)
- 1788 correction de la traduction du statut de la demande pour le test réseau (87e046a097861e5832125aaa54871d3bac6dda66)
- graphe des limites dans la création d'alarmes mutualisées (f81d24ef1a6833d2281031a92f6b4e39df67c765)
- 1915 mise à jour du filtre et de la date de déclenchement des alarmes déclenchées (4138a746a0f0b78c23b670b379a5f32d82295532)

## 1.6.3
2020-09-28

### Fixes

- 1882 chargement des derniers actes de gestion par ordre d'identifiants (34c11727295f3f047fb8394d19cbcd5ad393ca83)
- cacher Le bouton "Annuler les modifications" s'il n'y a pas de modification (f471e1b48f34042c1a068429902973509e1b3932)
- 1855 export des colonnes pour la table de supervision (649bbaa80f1e42054f58c4dc1960f9c5d6a05c0b)
- Corriger le status dans les tables d'historique d'actes de gestion (bb439acd5bb769043322813a2aa8d0c64b326bd7)
- 1897 traduction du statut Terminé pour l'acte de gestion (3e08385260f3fce547f0125e9f83e6f7193c5187)
- utiliser les filtres déjà sléléctionnés dans la recherche par ID (a993cfb4762d22a34a5375a279cadfc40222f901)
- 1898 gestion du MSISDN pour la consommation SMS de la ligne (f6dffab245ea64ea5ca6582b2e48063d2a678f81)
- corriger la traduction des services (86a5f7d245d49513e2c1745cf3840e969916b097)
- Cacher les services de la matrice aux utilisateurs MVNO (efaf4e713edc7cee18706be2d7a45476ee75ee60)
- Afficher la bonne date de facturation (d9cbcd7b6f3935347c864e0ab26d333aaf501328)
- correction de la date de status de facturation dans le détail de ligne (a4e92655c92d48cbe8e0b13ebce008eb604c8808)

## 1.6.2
2020-09-22

### Fixes

- Desactivation du tri sur statut dans les rapports (bd5a96d2edaac6bc16658d141eb7b2ded78b417c)
- Si MVNO dans creation de rapport et dans detail de la ligne (770d2c7e5b2d8b5ff8164cac0a73c75e4431c90f)
- élargir le volet facture (1d687bbd9aeebc90d1c899bd9c3da8cf00a5c6df)
- Ajouter un loader sur les pop-up d'export (f15fdaa1a1d3e37f7c3cca2a3738562fd537ebca)
- Sélection du partenaire dans la gestion des partenaires (cc35aa4eb21326336a45374ed3ed039ca6ac47ac)
- Correction du filtre pour l'acte résiliation (d531ead7869b0df26ca58d5eadf9aeea4e15dee9)
- message "La ligne n'est pas active" dans en cours de consommation (bee0bda45bf7afa6e242aebc887f60e15a6e1fc4)
- Améiloration du volet des widgets (f4319b8baf95f9432b127c8602b08a80b980f335)
- 1860 amélioration du gestionnaire d'erreur pour l'acte de résiliation (3169f5294053f3e3f53d2b9a51775e2e2c324fe5)
- 1869 correction des valeurs Entrant/Sortant dans la supervision du détail de la ligne (c95c4208b5ca35da254cf55e1314c07a0fc0eed1)
- liste des cartes SIM d'un CF (38ebb59d57e39a33b4860c7562b3c778cc4ddf9c)
- cacher les services pour les utilisateurs MVNO (c1b54b2bcde85a0205cc0cc8c7ba7f5a734cb613)
- 1845 gestion de permissions de l'utilisateur MVNO sur toute l'application (d1f8f70652592b846ee750d56acd9d583af9c88e)
- Correctiifs pour MVNO (08c50d3e779fcaaf41e0323969400504bbb3a19f)
- Correctifs pour MVNO (2c7dce56a838883664b92b2bdf70d3f9258ffcee)

## 1.6.1
2020-09-16

### Fixes

- Correction de l'autocompletion (0de0abbc368a9c9a75720583ed733e825abe2247)

## 1.6.0
2020-09-15

### Features

- Ajout dans la mutation API KeepServices (d859dfbe88c914a6c2810b4e9446bf7ffb58f008)
- adresses de livraison d'un CF marque blanche (67ec73efb26eb9bd950eea8aca5246728164c761)

### Fixes

- Ajout du nom du rapport dans la table des documents (bbf73f2190593802d61ef1c4181ce7b5bf30a1c8)
- Corriger la pagination du filtre type carte sim (d9287eb821a723d856ca64ba0a724331888fd3b3)
- 1788 / correction du rendu de test réseau et localisation d'une ligne (a714d7fed6a20eb3f836e817bb2b3afcad09eb66)
- Correction label d'export (b1c392c8da19494649608064989ced3fcd2edd97)

## 1.5.1
2020-09-14

### Fixes

- Corriger la recherche par MSISDN (2e7d7e2c17d84c799173f9588ca66c7e8feec0b9)
- Probleme de query a la creation dalarme mutualise (71541fac7d1c036fec339b162d17d407179a00a2)
- personalisation de la Home (d95bc311bfdcb8d385dc7a604e93d3ed47bf7ed3)

## 1.5.0
2020-09-14

### Features

- Ajout du modèle de rapport dans la gestion de documents (c8e5b27dde42cd4e7af9d34c7bdecf3c23656840)
- coach M2M dans un widget (00bed7dfc3e4f19ee4336cc885658ff5e0860362)
- Ajout de la colonne statut dans le tableau des rapports (8d73eb34354f58fac59ebba71d7f31b4556cac05)
- Ajout screen error/loading sur modal export (af5927c8013ff8c4d9382bfd5e3635187a47d7aa)
- Gestion du MVNO et M2M sur la section de facturation dans le detail de ligne (a37e0e892340e5b8880c1ff08ff9650e9992d27c)
- rechercher une alarme mutualisée (5dbc831b955c9fe1d6accacc4bdd61cb295fd42e)
- Délai de traitement "Commande 1 mois" (8a75fb3064aa04ccde497ddc6a1c983505c87b5b)

### Fixes

- Formattage des données dans le graph du Dashboard (307c4437602963a7094f53bf53f85cb35ceef706)
- Corriger le graph Nbre de lignes facturées et conso par zone (e08669034e01099dcfc8db8e3c8351dcbb4a7d04)
- statut de ligne dans la recherche (4384fe0cd7e732e58eb80701036eb38056cf8e65)
- Le sous-menu description du compte ne présente que le bloc informations générales (24f2739b43fd4e377b5a992e1119c0c85e371301)
- Encours conso/ préselection auto d'un CF actif (b7d6fbcb2053bf082ea414a6701460ad8bfc740e)
- ajuster l'affichage des offres dans le détail du partenaire (e1447f9af630826668c37881dbca409a23b916bc)
- Liste des offres commerciales doit être filtrée sur le CF (cff8c6891d6ef5f99f5d723748ef39b502949a06)
- correction du filtre Type de partenaire dans la gestion des partenaires (a494fed2bb80a1695c7f035f179b8afa74ea1e36)
- sélectionner les champs d'une table pour faire un copier / coller (fe59f752bd5f34834c6a721f30001781bdd518aa)
- Ne pas lancer de recherche si aucun identifiant n'est selectionné (90c2dba288df9135ea8ac0380c08b0f2aa545005)
- mise à jour des informations des factures (9084cdc7dd88b5b2d9f0d6a05de38370897051a0)
- conversion des identifiants à rechercher pour la gestion des lignes (355edfbb409b17d200ed5d25cf8dcb4ee5981b86)
- Multiples fix sur les correctifs LEBARA MEP Prod (c53be4a50755d2281427648db37c71727969bacd)
- Remettre le bouton de création d'alarmes (37c7bdffbae6e94fa14699443a8f008b8db6feb7)
- gestion de la barre de contexte dans la gestion des lignes (36ed310a503ec69a6369b12d28e3f1c27c97ee77)
- Correctifs MEP Lebara (c784981f551c61d8460928a0a02c95c8bff97b7a)
- Filtre statut commercial (3bdf8d29b7f5add8cfb6f01e245048464b74ca6a)
- mise en cache du filtre État de profil eUICC pour l'utilisateur connecté MVNO (050669bef815db02736daa5dacafc8f79ef07040)

## 1.4.1
2020-08-28

### Fixes

- Correction de la requête graphql quand on clic sur un marqueur (578feb1c16d0ad3da6e95944cf4b0d7ebb983e24)
- Correction de la requête graphql quand on clic sur un marqueur (907d364e8b248645cbd548b6469e7cdcd08b7217)

## 1.4.0
2020-08-28

### Features

- Consulter le dernier coach d'une ligne (2f159d519e6c7cd07f2bc554fcb8f6c9754fc62b)
- Branchement api sur le graph : montant facture par zone (b5fd23a2a8183bff040300ae856a39b8164de79b)
- diagnostiquer une ligne afin de cibler le problème (a27e1f0e6b899ccbe342feedf7b2e87f3c127f0a)
- ajouter la date de dernière mise à jour (57bfc352126496af69e17a564185bc84a246eebb)
- Afficher les alarmes dans la page de supervision (1949f41d555d202aa16eb683e01f001df12359cb)
- Sur le tableau de board, à la sélection du partenaire, lancer le graphe et le tableau des consommations pour le permier CF et la première offre (a4d23fd1a37fa8fc3a98888a41bf9570fe0d2dcd)
- n'afficher le bouton coachM2M que si l'option est valable (b1221d8a975200100dd08a595fe32a7a42f20c1a)
- Exporter une facture au format csv (e1aed9b08652c45afe8b972299f43864c08904b6)
- usage traduit dans la table des historiques voix dans le détail de la ligne (990eb60ad543a3bcd8e3aaa556dafaa689192383)

### Fixes

- design du bouton coach (93ae147b98e573159a9e82c71969c92cb467d1e0)
- afficher un message d'erreur si pas de données (d8fd081950644316c9751088cd8184cad2fa4c1b)
- gestion des permissions dans le coach M2M (e5964b928108be3238ff52d922ee00e36153afa0)
- Corriger les couleurs des icones dans coach M2M (8b1a10e488bdc96b538d3ba2674ab6780c47fdc3)
- corriger l'export de lignes (d68489b29dc9098045445f736859da80865f2a7b)
- Cacher le menu administrateurs (96b53e6cc45033bacd53f056dac8b5e33f20b46a)
- export des actes de gestion (f6fd41e0ce5c0df4ff9df70d8dc32ab408d1e966)
- Correction de l'export dans supervision (b5ead793782f2856992423ff0f58b5cdb70f583b)
- enlever le champ reportId non utilisé (77ac6cc1daa618db3e090d13309c79338911e338)
- Afficher le bouton d'export quand le nombre de lignes est supérieur à 500 (2079207e2c3d101299b0a8b0b4a307c72a7ac7ba)
- Corriger le paramètre rôle dans la mise à jour de l'utilisateur (ac8cede753359de889f7bc91ff81cba9ff2834e9)
- mocker les sous menus pour les partenaires marque blanche (771c8c489d2fba927f2caad4e5e1f3bfc6170e4b)

## 1.3.0
2020-08-24

### Features

- partie front de l'onglet "liste des clients C.F" pour les partenaires marque blanche (ea769e69d47aa8a1434ded43d9208a8e07059f87)
- ajout du filtre Type de cartes SIM pour la gestion des partenaires (2f34302157a8ee2b099420bd8e6e6639efe495d8)
- ajout du partenaire de type Marque Blanche et des informations qui en découlent (f43c614009e0845a7f79001652d3103cb2c89411)
- ajout de l'export des clients (C.F.) (8577a8efc3bc5679dfa1c08bd94d61453ade70cb)
- ajout du graph de facturation Montants facturés sur 12 / 24 / 36 mois (3350d5b9432e10b2f05b9d2f16dd85ae286facf1)
- ajout du graphe "Conso et montant moyen par lignefacturée" (189fe8b158103154dfa4a15d30cf1c5890980968)

### Fixes

- Retours sur la création de rapports (27f88b7657aedd2b55c0d5b8acb5f4301857c2dc)
- Retours sur la création de rapports (34d4e485be5ffa8a6c83d2f86c246c62b10e1cde)
- correction et amélioration de l'historique des actes de gestion (a43c5d874a56ec50f3c88113fe179617dd20717a)
- correction du login affiché dans le volet de l'utilisateur (fe311bc3690e54902bffeb0063fa603e31f987fc)
- modification du paramètre d'export asynchrone (cb5cd34a07200c66de2f6b48e02b5802180b49ec)
- ajout de la limite pour gérer la requête asynchrone des exports d'actes unitaires (a96f1c658acf27c29e1b770004e556f034864c53)
- configuration de la limite pour un export asynchrone des actes unitaires (3167ff6309ac1d788d05f31c1279c2b3c373dd74)
- correction du tri pour le filtre Créateur de la demande (2e17f7fd24bf2f4f126127cc8c7670099e038fe7)
- correction du filtre statut pour la gestion des utilisateurs (7c10a5d5bbd12cf191c311a354cd9a03b8fcf1a2)
- affichage du message d'informations sur les graphes du Tableau de bord (1677c71cf9b4f27c1c3ac46a0fa0bb7f80b5b1fb)
- modification du type de code postal à la création de commande (33d249e3df340969d027a62e5c0140dbdc87c714)
- correction de la création de rapports sans partenaire (0be5bb950e7e4c27bc47e50a2e030b559327bab0)

## 1.2.1
2020-08-05

### Fixes

- corrections sur le contrôle de modificaiton pour les champs libre (19b5beb7394f09c6dd98c3b02c4e37ac8cf00fa6)

## 1.2.0
2020-08-04

### Features

- nouveau composant de pagination (815b1bc7d5cb01a471644293098eb69d3d39dca8)
- partie front du panel du coach M2M (b84812f4ca915ea7383a50bd76186734644a3c36)
- Ajout des actions sur les transferts de SIM (cd9b3a0b4543e7cae37b69ebb3e9c991da379e41)
- Ajout des cartes SIM dans le detail de partenaire (c4aa27984b43f2b92229984e0c802372090c6ec4)
- ajout des colonnes préactivation et activation pour l'export des actes unitaires (6ecd0f83e011b6da49265baa0d2c5959850643ae)
- Panel pour le changement de mot de passe (27175b9a3ece86e168e02ad3ed92fe4982b7860d)
- créer des rapports sur tous les partenaires (c62082d0d13fe3d601da4813293664e87771306d)
- libellé différent pour la date du rapport suivant la fréquence de génération (3b7fa22af6e835035a47e59cfbec7b08cd3463b8)
- Ajout de l'export complet de toutes les colonnes (6fd35fd040507fff349fe3885f0bb32f0afaf015)

### Fixes

- Annulation d'un acte de masse (67cfb87297334f6e647fb897d9cf34e37976157e)
- Réinitialisation du calendrier (265033cf7b5c462e4d99a1ddb62f14c93da4a786)
- Gestion des nouveaux codes d'erreurs d'import de fichier (d5d0284ec09a28c3fb0c7fdb73940ff5c94551e0)
- Corriger la consultation des rapports (04e80f48b13fd56b717b305418f73d6e1a06d7ff)
- corrections et améliorations des graphes Dashboard de la page getDevices (2866ed00b43f3fc02cdd8fb677e18a69f0a81fbd)
- Affichage du compte de facturation corrigé (58f064e6ce033c14bf84f908a039f948751b76be)
- Si "null" dans le detail actHistory alors "-" (c1a5bf5300102109b2bf2cd921e44285014cd46c)
- Ajouter un loader dans le chargement des rapports (6d08438757b58edc1d63c334363ecb3c249e8c04)
- rendu dans le composant de recherche unitaire (c97fa5af6acd90116c57edbda9cbc5ff510e93eb)
- Changement des traductions dans la home GetParc (134685586e7a33d880677e495ef06aa38b53c36c)
- ordre des colonnes des exports (c505735cdc92016cd9f8e56a572b9b569ca7307a)
- Problème affichage historique de pays detail ligne (c261f0515c4887534e919b1b51e92dede6a469dc)
- Problème d'export des users avec le filtre username (bb5daf0c16b9d3a885693edacbd54a658942b5e5)
- Ajouter l'utnité pour l'indicateur délais de traitement (714632ba6669cf2cba915f4c4f7746e263a866c3)
- Ajouter le filtre « Validée » lors du clic sur l'indicateur "Commandes en cours de traitement" (e5d953b478a157a7507e38b52989c4498822687e)
- modification de l'affichage pour le type de partenaire MVNO (d36ca98a0fecfcde3ab7750c380fce42ebfe2733)
- corrections pour masquer les infos pour le partenaire MVNO (775bbb5487a85eae116fc60801800d3cb87130bd)

## 1.1.3
2020-07-20

### Fixes

- Correction du filtre supervision (6a3da8035bc5f7502e5e34dd3e7d912ca4922ead)
- optimisation de la création d'utilisateur (72fdd6bf0178cacdcb4376f598dc7e69ff2adef5)
- Correction du bouton 'appliquer les filtres' (204019609a98718b344502c05fd0a30d7dcf558a)
- Afficher le bouton 'appliquer les filtres' dans l'historique d'actes (bb2348e54d091a912db934765e1cd7a5adf23cdd)

## 1.1.2
2020-07-16

### Fixes

- Corriger les filtres de supervision (ff81756aa78e5bc379ef4ffe34213fb3026b5f77)

## 1.1.1
2020-07-16

### Fixes

- Cacher des actes de gestion pour MVNO (707b0780b23c4a52677772892ac56c09b3b15385)
- [Etat des services] Retours sur les écrans (0fee8bf3fea312d1af262247ba1d7f8e024526a7)
- permission sur le bouton de création de commande (f848ad2521fe1b65d279a575a6b7d7bfe3918a90)
- centrer sur le pays lors de la recherche (17e87887976e1f0cf4395e31bfef8d44904c2d5c)

## 1.1.0
2020-07-13

### Features

- permission de suspension de lignes (0dba3b4a54cf076ea157dfa60b3a5dee74dc180b)
- filtre msisdn et IMEI (9120d874eeead3d3987836c895261b803d328f6f)
- ajout d'un logo temporaire (0dcde25cbb43b52d2c9c2e5066ec4448c276705d)
- ajout d'un bouton d'export pour les lignes (7f22afb795b16085a771fadaebb684efc3fc3482)
- Ajout de la suspension et reactivation auto à la création d'alarme (c602c1ea9def95b9938a0fe6491f55c60b258cb2)
- annuler un acte de gestion (66e715e8b881dbb1936bee813408497a8a55389a)
- ajout des permissions des menus (20dae24d4e2d8d57eef232fbf90358002937b207)
- Ajout de l'activité d'un user sur les cards users (b5e41a4a37b070aad301b9579dfb6a33a7b56603)
- exporter les données des graphes de l'état de services (c9ef5adb8041ac7fe5a456b0fabe94a1077e1090)
- Création d'alarmes mutualisée (546ab2adb937e952e07183509fe9aa038f08fb7f)
- Enregistrer les filtres (d7b934502192db7bf81bc1f63d8865197b1cae2f)

### Fixes

- correction de bugs dans l'onglet supervision du détail de la ligne (4b62bd8640871f526d24b748622e847b11ec0f25)
- Correction de l'autocomplete du filtre partenaire (bf57f40f94f797fecc505652c50d874a95774ecf)
- Gestion de l'horaire sur le changement d'offre (e622a522b51d38cd5f3a07f84c57b08d494e8fdb)
- Ajout des traductions des libellés du detail de facture (45a561ae3b3b57f2abb232674e0acf2668103a68)
- Bug suspension dune alarme (f96633c49223423154fa8f01e5a5ce9c526d92a9)
- correctif des contrôles d'affichage pour les adresses de livraison (475d88e3e494ea320ecfdb3c0444267da1390139)
- correction des pays pour les adresses de livraison (0193b066db8c99882a050eb41ea17482bb52cccf)
- mise à jour des apis de filtre Constructeur et Référence commerciale pour le getdevice (6bba6d0f2b75c71ef7907f4f15beace88d85aaf6)
- Suspension et réactivation en création d'alarme et modification (c4a8699d4ea961cbe7e3319c68d63e35dc95c256)
- mise à jour des modifications des champs libres (175afece40128b7df4232bd440fee4abeec47790)
- Suppression des espaces en début et fin de string dans la recherche Lines et Orders (4e849c71f6318e3ac5415f97087ec9d628f169dd)
- Mauvaise API appele dans le détail de la ligne (75a87f5cb42872672ae2e2ab6d828cba8eb5b5fc)
- afficher correctement les formulaires des actes pour les utilisateurs non BO (2ee4e475558f9cb58737fee880bdb885a322a657)

## 1.0.1
2020-06-25

### Fixes

- Correctif dans la carte cockpit m2M (8bf1fc37ca12bb32c9eb39390b2b6c7d3e521e5f)

## 1.0.0
2020-06-25

### Features

- ajout du titre dans les graphes du cockpit M2M (b10540053a1c36991cbfcf9d4e9d57a037b7541a)
- Ajout portée de l'alarme en modification d'alarme (48a8077effd4922dc2f2136b7db13e95a1257192)
- filtre date (d9123a131f9808cf640c430e9b4325f11db2f18d)
- configuration des options du partenaire (c38141209b38fcc1d07c0d0b8be25093afa2140e)
- Gestion de la sécurité dans tout les téléchargements (99221cd6f101ad055c4e4949c9f6b4f2422747f7)
- Niveau zoom dans la carte (bc5bb1d62ec0cf2aa21bd042a9ea224ee9559e34)
- permission de suspension de lignes (ceee915041c4fcfa1d037668da56832bc0805017)

### Fixes

- Augmenation du nombre de ligne par page sur les comptes de facturations (d38154aa082f57fddaec59e83cc6089279b14c01)
- Correction de la séléction d'offre dans le tableau de bord (5484b967e83d1d331b69efab037c75ddc6754610)
- afficher les bon filtres pour les alertes M2M (b10f843d7b510c8d83113d374a764fa3da83b0ee)
- correction pour récupérer les options des partenaires (0428a42932737c3754c54bbaebf53e62e007d225)
- mise à jour de la requête pour lire les options des partenaires (6f2d9e48e62c460044e85d8ce688b860aa8cfd4e)
- correction de la sélection du compte de facturation pour les options de partenaire (20fb2f393638dd07edc6eca50e3b88dff826718b)
- Correction de la gestion des widgets (e8c93f44b84549fab78bf012852348fe1213de35)
- Correction de la recherche unitaire des commandes (5c65871a829bdb038b8fb9b6395865d54155d275)
- Correction du widget commandes pour l'utilisateur partenaire (9bd762984606f46360ce792eb29d5b39db285081)
- Affichage du tableau au clique sur le bouton retour de detail acte de masse (5987cf700b74a769bbe4b8ddd43a92ccc4c34165)
- correction de la création de rapports et de la traduction des noms d'alarme (35e293b11d66bf32f0b1cde05ca490d5d5125491)
- Correction de la gestion du localstorage pour la homepage (808cd2e85a2852a31bc237541c4870816745a1ae)
- mise à jour des unités des consommations data (30254790cda996f84eb6760e3f00d3d459e804bd)
- correction du statut de la commande pour l'indicateur commandes non confirmées >4h (ec57a8a18bd100937d5b7ae1e09b7d88b3eeb00c)
- correction du statut de la commande pour l'indicateur commandes non confirmées >4h (38e736e3b77264481f8cf76944d0fed5f70e5375)
- correction du statut de la commande pour l'indicateur commandes non confirmées >4h (66e1501c5c2cb1a58eb4e66c38f72f842004b761)
- Correction des indicateurs de commande (1321d9f23d4a7e76e7d40be60a414bcad93fd707)
- correctif pour réinitialiser les champs libres pour les listes (c9763190b530fe135de1987f1ca23309596cbde0)
- Creation alarme avec import de fichier (df071acdaa04d35aabdc4c653fe35e8537139d8c)
- Recherche par référence et auto-complete sur le filtre partenaire (74b791b2db7dff713d5232bdf4a98680ca979a3e)

## 0.32.2
2020-06-18

### Fixes

- Correctif du bug d'affichage de la carte dans la page Cockpit M2M (d9b67b957f5fdb87b5eaa88cefc78d96b3678816)
- Correction de problème d'affichage en prod (c031482e6c69932bc5174e3bf092086c017ffaad)

## 0.32.1
2020-06-17

### Fixes

- désactivation des modifications des champs libres et spécifiques dans la personnalisation (045ce1d8bae4c2d008662f538425e24db5f3d4b0)

## 0.32.0
2020-06-17

### Features

- Ajout de pays dans le detail de la commande (e4dd571f209ebf6e8c794e49d49b74cebafc1e0b)
- filtres pour le cockpit M2M (partie front) (df04a9ebc5e2557f3fa57202fe26c7230bd64e37)

## 0.31.0
2020-06-17

### Features

- ajouter le bouton pour ré initialiser la recherche (9f1a2fab37e797f9e704da2c420249b93a4c3adc)
- ajout de la permission pour configurer des utilisateurs (5532d4e7a302072c7e11397d59d9a017b8f88d30)
- Ajout de la possibilité de dupliquer des users (2dc124d6c7c06e9267ed32ce005ed542faca3dc2)
- filtre pays pour le cockpit M2M (d9f89baaa9b1b1b58d43c9d8dc910ea0435ea386)
- Ajout de la possibilité de suspendre et reactiver une alarme au declenchement (5c15aad4ea2e267d1a7c42019a937304677112ac)
- cacher les filtres de la carte "état des services" quand on est sur la vue "Tablea des alertes" (abe96cef62a945f8b838b3fe1d48719d83013763)

### Fixes

- Filtre Créateur de la demande (6510fa5b540bd86b6f6f21e2913cbd2985aa23aa)
- Correction des filtres de la page de supervision (fcd17fd9271b76a51e845445440edaca2ac265f5)
- correctifs sur l'écran getDevices (63a63d2b240eeecc36a4527f96933a4c3ab03acc)
- Ajout d'un delais pour la prise en compte du filtre (6935ff32f57222ed50e4761c04a80dc96b37d3b5)
- Ajout du click user sur la table actes de gestion avec panel (81d97a91ee2f07f46425892c21c9abeda2dc1179)
- corrections de la recherche des factures (706dd4eebaf2b9dc3a4e8370003a16ab23d56315)
- correctifs sur la consultation des offres du partenaire (97a7142662ddfdff4c99090107bd2d427bcddb61)
- annulation de la correction sur le tableau de bord (c23013bad976c42e9e5075aa9b3b726d8a0084e2)
- configuration du panel Administrateur (0775c0e827a6bd43b5f893e5cb548884e30ca4db)
- ajout de la permission pour ajouter un utilisateur (dc30f1cd505567230f1401e84cb588a12de84a8d)
- La recherche de commande par réf client ne fonctionne pas (d3344a544c4ca1cf496b424acf0837a4d4165211)
- Correction de l'affichage du montant dans le panel de détail de facture (6df7d3c6ec74fc9eda5d661f9fcfc61eeb375880)
- Corriger le tri sur les documents dans getreport (068be29293caf0c5b8854710cd1c61eec977aabf)
- ajout de la permission pour dupliquer un utilisateur (e514e2a3f18f4f9ae85b97023f21091e9d224e06)
- correction facture getReport (842ec462f44cbaf4d3f24884527be71fa3ffdc09)
- Correction des filtres dans le détail des alarmes (19b78e5168aa1ada4a4e271a4be4ee034bdfcd4c)
- Correction de bugs sur la barre de filtre (f3618587b4ba1dcb8aa399a1b95dea8c5e0767a3)
- Cycle d'observation dans la modification d'alarme (f4b0c745b089f6bb0debd770483ad16864baf540)
- manage permission create report (7ef133005edee016ad0f2feaa8d45ce0825720a7)
- ignorer la France dans le choix des pays pour quand la zone choisie est "Monde" (5ab8b73426915dc29b1e6472da93427788e1c0d9)
- ajout de la réactivité pour rafraîchir les données du rapport (cd1e43eeee6b241af84ae4f93a5a7ffa5b12af3b)
- k8s api connection issues (Broken Pipe) (2ea525feffcfd1d6f98dd8e618f9a3f87e03c46e)
- correctifs des champs obligatoires sur la mise à jour des options du partenaire (6298794552d1b7d6ad0253cace16c90498f2c318)
- correction autocomplete des partenaires et offres (3de697f570c4b71f7f5752029ba2caacd9f333eb)

## 0.30.1
2020-06-05

### Fixes

- correction de l'indicateur de chargement de la page getDevice (b2b4e5fd68c7bad408e4f0521bfa071e01871d40)
- Correction de la séléction de partenaires dans la création de raports (f83060fb39aa2a0679857d96717dd64532d5545f)

## 0.30.0
2020-06-05

### Features

- mise à jour des apis devices (292861f32a43441a4ef070cab1c23ad48f97c809)

## 0.29.0
2020-06-05

### Features

- monitoring graphs (b382ffb55363023795c200685369f8f1068a5c16)
- Ajout d'une preselection de 3 mois pour le filtre de début (3304c267efd8fef8b2198d1e6b6a42ce07ebc973)
- Ajout de la colonne de statut dans lexport des users (f65bd85dc3ee9b2ea7fef0c7b3443b20e95ecb43)

### Fixes

- **devices:** amélioration du chargement des composants graphes (50cd353424e25701b28024b7fa1f36d5b1cac7f2)
- correction du paramètre partenaire de l'appel api devices (d329779786cc984494000fb7bd0806df4f2a2e6f)
- Affichage des partenaires de types CUSTOMER et MULTI_CUSTOMER dans le filtre de supervision (af78903167e9bcbfde8f7aee4ea5b0e7a9d1b0df)
- Multi-check sur les code et noms des pays dans les inputs du detail de partenaire (dd69c0b83666d2872f618dd09cbd8b9a8f27839d)
- réactivité des graphes (697457fe67f955685d70786de0e77bf0c0f09c5d)
- traduction du titre du graphe TOP5 Référnces Commerciales (89f0b969242d02c79b13511ec270cffbbe4b2f3f)
- ne pas définir l'orderBy (e0da6133fb886e2a1bc2b3321fb9ee165d213e8e)

## 0.28.0
2020-06-03

### Features

- création des graphes de la page getDevice (2aca42cd382345ab2f9f020baaa30c6ae9065c5d)
- carte Cockpit M2M (64d6cb97468e07aa83c57947812b48befc5fc7aa)
- table des alertes (d798db14e739f5814c63ad7195889d09047ca2b1)

### Fixes

- **utilisateurs:** correction du filtre Roles (3f106fe143cf595ea5ea7093f596e3c03c1a621f)
- Pas de limite pour la liste des partenaires dans le reportPanel (dcd1c809e7990cdabb47348797a2efe837a6f870)
- Branchement des graphes getDevice (35157b0cc6af9009b0247076f7df9bda44a2cdbb)

## 0.27.0
2020-06-03

### Features

- Gestion des permissions (bba4744d3b860ecaa9937e168eb843c4d9ed2f55)
- gestion des cas des créations et modifications des utilisateurs (c854e4c16754074d06546858e22cbd5062f2e068)
- structure de base pour la page de gestion des equipements (64babf9d810984c46416fd3e5f8204659d99f8e1)
- gestion des utilisateurs partenaires (5abcdd8efae5576082080a57feb56609b6dd8988)
- intégration des menus getDevice (ffa01e43187d19932d06779110f5e3a65cfba31a)
- ajout des filtres de la page getDevice (424ccddb44cdd7733f3b45ff03f13a45133e8dd6)
- Mise en place des permissions sur les widgets (e238412de0fd12b36ac643c7f52463bc5031be18)
- première version de la carte de supervision (c3046f9a5c150e3a255be95fd7d9156cfb6ccef9)
- **devices:** ajout de la page getDevices (bdfbef5f692cfa822cd9bec72fc3d0133f1bd48c)
- gestion du clic sur les marqueurs (4274e4828f4faca20442cb32184b842dfea25476)
- export des équipements (417ef1a8f4adb99684b99ed26386f31c1e890234)

### Fixes

- cacher le filtre partenaire (7335913b738a18e5710547d9da26eb4f62f0cf60)
- gestion des rôles pour la gestion d'utilisateur (bd78c826bf9d5dd7a699dbef38af0e07430578fe)
- Creation de rapport, ajout de 10min en plus à la date et affichage dans le datePicker (22bcbbe860574091247fd9d2b14dc6e4aacab4c1)
- Modification visuel OfferCard pour le détail du partenaire (9a4b7ad810308cac5dcacf7500551e963188f845)
- ajout du texte par défaut de sélection de rôles (b7f12519d3136ec86ffaa9f9ca0299b47bcd870a)
- tooltip text getDevice page (e9af3925e5fd384a73f89cd9feeecfc4c37b9925)
- chargement du volet du créateur de la commande dans la recherche de commande (7fd784538d7f2bedf7374b9e139bcade87871a30)
- restrictToParty dans l'api users (4f97b5701ac27cd2969318666d6cc575f1d36334)
- corrections bugs sur le tableau de bord (71245ceb92e876b558fb0243340d1388b292b100)
- correction du filtre groupe partenaire de la page gestion des partenaires (1492eb7d25387621fe9f23cf4700a872ce10305c)
- correction du tri sur la table de résultats des rapports (9da62bb7dcff25bf6db6a436d1153d78b428357e)
- ajout des filtres de la page getDevice (a080837e5b1bfa04609c44ee0882530573f2bc41)
- Changement code de pays par Pays (b8582d70bd7390f1705e4f73210d50b8a139bfa7)
- correction de la recherche par filtres (33f0b10f5ea80e71e2684b05e6e2f67f0b05cd34)

## 0.26.1
2020-05-19

### Fixes

- modification tooltip (3493e8eb34c6f221bd2e33270b1e6a253b513dbd)

## 0.26.0
2020-05-19

### Features

- Spring Cloud Kubernetes Discovery Support (eeeab2bf33a96200538e4dc695fe8b7e62e83bef)
- gestion des champs libres (052e8c3d2cafae419dc3fa15a6db1ec1ecd2c233)
- gestion et personnalisation des champs spécifiques (8caa0d2c89e6e1f046715fdde4309ad614d0411c)
- architecture v3, detailed content in MIGRATION.md (c49f09502afcd385f10b3d163c799b1e1b3dc7be)
- gestion des adresses de livraison (346d48953d70170ec60e87e9d9d729200c0853ae)
- Page factures (877a83b339193b33b987d8314146bd70ce6704b1)
- Panel détail de facture (e5b38a7837107eb72091468b356d1308a1f26af4)
- Branchement de la carte du monde (89fe3b7f6c1edaa54249f5caa4b322cdebd13d92)
- branchement des filtres des graphes ( carte du monde ) (8b5d535bdc2f38875fb07f2ebb5f1ba4219ba80f)
- Table encours conso (e5e0a4f1a7ba1e2fbc935a6d5d221089da85c2c8)
- historique des consommations de mon parc (92b4bfa908c42abf9ddaec1b2f0a5fdd190de5a5)
- état de mon parc par mois (e3809bac77b6637e27f3edb93697186cd0ba597e)

### Fixes

- limitation du nombre de caractères des adresses de livraison (ad78db79a828489a7680d8406a5aa5bc734f0e89)
- correctif d'affichage du pays sur la carte des adresses de livraison (9877a6dcdaf4f92ff952a9a2bd2c344958a55352)
- gestion des rôles pour l'administration d'utilisateur (c351e2f782b78de328d7bd3257807c1b660975f2)
- gestion des rôles pour l'administration d'utilisateur (55912134598170cf7f4d276505250e37d1cec4e4)
- amélioration expérience utilisateur formulaire de modification (b8cfb61e9182072b12c4c3f29cffa1d7dcf73364)
- gestion des permissions pour la modification d'utilisateur (6302e1aaab1a62aa27c43bd3f5a33ae3015c48a2)
- annulation des champs obligatoires pour le formulaire de modification d'un utilisateur (f933ae617843e6a11a2264e6df57999b44be7daf)

## 0.25.0
2020-05-12

### Features

- 1182 gérer les offres du partenaire (34d5cd99bea864771259729b02e0b3c23925f2d0)

### Fixes

- correction pour l'ajout d'un utilisateur (94c1a6eded0e78b169d6283ded8e0e30a1fa6959)

## 0.24.1
2020-05-05

### Fixes

- enlever le mock de getAdmin (c23c9e0c9bb83b59c0e4c2c0e89a19c1e54b2f07)

## 0.24.0
2020-05-05

### Features

- Création et mise à jour d'utilisateurs depuis le détail de partenaires (d8c8992544db944730f80ad0066375e2680fa691)
- liste des utilisateurs d'un partenaire (f19438e9898a6e9a9ac021513decc0fcb82966ac)
- gestion de l'administrateur principal et secondaire de mon partenaire (b348bb53447eff2c97d820e0e1937cac005de2fe)
- import de cartes SIM hors commande (4246899ce40b26ab51bf07b84bccaf91b4386c8b)
- Consulter les options du partenaire (e6ebc8618c22559feae7037a9a961783c886459b)
- enregistrer les options partenaire (54102f951b9d88a3a2b4a0585f627e6af3ec6d3c)
- Création d'utilisateur (afb7e04b1a71bf69765b3daaab0e6b250d3fffec)

### Fixes

- admins cards test (2d7d649b22dc530ea331d1e0248e91f680d1a375)
- correctif pour afficher les résultats de la table Gestion des utilisateurs (0bdc035e637d78d926b395fff1da558cbef33ac3)
- ajout du contexte utilisateur pour permettre l'import de cartes SIM hors commande (6297d01757ee212470e0a1d97190dab00cb90fdc)
- configuration de permissions lors de la création de rapports (afeaf98119353a6923ef51b6b9b51f0b1970fe3c)
- mise à jour du type MIME excel pour l'import de fichiers (5bdebb38324704eb95fd33d71752a1c5fb88a2b8)
- gestion des permissions des partenaires lors de la création de rapports (7582b73703917e5f11be9280b5cdb7f0c47320e1)
- correctif des permissions sur la création de rapports (fac66341e0d93e6f626a302219e23a37f8422ea8)
- gestion des permissions pour la création de rapports (ef2f932318ecfd32aa3e106c47409ccd098acb2e)
- gestion des permissions pour la création des rapports (629da034aa83896faee505fbfd1846b300298e0f)
- correctifs des infos sur le détail des partenaires dans la gestion d'administration (0c20f0d9c6c6e5f6235c104f6a58653142f6e517)
- correctifs de la table des gestions des partenaires (cc27ded08bc753e63d518c678e8975da0ee44fed)
- modification de la liste de diffusions avec un id dynamique (bfcee9d2fa1b6fba0636368a204d840dd16c6e23)
- **commandes:** correctif du nom de l'offre sélectionnée lors de la création de commande (44e5ea4e028ff06abf1097447c480de4459c52f5)
- **commandes:** correction de l'offre sélectionnée dans les services lors de la création de commandes (b306ada407149fc07ddd165a389608746b5d57ef)
- correction sur l'onglet actif par défaut dans la gestion des utilisateurs (631b5fabf5634a02603480138a052f9f009a2834)
- correctifs de navigation dans le détail de la gestion des partenaires (8590b57f32d977b4e7b638b8aba9c61fd03b4d3a)
- correctif de la navigation de retour depuis le détail des utilisateurs (15e780597786982ad281e19dc93505b6849a876c)
- modification du menu GetAdmin (cc29393a9f44edd6c8d984ed74f289a6b3ee5382)
- rafraichir la liste des utilisateurs (a40fd44b8d7405d5bba8e80fc21bbd04f56f73de)

## 0.23.0
2020-04-24

### Features

- **gestion des utilisateurs:** ajout du filtre par rôle (a7a8dfd954ddea06e4c4326a5143a4b56b647dd2)
- export de la liste des utilisateurs (5b9f370df0019f62e197f01b07213df0a7681c2f)

### Fixes

- **gestion des lignes:** mise à jour de l'acte de gestion transfert des lignes (4d511013e92c4d396032128e783c93d77f097721)
- mise à jour de l'acte de création de transfert des lignes (4395089a058e9bc1decb9ade13875bfe44607be8)
- modifications des besoins du rapport de création (4f86a66dd42d456830c8d714cf475ae646dfb730)
- ajout d'un gestionnaire d'erreur pour la création de rapport (bcc535c273a3c1ee729857dff315fe6d67cb9d95)
- correction sur la table des utilisateurs (700d04bd89d6b358f77c9be2ca275d1ffa737bb8)

## 0.22.0
2020-04-21

### Features

- Motif de déclenchement pour tous les types d'alarme dans le volet d'historique de déclenchement (dbdb4e5b9261cc9abf60ab632450c66de1ab58ca)
- **rapports:** affichage des rapports (5fa24bc84a775ec7b663ad1628d7ecf85e4dbd4e)
- Création de rapports (2a93bfcfcabd29b2ee3738c8f6e121819f132ef0)
- créer un rapport pour mon partenaire depuis la home des rapports (be1000a3b08b591018bd426fe5a8036302956335)
- Page de recherche de documents (ce3015cbd13cf44c240a4b8c6189ba1e7983eb30)
- **rapports:** affichage de la table des rapports (d1613c96bf37a340941c662ea0b152085f322956)
- Modification de Rapports (4cefea5fdbb30d746a2d554ef4054cd5c3a2a6b8)
- **report:** ouverture du volet Créateur (0de3da7fd3e0085fc7a28842749961adfe941aff)
- **report:** ouverture du volet de l'utilisateur (47bb25d076ecb1255db6cb1a9f32b0263c43dbe5)
- rechercher mes documents par le modèle de rapport (68cbad30f36d49246f6d253727ccad97b4249596)
- consulter les rapports générés (exports) dans la gestion documentaire depuis la liste des rapports (e3c3c9e49da2b2ce3c130f8501b6252bf26f18a7)
- activer / désactiver un rapport de mon partenaire (d60fb675e21cdda3de1308f36340c270942af455)
- Ajouter le statut du rapport dans la liste et dans le détail (7fbb0849924f497593a36865665034980a86ab60)
- **reports:** ajout de l'action de suppression dans la gestion de documents (200341b5a5ed8156c01534f15e0a88d742c77c85)
- Brancher les colonnes des documents (43da76c92ec1de515c2d414ee4e50f57b4e0549e)
- Gérer les permissions sur la création des rapports (8f632224c7eb076967597ab007d0a65be10fbcc9)
- Branchement des exports asynchrones (3060767741d3733524f60afec29d93f407e8724d)
- Téléchargement de documents (d3575506493a64c73b456cc0afd51c6b676fbcfa)

### Fixes

- importer des SIM sur une commande, le libellé d'erreur ne s'affiche pas correctement (a7e586aad285ec0b086b2140d22d6e45d5f1f388)
- Correction de bugs sur les alarmes (18d70c8ab06407210ce063c90de06ac107601b9e)
- enlever l'onglet en double (292bacad380c0d16c9cb9672f32b39cafa9a9253)
- Correction des données incohérentes dans le détail de l'alarme (7ba6815a2f3e626931cc2826d23621c0ff7a8547)
- **détail des alarmes:** correction de la traduction et de la conversion des valeurs sur la colonne des déclenchements (f86884fb7393252f2eeb018c9f198fb000a728c8)
- séléctionner correctement les filtres séléctionnés (0d6fa2efa881f3fe14369f97e30e46645b6fbe7f)
- correction de la traduction du statut de la carte sim (799e3afc2dbf2a42f39a081d207add468c33ed68)
- **alarmes:** correction traduction (d794d9b0f79683e0b3b80696a1077b7d7c8314df)
- de l'inversement de données + ajout du total dans le graphique (757165316e670033110149498ee779beca6c261a)
- branchement des volets "historique de déclenchement" et "détail de l'alarme" dans le détail de la ligne (6cb8ee8482e8c675241e135a302766d94a2aeee5)
- Correction des problème d'affichage de l'historique de déclenchements dans le volet des déclenchements (a778a6265cc3242fc37490acb723c9f68847521a)
- Retour panel modif raport (6920c439a154f6600ca96513b8ad2e14aaaf9554)
- Page documents tri sur les documents et affichage des partenaires (1882e6685c75bf75fd9a4ab8d97048e5a4dce2b6)
- Le cycle d'observation doit être MONTHLY par défaut pour les alarmes de consommation en mode standard. (80a328085e60d0318dae2e330179223ac77bb063)
- ne pas afficher la mailing list durant la modification de rapports (1a4091d927969f9ef7cf6938e20e6acc066c9d4e)
- Correction de l'export des actes (e7954f3bb47339bbe915716bf8df0a02d0a7e968)
- Correction du filtre partenaire (6a0785b8a4ae7ea718acf408bd61283a8f3d4c9b)
- **lines:** correction du total de consommation voix internationale (7ce4243424b9069add374b371f5b3332ff46f445)
- Retours sur la getReport (fad11772b62eae424f012e9b891ecb84a42428e9)
- mise à jour des infos lors de l'ouverture du volet Utilisateur (0b4fb231af4360dde9930a5f69abd4dd7e4a1c3b)
- **lines:** mise à jour de l'acte de création des tranferts des lignes (e260d5631b85cd57ab0c3034cd303082a3d7263b)

## 0.21.1
2020-04-03

### Fixes

- Correction de l'activation/désacrivation des alarmes depuis le détail d'une ligne (70dc4232e60b7880475250e2cc6cc028ffa6af2e)
- n'afficher que les actes de gestion des 3 derniers mois dans les widgets de la homepage (73fae832007a8ee187a66d9e311c26d0bb75243e)

## 0.21.0
2020-04-03

### Features

- modifier alarm (d4557157e3c0046654b4ed2f7d8e9026333469ed)
- brancher onglet exclues alarm (a449a25cb120b31b0dc47bc6a9bf269fd876a282)
- créer une alarme depuis le détail d'une ligne (5823017ca048feb2bc32fa282c86ab48f5157481)

### Fixes

- correctif d'évaluation du partenaire dans le détail de l'alarme (82c4dbb9ff5ac6897004936529a78e023562e260)
- gestion du stepper pour le détail de la commande (cf6d3c7c8c000d493b900a09d11dd69c0ffe3a32)
- Création d'alarme (53936790e91ce89b84cab7892eeb04d4449c64dd)
- correction de la mise à jour de l'api workflows pour récupérer les offres uniquement actives (7b74fa2d9089d0b065c64524a32534806c74d68c)
- correction pour assigner immédiatement les indicateurs des commandes (4595adc86b11e15785af11fb8cd9025a99db1ee0)
- La recherche unitaire de lignes ne fonctionne plus (04ec4ad98b4f051ac3908e9dc16c25ae05f64a67)
- Corriger la création d'alarmes (7273a1fb4d0324c9cdc4a456864d600d1bea54d9)
- correction dans le détail d'alarme (cf6ae8592395bcf2af4f688d3f89b8c9ae04dc9c)
- correction de la mise à jour de l'api workflows pour récupérer les offres uniquement actives (280f932fdd98f91a4db5f224fb4ceaa910382835)
- Modification d'alarme (843f2bcd7b5e7ed5e9a1723e4706d8c4e7db64c0)
- ajout d'un espace entre le jour et l'heure sur les indicateurs (3860e19974004ba0bfc06ef33f4527f2fdc1874d)

## 0.20.0
2020-03-30

### Features

- alarm sur le changement de statut (43c0e23737a1976b5265f4f5fc7d8d78e8ba9f74)
- onglet "déclenchements dans les 2 derniers mois" dans l''écran de détail de l'alarme (e30f004eac768d7cca613bedffcb438a57731188)
- **admin:** ajout du filtre Groupe de partenaire (62cf899c845d4e5e8b0ad2172f521320d27b533c)
- Bouton Historique des actes de gestion (10cd351fbbe55436d0f589f7b5c78e2f5aa5fbb7)
- ajout de plusieurs informations dans le panel de du détail d'alarme (99e841a41c40c43ef8f5806561fb913ccee4bb82)
- **admin:** ajout du filtre Partenaires pour la gestion des utilisateurs (cfa9fbd1898bbbc3ff6713fafe54600542000cbe)
- Mise en place de l'écran de l'utilisateur. (fc8acdee47e6f58ff658e6631d2e785fa0f14881)

### Fixes

- mise à jour api et optimisation perf (moins de requêtes) (6a7a811ca3dfefd45dac4cd3348fff9b9ce45247)
- affichage des mois pour le widget Top/Flop (6ca9c79765eb7407d5b47d86f8e6b74c294de4a6)
- ne pas relancer la requête si l'appel renvoi une erreur 503 (0bca669d256d9a42a540a5b9e7133310e7656d06)
- calcul de la valeur de délai basé sur l'heure (9ea403404598f0e96faea962e9407c16951fb53c)
- correctif du calcul de la valeur de délai basé sur l'heure (7b4ef7a56b662c93974a16d068326dd0c3ba64d9)
- Correction du problème d'affichage des widgets de la homepage (1d0102dd7507443e67c5f1c5adacddcfd9ff1ee8)
- vérification de la valeur de type Number (0057bae2640747acb89dad8ce165fce64dad54f1)
- enlever partyID de la requête des lignes rattachés à une alarme (43713bfc67a98413074f3980165d1faa357f37b4)
- correctif sur la valeur de l'indicateur de Délai moyen (21125ccb16dae56c9a0ec041da9ab64c0508a940)
- arrondi sur la valeur de l'indicateur du Délai moyen (82dfbbcb123e6c4023a69a77c1efc0edcd9fe12e)
- Correction de la requête de création d'alarme de sur conso et sous conso (db69199fa5a873927f5ead561d391a0ea2ec6453)
- mise à jour des unités du Widget "Lignes les plus consommatrices du mois" (2abeee53a591d8955cea6e48b1426b320aa9fb0d)
- Reset de la pagination à l'application de filtre (1471f0663812cf5e00e5892cf48b1b67993fe78d)
- correction des abbreviations des mois (1d9c51cc3a7ee7c4b0ccb595e36f3677453a89e8)
- correction de l'abbreviation du mois de juillet (8a619518b600af0573e4d4c81c6dcb2c913460da)
- correction de l'abbreviation du mois de février (a805456958964f093c0a62e251e05fa7b18bae55)
- libellé "lignes sélectionnées" au lieu de "lignes trouvées' quand je crée un acte de gestion (b90fc89ff859ad0ec8889d133d2a438f237ec790)
- ajout dynamique des onglets pour les widgets Top/Flop (40490b48becf6d3fe1005cdbcdc8b5b43ebb2f63)
- derniers actes en premier dans le widget "derniers actes de gestion de l'utilisateur" (d6e560041774a97bced41e59d75d1ca450e82527)
- correction du bug pour appliquer le filtre sur les dates dans l'historique des actes de gestion (8ab7baa67d86bdc254c159921ce5c60f26e307c7)
- libellés des services n'apparaissent pas dans la création de commande (6f7d14a4febf3469c8b34e1ec5eceb0df1a006cf)
- Correction des tests cypress (7ffc586bb4f1412a093ecd5cfefa574f593db92f)
- Traduction du panel detail d'alarme (f13067510cde5188bd4bd1b3ff46c58dcb7a8041)
- suppression des labels se superposant au-dessus des barres des graphiques (cebf8a4c7ff991ce4d1e007ea6f26c6177e2ba56)
- ajout d'une propriété de visibilité pour afficher les blocs de filtres (1e23b955ef413c909501300b84572d7ebd6a0517)
- simplification des états d'affichage des filtres dans la gestion des utilisateurs (d4012340da26f0383abca09fb3101e665df50728)
- correctif du filtre Partenaires pour la gestion des utilisateurs (e5fdd26a517f4091d937cea3d2cc05b189ba5523)
- Changement des icones et leurs couleurs + FIX: centrer les icones (90c0b0caf8b864afe73cdb8dd75002c7aaa0d97d)
- ajout du contexte Partenaires pour afficher les indicateurs de commande (037f55e0579f50fa52ad111a2eca2b53434a6e8d)

## 0.19.1
2020-03-12

### Fixes

- mise à jour de l'api getCurrentUser (ae5ba8c5d976b3fd6323c8a3d80fb894f1ae7a4d)
- mise à jour de l'api users (939000ff0860ed8f6aa809e3f3beeac99e675fed)
- correction de la route du widget Acte de gestion (f3f5055f97d73788524a5a58d72e469d27cd60cb)
- ajout des libellés ligne(s) dans le rapport de quantité (42c6bf718447c0683eeaf28f30fa08a3c832d977)
- correction du comportement de sélection des filtres dans la gestion des utilisateurs (7b49f7efd37e390e1cd8cb0ee66426a6fb5e3a6a)
- ne pas relancer une requête en cas d'erreur 504 (633679343d8a6ee8a3f894ea12ec583d3e99b383)
- Clic sur "retour" depuis le détail de la ligne (0987c12737814ae6664db5be5fcb6397a72d091f)
- correction pour afficher l'iccid des actes unitaires (8e328d2345ce237a2413da894cf9502a1a8a9763)
- ajout de la clé groupedStatus pour exporter les actes unitaires (4d732384214d217500bfa1952dd6fac85537b174)
- **actlines:** Tri des lignes par date de statut de la ligne (4a980778d552a89e33d292d5fe3b7d684d930a45)
- **linedetail:** Mise à jour de l'appel API MarketingServices (ff87b0bab1f006307bdde03f8ee310575f9b3896)

## 0.19.0
2020-03-09

### Features

- écran de détail de l'alarme (65b0296a445c2b95364afaa4a6143099ebe2dc1b)
- onglet "lignes ciblées par l'alarme" dans l''écran de détail de l'alarme (f3dd3076bb76893bbb089a1eed247b26eed4fa67)
- création du widget Prise d'ordre (7a50ad32e3d697acf9d917a2c1a418d4b6e9699b)
- alarme de changement d'opérateur depuis la home des alarmes (68747ed554b6019a60f67ea33da6577bcd6b13d6)
- alarme sur le changement d’équipements (a362af14be9d91595a699356d02142b40b6f8d5e)
- import de fichiers des cartes SIM (6fa81ee9bd576cffae440c57e799f4cf4fe2458f)
- Alarmes de consommation (b4e2d9f601f9d8cfb289718c6ae8395039b19637)
- import des cartes SIM depuis le volet des détails de la commande (9558dce9520cbac8ceafa32547a7f6d4787b1bfe)
- Alarme sur le changement de pays (a97ddad2e8a862902c52e0c189ae83fef0f607d4)
- actions sur les alarmes depuis la table de résultat (e194f66b4e2a53a7680c7e12fefb9b529f621edb)
- création de la page d'index Gestion des utilisateurs et ajout de filtres de recherche (db46e172964278b5e9b7a01c6a1b43321be1f276)

### Fixes

- Upload des fichiers avec erreurs côté front (b9fdc719580482f53c64799559e0c26149c590c3)
- suppression de la propriété mock pour le widget Etat du parc (cde38cbd82a52118c46416aaca00a547d5f2446a)
- mise à jour des coordonnées de géo localisation (948be72ea93eed96a88077a41e339f036f29e85d)
- formattage du délai pour les indicateurs (f5278067003f1083ac7c35aa8d7b0560d7f7e79c)
- Margin bottom sur le detail de ligne onglet consommation (6ec4f9f584c742246058649b4a8601592234714e)
- 1025 Supprimer bouton si commande pas terminé (bd1b387794ed3eeac3eef080d8f7da4a9894567b)
- ajout du contexte de partenaires pour les Top widgets (7b1b99cf202ce352c25376718e8af8c3910c9c80)
- corriger la recherche initiale de lignes (eff95d30de9c303a7fcc1a304eeddfbdfa242dda)
- correctif des données entre sms et voix sur le volet du détail de la ligne (e0870cd6c5c6949ee8c154b6624e87a7929525df)
- Erreur de surface sur le filtre par fichier (50efcad9a6e1b48a322a34def5bc6fce537af1c1)
- correction css du bouton confirmer l'import des cartes SIM (b146c0bba7f54846a77bd0889aa589b071fae447)
- corriger le choix de partenaires (22e4fc9cf720994d099a23a1a91aca33b7c6755d)
- Retours sur l'alarme de consommation (798652c2867c842fc26aaeda1da505ccafef4df0)
- augmentation de la limite des suggestions retournées lors de la recherche des types de cartes sim (d06505f9486b496791c3b2047048998e550bf843)
- Correction du bug "acte de gestion sans lignes chargées" (b8993054f6dbcc56ac74c2dff35c20b41f222208)
- corrections de la confirmation d'import des cartes sim (e6113cca43c37a942b996818e9bc60669509fb7b)
- correction de la limite des suggestions retournées lors de la recherche des types de cartes sim (fe1cae3ff166d355cfb3e30890b259dd7069c5f9)
- correction pour mettre en place l'exemption de l'email pour la création de commandes (51aeea5f5e7b849301a6182dc455462c7961e559)
- adaptation aux changements de l'API d'export (3b108f5d9acdc526841b793a19f496b09ac55e78)
- corriger l'export d'actes (94dde91639a750cc7548bbc0ec5536183e8906ad)
- Désactivé le bouton de validation si erreur d'upload (d4df15570a13def6d47c68e18b4d252a27b76185)
- Modification de l'affichage de la date de statut dans le résultat des lignes (f02516fcfeb8a06c60932c528ba347a6490c199f)
- Afficher des données à jour dans le paneau de détail de commande (e67e532c6bf5b36f397d533b1c24476ed33f0d54)
- 1213 Changement du label 'Statut de la SIM' (0458a5d4f62af9474f39daf3f0dca93866ffdedb)
- Corriger la création d'alarmes (7bbedbbd703aac934a150909fff950c464d3505e)
- correction pour mettre en place l'exemption de l'email pour la création de commandes (606e2848a47ff9d362b1169e122f32b84a86271e)
- appel serveur pour rafraichir la commande après un import de cartes SIM (fcc6e41c0e078d0384fd4d72ace0d1e9b97cba54)
- Corriger la colonne status dans l'historique des actes de gestion de la ligne (82b01030198c23624f3aa90131fdfee52087fa03)
- Correction de la recherche par date (a89f3ca3648dc2fdc80f2da6edf88aa12c247cf8)

## 0.18.0
2020-02-19

### Features

- ajout du widget Etat du parc (11487c36d3b5dac109a5f85bda6a87a5f1497af9)
- lorsque je clique sur la quantité ciblées dans le volet de l'alarme, le détail de l'alarme s'ouvre sur le second onglet (7e8f147ca9c6fceecdfcd611489364dda6363bb5)
- création du widget Top/Flop CA (22919d46c41ace10e22c9e9e9f68c8c2b215a374)

### Fixes

- Optimiser les requêtes e recherche partenaire et CF (22a4e86b4a68fbd4fd382199c88899cb39bd7f99)
- ajouter les colonnes cycle d'observation et portée à la table des alarmes (8bc851ed2ae12ddd2f1c9847d083e39dade2c5bf)
- ne pas lancer systématiquement une recherche de lignes (615282f42a77fbea1c37558ddc466fbac9676ead)
- concaténation des indicateurs du widget Etat du parc (46ca63dea7d799fff1b30d5b9971b299181ba3b1)
- correction de la traduction des statuts de facturation (1301ddce3bd9ee04211c9ac0e59bf95da2ac517e)
- modification des prérequis pour les actes de gestion Changement d'offre et Changement de Compte de facturation (20d92b9ba6a2f1f0db5526ace63304a6a24bd7fc)
- tronquer les noms du widget Alarmes déclenchées (dc9fa3aabaa73617d63a3e63a196a4f7bef6703c)
- Ne charger que le alarmes de l'utilisateur (0cdfb7e1bf763da74d85b1fd5e8e57a187c14d44)
- newMSISDN undefined à vide (764ebec1a3badbc668113c6ac05e4084c7215d6e)
- saisir les heures dans la création des actes de gestion (f0cd856bba2704de25a74b51918d2456cf7d181d)
- ne pas afficher le bouton d'export en cas de résultat vide (eae926446f1e149d75fe4b24f21fda02b9778436)

## 0.17.0
2020-02-12

### Features

- intégration de l'écran de creation d'alarme en mode mock (ba873bf9ceff91b87c23f8eadb3c2ce5746c40b3)
- Partie front end pour l'écran de changement de pays (199c1410162fdbf5fdaebc2c1c27d946ec51cd69)
- Partie front pour la création de l'alarme "Changement d'opérateur" (dcf1bb6b968bcc71e24d1f5e49ce2253fc330170)
- Ecran pour l'alarme sur consommation (746f345e1319d7f83a3d1192b12983bfc3820ace)
- création du widget Lignes les plus consommatrices du mois (5a84a5455c14f81b9b02f30edd4d939410b79789)
- Ecran de création d'alarme "sous consommation" (2faa70632f0f3092c8bda21631d2fc85cd5f3b73)
- écran de creation d'alarme pour la consommation mutualisée (a9f8b45caa73ec5701b1b81c7673b10d00878d81)
- Ecran pour la création de rapports (43f67045036acef197462ae2b64f97955461400d)
- **widget:** ajout du widget Top 5 des alarmes déclenchées (123f619566b79abc04a19e0f0774918a87daa939)
- rechercher unitairement des alarmes et configurer ma table de résultat depuis la home des alarmes (4c1832c7a5ddac4e6137c3768f855d3da22f149f)
- Ajout de l'historique de déclenchement d'alarmes détail ligne (b9683ae93ae7b24856b73b0ccd88a3a0fab0eff7)
- ajout du widget Nombre d'alarmes déclenchées par jour (d6a32728a4f2cdd4b2d0974aa3ed55e8fae09229)
- changement des prérequis pour l'acte "Préactivation/activation" d'offre (dd3cd50fe68b5ee1eba3e994d3b5c798eec9334a)

### Fixes

- traduction des actions du widget Délais moyen (e7c9fa561e09ac64c67a35c1e9b1f4f707ea41ea)
- affichage du widget consommation mensuelle du parc (185c06f68f6a9130def4943c87e62708483c2b54)
- Ajouter la quantité dans le détail de l'alarme (f0dd4333b1d3c0b3c71f61a9b7f92bf5b2a6c016)
- correction et amélioration de l'ouverture du panel de détail de la commande (78872be8b2292272aace24e420f6808b4b376430)
- corrections de l'affichage des datas pour la consommation dans le détail de la ligne (e770173a000f61989f7bc550ea14c1cf091c39dd)
- corrections et modifications sur les détails de la consommation ligne (05d973ed4eee52bde188744fb4ce94406f8b8177)
- **orders:** mise à jour de la requête sur les commandes pour récupérer la référence du contrat (f820c905f6a2c89a126972eeb71605b346a4d6b4)
- Corriger la recherche de lignes par ID (059890a70b12eeb0808b2507decf1086162ad136)
- tronquage de la cellule Détails (70b89c972fb6a0e53899b796938af7a34128ecdb)
- masque les valeurs sur les histogrammes (a7d07de677c94bbce61c0a91a71b96e9d2adbe53)
- traduction du filtre statut de la ligne (27b5e0bfd2f2a11315c987938ec40960e64c6fe6)
- Corriger les boutons du panel de création de comandes (8d630546f83e04977073cec2654b0935dd355c66)
- Corriger le bouton "annuler" de la barre de contexte (092f27f11c467b7c690a3ad6b7c5afb2cbc8cf7d)
- Changement d'ICCID après détail de ligne (fcd1118ce18a73e85af95f2e4673fb8d6a4f89c1)
- Corriger le message en double lors du changement ICCID (c81b38698e9d688fa3ed32d7128dc0b448dc6211)
- Corriger la disposition des widgets (8a5f8f92d911c06a80c055167a0063c5c8bef871)
- remplacer Commandes en cours de traitement par le délai dans le widget commandes. (af69c5be6000dafe6aa42bfb2dda8586d7760759)
- Pagination sur filtre + ordre de pagination (2032d3baca80a34985f697168dfa8ba4e094ee13)
- remplacer Commandes en cours de traitement par le délai dans le widget commandes. (66d7989480bdede4ffa27781217eb501c9a772d2)
- Possibilité d'appliquer un changement de MSISDN même si le champ est vide (a2689cb7acf64612ccc488449550728b6b74f3f9)
- Correction de bugs d'affichage (9761b480c9df9c0877bf5b58c1af4cf130abd582)
- Changement du message d'erreur au chargement de fichier (2d40a04332baaed8dd9edb363e9a2181302fccde)
- Afficher les cartes sim correspondantes à la commande (499e423313a7ef4d07114bce125462d7ad1a0333)
- corrections de bugs dans le détail de l'unité de masse (aa7a6f31cfaa42438a3d79d73d03f885aaecdce8)
- écran de recherche d'une alarme (686bd3df4dcba1af8b7207ead7a5695006aed27f)
- ajout d'infos sur le titre du détail d'un acte de masse (7cc1a2fd7926548a900e53b826a3de31ee17d1eb)
- modification du scroll sur le carousel (c1650464a94f2444275994f869a5c51f03cca50f)
- ajout d'une traduction pour un message d'erreur sur la commande (43380b214b84396c058c3038bd2d38167131d182)
- configuration du calcul du nombre de sms par message (f8e5d1b659ce6b5c68a82c765c36d88825f1f2d6)
- undifiend a vide (eeb6b0ef7701d1fb09969501374f6638a79a4b4a)
- chercher par compte d efacturation (30b5f513d78e7a2ddfd08fa6ee8f0e374a033495)
- le nombre de SMS est rendu dynamiquement (4dc1ac931863afaa0d10d3b783809b4f99eedc84)
- Correction de bugs (544858ae08cb395f907a68660b9770d717ea17f1)
- succès et échecs des actes de gestion dans la même colonne (852d6f4016b39822726469bbf0cf4075ec1b0a53)
- Brancher le champ localisation (2e0038846181029b2c78e20c80b658a423e4d8e8)
- Correction de bugs d'affichage (f84bdb630fd9d5f744c6d6dcf702ddd33daccfcd)
- correction des dates d'application sur les filtres (279bf42229b9c86c6d5fd20036010a1c8551879f)
- Corriger la traduction du message d'erreur (52686c834baafb1b129ba400918d0e2e3f9de523)
- inversion et formation graphique supervision (f8023f255058de7fb115f6f3b3190c957ca7dbf3)
- ne pas afficher les champs spécifiques pour les utilisateurs autres que BO (f54d75a63e3b4162a68fdba6ddeb341e0411c53f)
- correction des indicateurs d'actes en échec (e82846b86c5d2084caae9cee1b11d8261e1cd458)
- Le clic sur "voir le détail" dans la liste des commandes n'ouvre pas le volet (3ae08242b3aa5a5721d99c3f45ce293ba3573c10)
- correction du filtre de type d'acte de gestion pour les actes de résiliation (b3d1c2b9746d81cf51e12b049425de885bab8113)
- ajout de la traduction du statut de la ligne (81a9fc7c54d4918844f59d71cb59f03ca6ae9fe6)
- Export de commande et d'actes de gestion (57e83f7f06875b89c72e1832aeaae3da8610cf7a)

## 0.16.0
2020-01-20

### Features

- Enregisrer la disposition des widgets en local storage (b32198c85f8190f05b68791e019b2b59ffaef151)
- Spring Cloud Kubernetes Discovery Support (5658d0f7a3fdd9b32ccf2c283caaf9189c0a1822)
- Spring Cloud Kubernetes Discovery Support (1d75af2c72b63bab26143726e94749c980062cea)
- Kubernetes Discovery support (f632a60b90d6c6a3cbc013764d4b95d19d45e293)
- Spring Cloud Kubernetes Discovery Support (da63b88c81e7c2d2434a5fdee85fe1c0367fd61c)
- récupération des données des adresses ip pour chaque service (5f8a65c872aaf9e75db4924b88975cdb16a8f94c)

### Fixes

- spécifications des conditions d'application du changement d'offre pour les actes en masse (a4b434ddaaebe586ada9b0fff288a87f24a30302)
- enlever le mock (65746a15d1868e39346801ec8436cf5e151ca20e)
- Envoyer les bons APNS lors de la création de commande (870ce6366364121852d749db4dd72169a4408812)
- mise à jour de l'acte de création Changement de compte de facturation (9d672fb61f870849297dce3adaeb26336e5d9bf7)
- activation des filtres appliqués lors de l'export des actes de gestion (fc6f60135d2c958715a6a82ab8ffc76dee4a99fd)
- Correction du changement de services pour une ligne (42d6d31284acc08fc9e94802fcbffcd48c8aa8ab)
- mise à jour de l'API du filtre Type de carte sim (b1241b740eaeec9df6fc18ab99a903d0fc2a7130)
- ecran détail de l'alarme (775f974e56996a804e26ab62b5cb4c5c4d41da51)
- **orders:** correction de la mise à jour de la validation de commande (7be68b76102cdc9b3975ad9004ec17909c62807c)
- ajout du context du partenarie pour l'acte de création du changement de compte de facturation (a30421021f12531ab67bd06fec7d313cac26f795)
- Ne pas demander la colonne id de gestion durant l'export de commandes (aca4d13b517799dd98ecc84734a316a75bc7a5db)
- configuration du changement de date lors du changement de compte de facturation (b1939756a347b1fa4f683db8d5dbdc296ff64608)
- mise à jour de l'api pour filtrer les types de carte sim (e3b991ca171b14628919d3b7de1c8c7e8d09d899)
- Afficher les types de carte sim correspondant au partenaires séléctionnés dans le filtre (f92c2b3a3277f5d304dbec5a082b9d545e6dfeb8)
- Corriger le changement de services (e856ff8653947906f32ad1b56386b0368a038a21)
- mise à jour de l'api de mutation du changement de services et du filtre de type de cartes sim (f3c3cb50c8da97d06e9e7a2398dbf46f9b84f94c)
- Correction du changement de services (6657f22069ac1b17e7b6494cb6b64a29f052b431)
- formatte type filter ids (ea53d5f60f9274f13bee9630f51e962deb22d9bc)

## 0.15.0
2020-01-13

### Features

- update specific fields (06d5dfeedb3fc87e4fd96d936ce2ebde788d833c)
- update carousel icons (b4b1001d317f65b583e955bafbc93614f2aabbc9)
- configuration de modification des champs spécifiques (fb3cc217644bcf24b3c20d1fdaac37ec6e9270ef)
- Volet de détail d'alarme (5636f1a3c41308ec1fb129fc849f0eb2c043815b)
- création d'acte pour le changement d'offre (7ad0fcfcb101b25c44397a510eaca0a162d2bcd4)
- graphes de consommation mensuelle du parc par mois (bef78c2ffe6adee20e70dc322f859718bc5de33c)
- affiche les indicateurs des alarmes (ee66619921d88e42e57c72e41e260eedfbdb6b8e)
- détail d'une alarme dans un volet (d0582213449429a2ca7196f9a005315a6af52190)
- evolution e l'api des types d'actes de gestion (d5716dfc8b4c22f9841ee723c7e0e8a731891f09)
- changement d'offre depuis le détail de la ligne (d60e4994fa650ab47a3ce0955d4b97ea1284eccc)

### Fixes

- Corriger le panel de détail d'acte de masse (57b232c516cbf3e0a8ac8618a478c924671bed4a)
- correction du bug "si on quitte la page de création d'un acte de gestion en cours de création, le mode création est toujours actif" (515cac52956a3002abbbe5e61d961885612cd7db)
- Il ne faut pas fermer le panel de création de commande sur un clic en dehors (9270738aaf1c48f2ec2798d7aa2855bde1c58d81)
- Corriger la clé de traduction activationDate (ce128c42606cc23883debc54d91058b3d9372b81)
- ne pas afficher le toggle activation pour l'acte "changement d'offre" (d1cadbae79fa3ed609675c2afaab1a5d3f1b2426)
- ne pas fermer le volet de création de commandes quand on cli à l'exptérieur (a815322c86be990188ae32c4396ea0316ee6548f)
- affichage de la quantité ciblée pour les actes de masse unitaire (8812f5ce4f5b2ceee772204ded9bfeb7185a886a)
- ajouter de nouvelles icones (dec22455da562b54ae1f69f6c8784bd82195a7a1)
- corriger la modification de champs libre sur des partenaires sans champs libres (285f60e5c76c82f3fa24ffd46f5dd1f7aa90a888)
- Correction de l'affichage de la liste des actes de gestion dans le détail de la ligne (451b59d4a7a8f0518fd3f4c5b61537f1fb1ec98d)
- Corriger les filtres de l'acte "Changement de champs libres" (ae0462da86a9a3ceaabf0c151e9e5017bb88c28b)
- correction du cic sur le caroussel (0ab0bd885c1297b89927d43925c0df5590a4e5cb)
- change build & run doc (93a33caac2c578f5e3472baf04badd0afe19d265)
- Correction de bugs divers (381cd8df7a7ba374ceb4048bc9f20c4ad65f7c37)
- validation des champs libres et des champs spécifiques au cours de l'acte de modification des champs libres (2c5598e64ae05bd1ab0ce6110e189dcadbc59d30)
- Corriger l'affichage des dates sur les services optionels (d9f959ab1acf5224a2c2f197b53360c1d8cdc220)
- Corriger le format de la date sur les status de facturation (4238489318e808c9a9e4b0a322f0f8e1caea3418)
- Correction de la recherche de lignes par offre (e65c8548edc4f2ac0f7a8c773f861065ae669d6f)
- ajout des champs spécifiques lors de l'acte de modification des champs libres (573c7c86d48db22ffa921fcf89196990e5f5e43c)
- mis à jour de l'information du statut de la ligne (4dff94816ef26f0e042c96853702472bf88f11ce)
- correctifs de bugs sur la gestion de l'affichage du tableau et de la ligne d'export (d1382b57d89045070c4164b52c7402ab63079eae)
- Corriger la recherche par offre (5bfda08f85679538fe77c6b7efd24ab4f7ca7031)
- vider l'input dans le multiselect après le choix d'une option (758fe3b0d8b7f797ed376959ae6aaf81bea21296)
- Pré remplir les services lors de la duplication de commandes (c89b7b199465c009c012e256a7ebb06f6729ba74)
- delete prop mock to carousel item change offer (ca07d4850dd490732d3820ac5117fa560ab6f932)
- correction de la création de commandes sans définir les services (697dfd153fe0cf68608324f14f102d2c9986c68a)

## 0.14.1
2019-12-17

### Fixes

- change build & run doc (773f13d2d3a1032beedca7cfe675bc2abb0e3a96)

## 0.14.0
2019-12-13

### Features

- activation de l'alarme pour une ligne (55b6073b82434ea736c6ec126bb7f9b7a5dbfbfb)
- ajout du filtre de date de déclenchement (aaf66a3c3021d8996c520a780a9910155bd09e35)
- Utiliser une tooltip pour afficher le statut de la command (68433aba58c3e2957a383485abe06839854b0890)
- rechercher unitairement des alarme (776123cf312442556017480da36cbcfbe0e566de)
- **line detail:** afficher les champs spécifique (d090e5384f0903b50f39cf389866f1e212080f38)
- ajout des champs spécifiques au détail de la ligne (d1a425ee3bb11fcc8ca5347751c8b405f4b31f66)

### Fixes

- Ne pas modifier le service data dans le changement de services quand ce service n'est pas modifiable (5b409bd61b4d9d0e049523e9f4cc91378cec33b5)
- mise à jour de message de confirmation pour l'activation d'une ligne (b1a5b2d7358e5a1a60bc9a4a57401fc2870742fd)
- personnalisation du message de confirmation lors de l'activation de l'alarme d'une ligne (90fe73d20e7dc236e63e98b1924fdc9d4e0d9c5d)
- enlever la demande de préactivation du changement d'offre. (184710f631f6bb939342f8262dd2be343b5f33f2)
- Corriger le problème d'affichage des services pour la résolution 1024 (d48223e2aa6273f83c7920d825ddbdb549f41436)
- corriger la recherche par ID (d94de103ab337775adc47b9b48655b8f817ad7f5)
- configuration des "Top" widget (6051e0be0b672643d74a35875db5448733d5f160)

## 0.13.1
2019-12-06

### Fixes

- modifie la clé name des paramètres de services (fb186ded6e903f328328bdb2717e2b9b84f4aada)
- traduction dans les filtres d'alarme (53a16f93e6b1986effb4eb4c9e5d96f0c6e469ba)

## 0.13.0
2019-12-06

### Features

- 673 Filtres partenaire, compte de facturation et offre dans la recherche des alarmes (d80086f26cfb65fbed0f252d92067f680322fd58)
- filtres portée de l'alarme et type de l'alarme dans la recherche des alarmes (8792ba9a23bc4b33ce8e083caf972bcd9555a781)

### Fixes

- bug détail de la ligne (68d19f11307b5fa4fd6061b42b50a796f97193ec)
- correction pour traduire les status des actes unitaires (138825faafb35afd9905559dd9e29808df14f2fa)
- Correction du bug : si on quitte la page de création d'un acte de gestion en cours de création, le mode création est toujours actif (b38276d0d7c08a2ba5290249a712d3360cc28293)
- correctif d'une clé sur l'api marketingServices (47cb2a8ce13cd4ca5c985aaf29a914fefd1d4056)

## 0.12.0
2019-12-02

### Features

- **widgets:** création des widgets "TOP" (caa7f07392b9e41ca99fd52f7f14d50338612763)

### Fixes

- Ajouter le skeleton de la page détails d'acte de gestion (3763f1436cada74daf82b0d8eabd0db904c102b1)
- Mettre les séparateurs de milliers (51e3bde966007cd7ba28969b6aaf8b0ec537f49c)
- Changement d'offre si aucun service n'est choisi (2060e4ba33c5c700f468bad28c609dd4f064d672)
- rendre la selection d'offre obligatoire sur l'acte de changement d'offre (c1bee9e9bf68d950ce2cc5a8123202a4cb05a86d)
- modification des labels du widget Délai moyen (c5e64996b130018efd7790c814b7b40b111d5c46)
- Correction de la recherche unitaire dans le détail de ligne (d1e1ca31fced206f7e9920de518b8b0c47f2c968)
- Correction de la mise à jour de la commande lors des actions depuis le volet (15a6b927908a754fb6507a9d0733cbf5df8d4851)
- Corriger le job gitlab pour les tests (5c26543b8921cfc9adbbbc37b4de17e754b849dd)
- correctif de l'alignement sur les zones de non résultat (3fb9a4125b376998d7ea4376005f333e3c6941b7)
- Corriger l'affichage des boutons sur IE sous la résolution 1024 (3c9c83c5a430dd4d2260951980c42f71a008df36)

## 0.11.1
2019-11-20

### Fixes

- 000 preactivation (319b4581d3b85da017f2565256576b330e894c8a)

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