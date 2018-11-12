import GraphQLJSON from 'graphql-type-json';

export default {
  JSON: GraphQLJSON,

  Query: {
    availableFilters: (root, args, { db }) => db.get('availableFilters').value(),
  },
};
