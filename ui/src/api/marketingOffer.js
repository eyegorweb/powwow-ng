import { query, getFilterValue } from './utils';

export function formatFilters(selectedFilters) {
  const gqlFilters = [];
  addCodeOrDescriptionFilter(gqlFilters, selectedFilters);
  addOfferTypeFilter(gqlFilters, selectedFilters);

  return gqlFilters.join(',');
}

function addCodeOrDescriptionFilter(gqlFilters, selectedFilters) {
  const codeOrDescription = getFilterValue(
    selectedFilters,
    'getadmin.offers.filters.codeOrDescription'
  );
  if (codeOrDescription) {
    gqlFilters.push(`codeOrDescription: {eq: "${codeOrDescription}"}`);
  }
}

function addOfferTypeFilter(gqlFilters, selectedFilters) {
  const foundFilter = selectedFilters.find((f) => f.id === 'getadmin.offers.filters.offerType');
  if (foundFilter) {
    gqlFilters.push(`genericType: {eq: ${foundFilter.data.value}}`);
  }
}

export async function searchMarketingOffers(filters, orderBy, pagination) {
  const orderingInfo = orderBy ? `, sorting: {${orderBy.key}: ${orderBy.direction}}` : '';
  const paginationInfo = pagination
    ? `, pagination: {page: ${pagination.page}, limit: ${pagination.limit}}`
    : '';
  const queryStr = `
  {
    marketingOffers(filter: {${formatFilters(filters)}}${paginationInfo}${orderingInfo}) {
      total
      items {
        id
        code
        description
        disabled
        flagGeneric
      }
    }

  }
  `;
  const response = await query(queryStr);

  if (response.errors) {
    return { errors: response.errors };
  }
  return response.data.marketingOffers;
}

export async function enableMarketingOffer(marketingOfferId) {
  return marketingOfferId;
}

export async function disableMarketingOffer(marketingOfferId) {
  return marketingOfferId;
}
