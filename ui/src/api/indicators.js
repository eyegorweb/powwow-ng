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

export async function fetchPrecalculatedIndicators(keys, partners, partnerType) {
  let partnerGql = '';
  let partnerTypeGql = '';

  if (partners && partners.length) {
    partnerGql = `, partyIds: [${partners.join(',')}]`;
  }

  if (partnerType) {
    partnerTypeGql = `, partyType: ${partnerType}`;
  }

  const queryStr = `
  query{
    indicators(names: [${keys.join(',')}]${partnerGql}${partnerTypeGql}) {
      name
      stringValue
      dateValue
      updateDate
      updateRequestDate
      numberValue
    }
  }
  `;

  const response = await query(queryStr);
  if (response && response.data && response.data.indicators) {
    return response.data.indicators;
  }

  return undefined;
}
export async function fetchPrecalculatedTopIndicators(keys, partners, partnerType) {
  let partnerGql = '';
  let partnerTypeGql = '';

  if (partners && partners.length) {
    partnerGql = `, partyIds: [${partners.join(',')}]`;
  }

  if (partnerType) {
    partnerTypeGql = `, partyType: ${partnerType}`;
  }

  const queryStr = `
  query{
    topIndicators(names: [${keys.join(',')}]${partnerGql}${partnerTypeGql}, limit: 5) {
      name
      partyName
      numberValue
    }
  }
  `;

  const response = await query(queryStr);
  return response.data.topIndicators;
}
