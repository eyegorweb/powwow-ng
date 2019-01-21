import { query } from './utils';

export async function fetchOrderCreators(q, partners, { page, limit }) {
  const partnersIds = partners.map(i => `"${i.id}"`).join();
  const queryStr = `
  query{
    users(filter:{fullname: {contains: "${q}"}, partyId:{in: [${partnersIds}]}}, pagination: {limit: ${limit}, page: ${page}}, sorting: {id: DESC}) {
      total
      items {
        id
        name {
          title
          firstName
          lastName
        }
        party {
          id
        }
      }
    }
  }
  `;

  const response = await query(queryStr);
  return response.data.users.items;
}
