import { query } from './utils';

export async function fetchBillingAccounts(q, partners, { page, limit }) {
  const partnersIds = partners.map(i => `"${i.id}"`).join(',');
  const queryStr = `
  query{
    customerAccounts(filter:{name: {contains: "${q}"}, partyId:{in: [${partnersIds}]}}, pagination: {limit: ${limit}, page: ${page}}, sorting: {id: DESC}) {
      total,
      items {
        id
        name
        party {
          id
        }
      }
    }
  }
  `;
  const response = await query(queryStr);
  return response.data.customerAccounts.items;
}
