import { query, getFilterValue } from './utils';

export async function fetchAllCustomerAccounts(
  filters,
  pagination,
  order = { key: 'code', direction: 'ASC' }
) {
  const queryStr = `
  query{
    customerAccounts(filter:{${formatFilters(filters)}}, pagination: {limit: ${
    pagination.limit
  }, page: ${pagination.page}}, sorting: {${order.key}: ${order.direction}}) {
      total
      items {
        id
        code
        name
        siret
        siren
        marketLine
        company
        status
        massActionsDisabled
        auditable {
          created
        }
        party {
          id
        }
        bankAccount {
          name
          number
          establishmentCode
        }
        address {
          address1
          address2
          zipCode
          city
          country
          state
        }
      }
    }
  }
  `;
  const response = await query(queryStr);
  return response.data.customerAccounts;
}

// Gestion des filtres afin de les passer dans la requete GraphQL
export function formatFilters(filters) {
  let formattedFilters = [];

  // Recherche unitaire
  addContainsFilter(formattedFilters, filters, 'code', 'getadmin.cf.filters.code');
  addContainsFilter(formattedFilters, filters, 'name', 'getadmin.cf.label');
  addContainsFilter(formattedFilters, filters, 'marketLine', 'getadmin.cf.filters.marketLine');
  addContainsFilter(formattedFilters, filters, 'siret', 'getadmin.cf.filters.siret');
  addContainsFilter(formattedFilters, filters, 'siren', 'getadmin.cf.filters.siren');

  return formattedFilters.join(',');

  function addContainsFilter(formatted, filters, filterName, filterCode) {
    const filter = getFilterValue(filters, filterCode);

    if (filter) {
      formatted.push(`${filterName}: {contains: "${filter}"}`);
    }
  }
}
