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
    return response.data.devices;
  }
}

export function formatFilters(selectedFilters) {
  const gqlFilters = [];

  addRangeFilter(gqlFilters, selectedFilters, 'imei', 'getDevice.imeiRange');
  addManufacturerFilter(gqlFilters, selectedFilters);
  addDeviceReferenceFilter(gqlFilters, selectedFilters);
  addIdsFilter(gqlFilters, selectedFilters);

  return gqlFilters.join(',');
}

function addManufacturerFilter(gqlFilters, selectedFilters) {
  const manufacturers = getValuesIdsWithoutQuotes(selectedFilters, 'getDevice.manufacturer');

  if (manufacturers) {
    gqlFilters.push(`manufacturer: {in: ["${manufacturers}"]}`);
  }
}
function addDeviceReferenceFilter(gqlFilters, selectedFilters) {
  const deviceReferences = getValuesIdsWithoutQuotes(selectedFilters, 'getDevice.deviceReference');

  if (deviceReferences) {
    gqlFilters.push(`deviceReference: {in: ["${deviceReferences}"]}`);
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

function addIdsFilter(gqlFilters, selectedFilters) {
  const iccid = selectedFilters.find(f => f.id === 'filters.iccid');
  const imsi = selectedFilters.find(f => f.id === 'filters.imsi');
  const msisdn = selectedFilters.find(f => f.id === 'filters.msisdn');
  const imei = selectedFilters.find(f => f.id === 'filters.imei');
  const msisdnA = selectedFilters.find(f => f.id === 'filters.msisdnA');

  if (iccid) {
    gqlFilters.push(`iccid: {eq: "${iccid.value}"}`);
  }
  if (imsi) {
    gqlFilters.push(`imsi: {eq: "${imsi.value}"}`);
  }
  if (msisdn) {
    gqlFilters.push(`msisdn: {eq: "${msisdn.value}"}`);
  }
  if (imei) {
    gqlFilters.push(`imei: {eq: "${imei.value}"}`);
  }
  if (msisdnA) {
    gqlFilters.push(`msisdnA: {eq: "${msisdnA.value}"}`);
  }
}

export async function exportDevices(columns, orderBy, exportFormat, filters = []) {
  const columnsParam = columns.join(',');
  const orderingInfo = orderBy ? `, sorting: {${orderBy.key}: ${orderBy.direction}}` : '';
  const response = await query(
    `
    query {
      exportDevices(filters: {${formatFilters(
        filters
      )}}, columns: [${columnsParam}]${orderingInfo}, exportFormat: ${exportFormat} ) {
        downloadUri
        total
      }
    }
    `
  );
  if (!response) {
    return {
      errors: ['unknown'],
    };
  }
  if (response.errors) {
    return {
      errors: response.errors,
    };
  }
  return response.data.exportDevices;
}
