import { query } from './utils';

// TODO : verifier si il est nécessaire de passer des objet de partenaires , pkpas iun tableau d'ids ?
export async function fetchBillingAccounts(q, partners, { page, limit, partnerType }) {
  let partnersIds,
    partnerGqlParam = '';

  if (partners && partners.length > 0) {
    partnersIds = partners
      .filter(i => i.id)
      .map(i => `"${i.id}"`)
      .join(',');
    partnerGqlParam = `, partyId:{in: [${partnersIds}]}`;
  }

  let partnerTypeGqlFilter = '';
  if (partnerType) {
    partnerTypeGqlFilter = `, partyType: {in: [${partnerType}]}`;
  }

  const queryStr = `
  query{
    customerAccounts(filter:{code: {startsWith: "${q}"}${partnerGqlParam}${partnerTypeGqlFilter}}, pagination: {limit: ${limit}, page: ${page}}, sorting: {name: ASC}) {
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
