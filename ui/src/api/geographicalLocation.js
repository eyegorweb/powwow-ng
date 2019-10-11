import { query } from './utils';

export async function lastGeographicalLocation(simCardInstanceId) {
  const response = await query(
    `
  query {
    lastGeographicalLocation(simCardInstanceId: ${simCardInstanceId}) {
      geographicalCoordinates
      celluleID
      lastCommunicationDate
      usageDetailsByDirection
      ticketGeneration
      latitude
      longitude
    }
  }
    `
  );
  return response.data.lastGeographicalLocation;
}

export async function exportAccessPointsByLocalisation(
  filters,
  columns,
  exportFormat,
  localisationType = 'CP'
) {
  const columnsParam = columns.join(',');

  const response = await query(
    `
    query {
      exportAccessPointsByLocalisation(localisationType: ${localisationType},${formatFilters(
      filters
    )}, columns: [${columnsParam}], exportFormat: ${exportFormat}) {
        downloadUri
        asyncRequired
      }
    }
    `
  );
  if (response.errors) {
    return { errors: response.errors };
  }

  return response.data.exportAccessPointsByLocalisation;
}

export async function accessPointsByLocalisation(filters, pagination, localisationType = 'CP') {
  const paginationInfo = pagination
    ? `, pagination: {page: ${pagination.page}, limit: ${pagination.limit}}`
    : '';
  const queryStr = `
  query {
    accessPointsByLocalisation(localisationType: ${localisationType},${formatFilters(
    filters
  )}${paginationInfo}) {
      total
      items {
        geolocation {
          imsi
          msisdn
          imei
          iccid
          countryCode
          zipCode
          cityName
          lastCommunicationDate
          plmn
          cellId
          usageType
          ticketGeneration
          pdpConnectionStatus
        }
        deviceInstance {
          manufacturer
          deviceReference
          imei
        }
      }
    }
  }`;
  const response = await query(queryStr);

  return response.data.accessPointsByLocalisation;
}

function formatFilters(filters) {
  const allFilters = [];
  const simcardId = filters.find(f => f.id === 'filters.simcardId');
  const iccid = filters.find(f => f.id === 'filters.iccid');
  const imsi = filters.find(f => f.id === 'filters.imsi');
  const msisdn = filters.find(f => f.id === 'filters.msisdn');
  const msisdnA = filters.find(f => f.id === 'filters.msisdnA');
  const imei = filters.find(f => f.id === 'filters.imei');

  if (simcardId) {
    allFilters.push(`simCardInstanceId: ${simcardId.value}`);
  }

  const identifierFilter = [];

  if (iccid) {
    identifierFilter.push(`iccid: "${iccid.value}"`);
  }
  if (imsi) {
    identifierFilter.push(`imsi: "${imsi.value}"`);
  }
  if (msisdn) {
    identifierFilter.push(`msisdn: "${msisdn.value}"`);
  }
  if (msisdnA) {
    identifierFilter.push(`msisdnA: "${msisdnA.value}"`);
  }
  if (imei) {
    identifierFilter.push(`imei: "${imei.value}"`);
  }

  if (identifierFilter.length) {
    allFilters.push(`identifierFilter: {${identifierFilter.join(',')}}`);
  }

  return allFilters.join(',');
}

export async function getNetworkWeatherUrl() {
  const response = await query(`
  {
    getUrl(typeUrl: NETWORK_WEATHER)
  }
  `);

  return response.data.getUrl;
}
