import { query } from './utils';

export async function fetchUsers(q, partners, { page, limit }) {
  let partnersIds,
    partnerGqlParam = '';

  if (partners && partners.length > 0) {
    partnersIds = partners.map(i => `"${i.id}"`).join(',');
    partnerGqlParam = `, partyId:{in: [${partnersIds}]}`;
  }

  const queryStr = `
  query{
    users(filter:{fullname: {contains: "${q}"}${partnerGqlParam}}, pagination: {limit: ${limit}, page: ${page}}, sorting: {id: DESC}) {
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
