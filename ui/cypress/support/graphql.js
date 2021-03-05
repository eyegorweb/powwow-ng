/**
 * Garder 4 dernieres requêtes
 * format
 * {
 *  id: String,
 *  queryStr: String,
 *  response: any
 * }
 */
let lastQueries = [];
const MAX_QUERIES_TO_SAVE = 10;

Cypress.Commands.add('resetGQLCache', () => {
  lastQueries = [];
});

Cypress.Commands.add('getExecutedQuery', (queryName, onFoundCb) => {
  const found = lastQueries.find(meta => meta.queryStr.includes(queryName));
  onFoundCb(found);
});

Cypress.Commands.add('startObservationGql', () => {
  cy.server().route({
    method: 'POST',
    url: '**/graphql',
    onRequest: arg => {
      if (arg.request.body && arg.request.body.query) {
        lastQueries.push({
          id: arg.id,
          queryStr: arg.request.body.query,
        });
        if (lastQueries.length > MAX_QUERIES_TO_SAVE) {
          lastQueries.splice(0, 1);
        }
      }
    },
    onResponse: ({ id, request, response }) => {
      window.Cypress.emit('gql', { request, response });
      const correspondingEntry = lastQueries.find(m => m.id === id);
      if (correspondingEntry) {
        correspondingEntry.response = response;
      }
    },
  });
});

Cypress.Commands.add('waitForGQL', queryName => {
  return new Cypress.Promise(resolve => {
    cy.on('gql', ({ request, response }) => {
      if (request.body && request.body.query && request.body.query.includes(queryName)) {
        resolve(response);
      }
    });
  });
});

Cypress.Commands.add('waitUntiGQLIsSent', queryName => {
  const check = resolve => {
    const meta = lastQueries.find(meta => meta.queryStr.includes(queryName));
    if (meta) {
      resolve(meta);
    } else {
      setTimeout(() => check(resolve), 500);
    }
  };
  return new Cypress.Promise(resolve => {
    check(resolve);
    /*
    cy.on('gql', ({ request, response }) => {
      if (request.body && request.body.query && request.body.query.includes(queryName)) {
        resolve(response);
      }
    });
    //*/
  });
});
