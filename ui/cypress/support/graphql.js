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
  const found = lastQueries.find((meta) => meta.queryStr.includes(queryName));
  onFoundCb(found);
});

Cypress.Commands.add('startObservationGql', () => {
  cy.intercept('/api/graphql', (req) => {
    const payload = {};
    if (req.body && req.body.query) {
      payload.queryStr = req.body.query;
      payload.request = req;
      lastQueries.push(payload);
      if (lastQueries.length > MAX_QUERIES_TO_SAVE) {
        lastQueries.splice(0, 1);
      }
    }

    req.on('response', (response) => {
      // console.log('🚀 ~ file: graphql.js ~ line 35 ~ req.on ~ response', response);
      payload.response = response;
      window.Cypress.emit('gql', { request: req, response });
    });
  });
});

Cypress.Commands.add('waitForGQL', (queryName) => {
  return new Cypress.Promise((resolve) => {
    cy.on('gql', ({ request, response }) => {
      if (request.body && request.body.query && request.body.query.includes(queryName)) {
        resolve(response);
      }
    });
  });
});

Cypress.Commands.add('waitUntiGQLIsSent', (queryName) => {
  console.log('🚀 ~ file: graphql.js ~ line 53 ~ Cypress.Commands.add ~ queryName', queryName);
  const check = (resolve) => {
    const meta = lastQueries.find((meta) => meta.queryStr.includes(queryName));
    console.log('🚀 ~ file: graphql.js ~ line 56 ~ check ~ lastQueries', lastQueries, queryName);
    if (meta) {
      resolve(meta);
    } else {
      setTimeout(() => check(resolve), 500);
    }
  };
  return new Cypress.Promise((resolve) => {
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
