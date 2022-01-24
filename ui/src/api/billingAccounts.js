import { query } from './utils';

// TODO : verifier si il est nécessaire de passer des objet de partenaires , pkpas iun tableau d'ids ?
export async function fetchBillingAccounts(q, partners, { page, limit, partnerType }) {
  return await searchBillingAccounts(q, partners, undefined, { page, limit, partnerType });
}

export async function searchBillingAccounts(
  q,
  partners,
  notEqualBillingAccount,
  { page, limit, partnerType }
) {
  let partnersIds,
    partnerGqlParam = '';

  if (partners && partners.length > 0) {
    partnersIds = partners
      .filter((i) => i && i.id)
      .map((i) => `"${i.id}"`)
      .join(',');
    partnerGqlParam = `, partyId:{in: [${partnersIds}]}`;
  }

  let partnerTypeGqlFilter = '';
  if (partnerType) {
    partnerTypeGqlFilter = `, partyType: {in: [${partnerType}]}`;
  }
  let neBillingAccountIdParam = '';
  if (notEqualBillingAccount) {
    neBillingAccountIdParam = `, id:{ne:${notEqualBillingAccount.id}}`;
  }

  const queryStr = `
  query{
    customerAccounts(filter:{code: {startsWith: "${q}"}${partnerGqlParam}${partnerTypeGqlFilter}${neBillingAccountIdParam}}, pagination: {limit: ${limit}, page: ${page}}, sorting: {name: ASC}) {
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
export async function fetchBillingAccountsForChangeAccount(
  q,
  partners,
  notEqualBillingAccount,
  { page, limit, partnerType }
) {
  return await searchBillingAccounts(q, partners, notEqualBillingAccount, {
    page,
    limit,
    partnerType,
  });
}
