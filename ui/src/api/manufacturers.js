import { query, getValuesIdsWithoutQuotes } from './utils';

export async function getManufacturers(orderBy, pagination, filters = []) {
  const orderingInfo = orderBy ? `, sorting: {${orderBy.key}: ${orderBy.direction}}` : '';
  const paginationInfo = pagination
    ? `, pagination: {page: ${pagination.page}, limit: ${pagination.limit}}`
    : '';
  const queryStr = `
  query {
    getManufacturers(
      filter: {${formatFilters(filters)}}
      ${paginationInfo}
      ${orderingInfo}
      )
      {
        total
        items {
          manufacturer
          marketingName
        }
      }
  }`;

  const response = await query(queryStr);

  if (response && response.data) {
    return response.data.getManufacturers.items;
  }
}

export async function getDevices(orderBy, pagination, filters = []) {
  const orderingInfo = orderBy ? `, sorting: {${orderBy.key}: ${orderBy.direction}}` : '';
  const paginationInfo = pagination
    ? `, pagination: {page: ${pagination.page}, limit: ${pagination.limit}}`
    : '';
  const queryStr = `query {
    devices(
      filter: {${formatFilters(filters)}}
      ${paginationInfo}
      ${orderingInfo}
    ) {
      total
      items {
        imei
        iccid
        manufacturer
        deviceReference
        tac
        bands
        msisdn
        msisdnA
        imsi
        lastPLMN
        status
        statusDate
        party {
          name
          id
          code
        }
        offer {
          marketingOffer {
            code
          }
        }
      }
    }
  }
`;

  const response = await query(queryStr);

  if (response && response.data) {
    return response.data.devices.items;
  }
}

export function formatFilters(selectedFilters) {
  const gqlFilters = [];

  addRangeFilter(gqlFilters, selectedFilters, 'imei', 'getDevice.imeiRange');
  addManufacturerFilter(gqlFilters, selectedFilters);

  return gqlFilters.join(',');
}

function addManufacturerFilter(gqlFilters, selectedFilters) {
  const manufacturers = getValuesIdsWithoutQuotes(selectedFilters, 'getDevice.manufacturer');

  if (manufacturers) {
    gqlFilters.push(`manufacturer: {in: ["${manufacturers}"]}`);
  }
}

function addRangeFilter(gqlFilters, selectedFilters, gqlParamName, keyInCurrentFilter) {
  const filterValue = selectedFilters.find(f => f.id === keyInCurrentFilter);
  if (filterValue && filterValue.from && filterValue.to) {
    gqlFilters.push(
      `${gqlParamName}: {startsWith: "${filterValue.from}", endsWith: "${filterValue.to}"}`
    );
  } else if (filterValue && filterValue.from) {
    const containsSearch = filterValue.from.includes('*');
    if (containsSearch) {
      gqlFilters.push(`${gqlParamName}: {contains: "${filterValue.from.replace('*', '')}" }`);
    } else {
      gqlFilters.push(`${gqlParamName}: {startsWith: "${filterValue.from}" }`);
    }
  } else {
    return;
  }
}
