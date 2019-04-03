import { query } from './utils';

// TODO : verifier si il est nécessaire de passer des objet de partenaires , pkpas iun tableau d'ids ?
export async function fetchBillingAccounts(q, partners, { page, limit }) {
  let partnersIds,
    partnerGqlParam = '';

  if (partners && partners.length > 0) {
    partnersIds = partners.map(i => `"${i.id}"`).join(',');
    partnerGqlParam = `, partyId:{in: [${partnersIds}]}`;
  }

  const queryStr = `
  query{
    customerAccounts(filter:{code: {contains: "${q}"}${partnerGqlParam}}, pagination: {limit: ${limit}, page: ${page}}, sorting: {name: ASC}) {
      total,
      items {
        id
        name
        code
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
