import { query, getFilterValue, getFilterValues } from './utils';

export async function fetchIndicators() {
  const response = await query(
    `
    query {
      ordersIndicators {
        averageProcessingTime
      }
    }
    `
  );
  return response.data.ordersIndicators;
}

export async function fetchAverageProcessingTime(filterPartner) {
  const queryStr = `
  query {
    averageProcessingTime: ordersIndicators(filter: {${formatFilters(filterPartner)}}) {
      averageProcessingTime
    }
  }
  `;

  const response = await query(queryStr);
  return response.data.averageProcessingTime.averageProcessingTime;
}

function formatFilters(filters) {
  const allFilters = [];
  const partyIds = getValuesIds(filters, 'filters.partners');
  if (partyIds) {
    allFilters.push(`partyId: {in:[${partyIds}]}`);
  }

  let partyTypes;

  const partyTypesParam = getFilterValue(filters, 'filters.partnerType');
  if (partyTypesParam) {
    partyTypes = partyTypesParam.map(i => `${i.id}`).join(',');
  }
  if (partyTypes) {
    allFilters.push(`partyType: {in:[${partyTypes}]}`);
  }

  const customerAccountIds = getValuesIds(filters, 'filters.billingAccounts');
  if (customerAccountIds) {
    allFilters.push(`customerAccountId: {in:[${customerAccountIds}]}`);
  }

  return allFilters.join(',');
}

function getValuesIds(filters, filterId) {
  const values = getFilterValues(filters, filterId);
  if (values) {
    return values.map(i => `"${i.id}"`).join(',');
  }
}
