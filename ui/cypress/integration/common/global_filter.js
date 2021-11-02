import { Given } from 'cypress-cucumber-preprocessor/steps';

/* Instructions */

Given('Je filtre par {string} nommé {string}', (filterName, value) => {
  exec(filterName, [value], choose);
});

Given('Je filtre par liste {string} en choississant la valeur {string}', (filterName, value) => {
  exec(filterName, [value], list);
});

Given('Je filtre par insertion {string} avec une valeur de {string}', (filterName, value) => {
  exec(filterName, [value], type);
});

Given('Je filtre par item {string} valant {string}', (filterName, itemName) => {
  exec(filterName, [itemName], item);
});

Given('Je filtre par sélection {string} nommé {string}', (filterName, value) => {
  exec(filterName, [value], select);
});

Given('Je filtre par date {string} avec une période {string}', (filterName, period) => {
  exec(filterName, [period], date);
});

Given(
  'Je filtre par quantité {string} avec un minimum de {string} et un maximum de {string}',
  (filterName, min, max) => {
    exec(filterName, [min, max], quantity);
  }
);

/* Fonctions */

// Exécute l'instruction
function exec(filterName, parameters, filterFunction) {
  toggle(filterName);
  filterFunction.apply(this, parameters);
  toggle(filterName);
}

// Ouvre/Ferme le filtre
function toggle(filterName) {
  cy.waitGet('.filter-bar > div > div:last-child > span > div.foldable-block span')
    .contains(filterName)
    .parent()
    .then(($parent) => {
      cy.wrap($parent)
        .find('a.p-0')
        .click({ force: true });
    });
}

// Choisis la valeur indiquée (fonctionne pour les recherches et les checkboxes)
function choose(value) {
  cy.waitGet('.is-open > .pt-3 div.checkbox-container')
    .find('label')
    .then((labelElems) => {
      labelElems.each((index, labelElem) => {
        if (value === labelElem.textContent) {
          cy.waitGet(labelElem)
            .children('.checkmark')
            .click({ force: true });
        }
      });
    });
}

// Récupère la valeur de la liste indiquée (fonctionne uniquement pour les listes <ul>)
function list(value) {
  cy.waitGet('.is-open > .pt-3 ul')
    .children()
    .then((elems) => {
      elems.each((index, elem) => {
        if (value === elem.textContent) {
          cy.waitGet(elem).click({ force: true });
        }
      });
    });
}

// Rentre la valeur indiquée (fonctionne uniquement pour les <input>)
function type(value) {
  cy.waitGet('.is-open .cmp-ui-input input').type(value);
}

// Propre à la recherche d'utilisateurs
function item(item) {
  let path;
  if (item == 'Actif') path = '.item > :nth-child(1)';
  else if (item == 'Non actif') path = '.item > :nth-child(2)';
  cy.waitGet(path).click({ force: true });
}

// Sélectionne la valeur indiquée (fonctionne uniquement pour les <select>)
function select(value) {
  cy.waitGet('.is-open div.select > select').select(value);
}

// Sélectionne la période du filtre date indiquée
function date(period) {
  cy.waitGet('.is-open > div.pt-3 > div > div > div').click({ force: true });
  cy.waitGet(`body > .daterangepicker > .ranges > ul > li:nth-child(${period})`)
    .wait(500)
    .click({ force: true });
}

// Indique les quantités minimum et maximum du filtre quantité
function quantity(min, max) {
  cy.waitGet('.is-open input.form-control.border-right-0.h-100').type(min);
  cy.waitGet('.is-open input.form-control.border-left-0.h-100').type(max);
}
