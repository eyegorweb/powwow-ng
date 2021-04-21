## ajouter des dépendances


## Passer sur le registry yarn officiel
mv .yarnrc .yarnrc.backup
cp yarn.lock yarn.lock.backup
sed -i 's/outils.docapost.tech\/nexus\/repository\/npm-central/registry.yarnpkg.com/g' yarn.lock
