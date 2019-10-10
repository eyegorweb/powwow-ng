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

export async function accessPointsByLocalisation(
  simCardInstanceId,
  pagination,
  localisationType = 'CP'
) {
  const paginationInfo = pagination
    ? `, pagination: {page: ${pagination.page}, limit: ${pagination.limit}}`
    : '';
  const queryStr = `
  query {
    accessPointsByLocalisation(localisationType: ${localisationType}, simCardInstanceId: ${simCardInstanceId}${paginationInfo}) {
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

export async function getNetworkWeatherUrl() {
  const response = await query(`
  {
    getUrl(typeUrl: NETWORK_WEATHER)
  }
  `);

  return response.data.getUrl;
}
