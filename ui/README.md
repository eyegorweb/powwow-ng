# powwow-ng-front

## Package Manager

Le projet utilise [yarn] au lieu de [npm] (package manager par défaut).

## Project setup

```sh
npm install
```

### Compiles and hot-reloads for development

```sh
npm run serve
```

### Compiles and minifies for production

```sh
npm run build
```

### Run your tests

```sh
npm run test
```

### Lint

ESLint + Prettier

Les règles spécifiques à Vue se trouvent dans [eslint-plugin-vue]

Pour lancer le lint, faire

```sh
yarn lint
```

### Lints and fixes files

```sh
npm run lint
```

### Run your unit tests

```sh
npm run test:unit
```

If tests are giving errors in almost every file, you may need to clear jest cache with `yarn jest --clearCache` and then run tests again

<!-- URLs utilisées -->

[yarn]: https://yarnpkg.com/lang/en/
[npm]: https://www.npmjs.com/
[eslint-plugin-vue]: https://github.com/vuejs/eslint-plugin-vue/

### Lancer les tests cypress en parallèle

#### Préparation de sorry cypress

Modifier le fichier suivant :

```
.cache/Cypress/5.6.0/Cypress/resources/app/packages/server/config/app.yml
```

Remplacer api.cypress.io par

```
api_url: http://localhost:1234/
```

```sh
cd cypress/dashboard
docker-compose -f ./docker-compose.minio.yml up
```

#### Lancer les tests

```sh
yarn e2e:dashboard --ci-build-id cypress_run_1
```

#### Portail Sorry cypress

```
http://localhost:9090/
```
