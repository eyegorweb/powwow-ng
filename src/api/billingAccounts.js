import { query } from './utils';

// TODO : verifier si il est nécessaire de passer des objet de partenaires , pkpas iun tableau d'ids ?
export async function fetchBillingAccounts(q, partners, { page, limit }) {
  const partnersIds = partners.map(i => `"${i.id}"`).join(',');
  const queryStr = `
  query{
    customerAccounts(filter:{name: {contains: "${q}"}, partyId:{in: [${partnersIds}]}}, pagination: {limit: ${limit}, page: ${page}}, sorting: {name: ASC}) {
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

export async function fetchBillibAccountForPartnerId(partnerId) {
  return await fetchBillingAccounts('', [{ id: partnerId }], { page: 0, limit: 50 });
}
