const express = require('express');

const { ApolloServer, gql } = require('apollo-server-express');
var fs = require('fs');
const db = require('./db');

fs.readFile('server-mock/schema.graphql', 'utf8', function(err, contents) {
  startServer(contents);
});

function startServer(schemaGQL) {
  const typeDefs = gql`
    ${schemaGQL}
  `;

  const resolvers = {
    Query: {
      orders: () => db.orders,
      getCurrentUser: () => db.getCurrentUser,
      indicators: () => db.indicators,
      partners: (q, args) => {
        const pages = groupItems(db.partners, args.pagination.limit);
        return pages[args.pagination.page - 1];
      },
    },
  };

  const server = new ApolloServer({ typeDefs, resolvers });
  const app = express();
  server.applyMiddleware({ app });

  // Mock authorisation server
  app.get('/oauth/authorize', function(req, res) {
    res.redirect(
      'http://' +
        req.get('Referrer').split('/')[2] +
        '/callback#access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmdhbml6YXRpb25JZCI6Ik9yZ2FuaXNhdGlvblRlc3QiLCJ1c2VyX25hbWUiOiJyaWNoYXJkIiwic2NvcGUiOlsid2ViY2xpZW50Il0sImV4cCI6MTU0MzYxNDQwNywiYXV0aG9yaXRpZXMiOlsiUk9MRV9BRE1JTiJdLCJqdGkiOiI4MWQzODlhNi1mY2IxLTQyYzAtYjBkMS04NmFkNTgyYWU5YmUiLCJjbGllbnRfaWQiOiJuZXh0Z2VudWktaW1wbGljaXQifQ.crKUh_IqYLz9adk7cb0Po07KlzkY8sZRatSkEqVHnYk&token_type=bearer&expires_in=43199&scope=webclient&organizationId=OrganisationTest&jti=81d389a6-fcb1-42c0-b0d1-86ad582ae9be'
    );
  });

  const port = 4000;
  app.listen({ port }, () =>
    console.log(`🚀 Fake server is up at http://localhost:${port}${server.graphqlPath}`)
  );
}

function groupItems(items, size) {
  var result = [];

  for (let i = 0, j = items.length; i < j; i += size) {
    result.push(items.slice(i, i + size));
  }
  return result;
}
