Container Sprong Boot pour l'application front end.

# NPM

NPM est installé et utilisé lors de la phase de build, en particulier pour charger les dépendances JS.

Pour configurer un proxy il faut modifier le fichier $USER_HOME/.npmrc en ajoutant :

```
https-proxy=http://vipproxy1.prod.extelia.fr:8080
```
 

# Build

Si besoin, configurer l'URL externe de OAuth dans le fichier /front/.env.{integration/.../production}

A la racine du projet, cibler un environnement cible en passant le paramètre npmBuildEnv :

```bash
gradlew clean build -PnpmBuildEnv=integration (par exemple pour l'environnement d'intégration)
```

# Run

A la racine du projet, cibler un environnement cible en passant le paramètre npmBuildEnv :

```bash
gradlew ui-server:bootRun -PnpmBuildEnv=integration (par exemple pour l'environnement d'intégration)
```

