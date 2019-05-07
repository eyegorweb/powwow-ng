Container Sprong Boot pour l'application front end.

# GIT

Pour peupler le répertoire du submodule après un clone du projet :

```
 git submodule --init --recursive
```

Ou alors en une seule commande lorsque l'on clone le projet :

```
git clone --recurse-submodules https://m2m.extelia.fr/gitlab/powwow-ng/front/ui-server.git
```

Pour mettre à jour le submodule avec la dernière version commitée dans le projet UI :

```bash
git submodule update --recursive --remote
```

# NPM

NPM est installé et utilisé lors de la phase de build, en particulier pour charger les dépendances JS.

Pour configurer un proxy il faut modifier le fichier $USER_HOME/.npmrc en ajoutant :

```
https-proxy=http://vipproxy1.prod.extelia.fr:8080
```
 

# Build

Si besoin, configurer l'URL externe de OAuth dans le fichier /front/.env.{integration/.../production}

Cibler un environnement cible en passant le paramètre npmBuildEnv :

```bash
gradlew clean build -PnpmBuildEnv=integration (par exemple pour l'environnement d'intégration)
```


