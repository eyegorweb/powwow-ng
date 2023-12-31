import { query, getValuesIdsWithoutQuotes } from './utils';

function trim(value) {
  return ('' + value).trim();
}

export async function getManufacturers(q, orderBy, pagination) {
  const orderingInfo = orderBy ? `, sorting: {${orderBy.key}: ${orderBy.direction}}` : '';
  const paginationInfo = pagination
    ? `, pagination: {page: ${pagination.page}, limit: ${pagination.limit}}`
    : '';
  const queryStr = `
  query {
    getManufacturerNames(
      filter: {manufacturer: {startsWith: "${q}"}}
      ${paginationInfo}
      ${orderingInfo}
      )
      {
        total
        items
      }
  }`;

  const response = await query(queryStr);

  if (response && response.data) {
    return response.data.getManufacturerNames.items;
  }
}

export async function getDeviceReferences(q, orderBy, pagination) {
  const orderingInfo = orderBy ? `, sorting: {${orderBy.key}: ${orderBy.direction}}` : '';
  const paginationInfo = pagination
    ? `, pagination: {page: ${pagination.page}, limit: ${pagination.limit}}`
    : '';
  const queryStr = `
  query {
    getMarketingNames(
      filter: {marketingName: {startsWith: "${q}"}}
      ${paginationInfo}
      ${orderingInfo}
      )
      {
        total
        items
      }
  }`;

  const response = await query(queryStr);

  if (response && response.data) {
    return response.data.getMarketingNames.items;
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
            description
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

  addRangeFilter(gqlFilters, selectedFilters, 'imei', 'getdevice.imeiRange');
  addManufacturerFilter(gqlFilters, selectedFilters);
  addDeviceReferenceFilter(gqlFilters, selectedFilters);
  addIdsFilter(gqlFilters, selectedFilters);
  addPartnerFilter(gqlFilters, selectedFilters);

  return gqlFilters.join(',');
}

function addPartnerFilter(gqlFilters, selectedFilters) {
  const partyIds = getValuesIdsWithoutQuotes(selectedFilters, 'getdevice.partners');
  if (partyIds) {
    gqlFilters.push(`partnerIds:[${partyIds}]`);
  }
}

function addManufacturerFilter(gqlFilters, selectedFilters) {
  const manufacturers = getValuesIdsWithoutQuotes(selectedFilters, 'getdevice.manufacturer');

  if (manufacturers) {
    gqlFilters.push(`manufacturer: {in: ["${manufacturers}"]}`);
  }
}
function addDeviceReferenceFilter(gqlFilters, selectedFilters) {
  const deviceReferences = getValuesIdsWithoutQuotes(selectedFilters, 'getdevice.deviceReference');

  if (deviceReferences) {
    gqlFilters.push(`deviceReference: {in: ["${deviceReferences}"]}`);
  }
}

function addRangeFilter(gqlFilters, selectedFilters, gqlParamName, keyInCurrentFilter) {
  const filterValue = selectedFilters.find((f) => f.id === keyInCurrentFilter);
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
  const iccid = selectedFilters.find((f) => f.id === 'filters.iccid');
  const imsi = selectedFilters.find((f) => f.id === 'filters.imsi');
  const msisdn = selectedFilters.find((f) => f.id === 'filters.msisdn');
  const imei = selectedFilters.find((f) => f.id === 'filters.imei');
  const msisdnA = selectedFilters.find((f) => f.id === 'filters.msisdnA');

  if (iccid && iccid.value) {
    gqlFilters.push(`iccid: {eq: "${trim(iccid.value)}"}`);
  }
  if (imsi && imsi.value) {
    gqlFilters.push(`imsi: {eq: "${trim(imsi.value)}"}`);
  }
  if (msisdn && msisdn.value) {
    gqlFilters.push(`msisdn: {eq: "${trim(msisdn.value)}"}`);
  }
  if (imei && imei.value) {
    gqlFilters.push(`imei: {eq: "${trim(imei.value)}"}`);
  }
  if (msisdnA && msisdnA.value) {
    gqlFilters.push(`msisdnA: {eq: "${trim(msisdnA.value)}"}`);
  }
}

export async function exportDevices(
  columns,
  orderBy,
  exportFormat,
  asyncExportRequest = false,
  filters = []
) {
  const columnsParam = columns.join(',');
  const orderingInfo = orderBy ? `, sorting: {${orderBy.key}: ${orderBy.direction}}` : '';
  let asyncExportRequestParam = '';
  if (asyncExportRequest) {
    asyncExportRequestParam = `, asyncExportRequest: ${asyncExportRequest}`;
  }
  const response = await query(
    `
    query {
      exportDevices(filters: {${formatFilters(
        filters
      )}}, columns: [${columnsParam}]${orderingInfo}, exportFormat: ${exportFormat}${asyncExportRequestParam} ) {
        downloadUri
        asyncRequired
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
