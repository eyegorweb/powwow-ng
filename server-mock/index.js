const { ApolloServer, gql } = require('apollo-server');
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
      availableFilters: () => db.availableFilters,
      orders: () => db.orders,
    },
  };

  const server = new ApolloServer({ typeDefs, resolvers });

  server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
}
