import { query } from './utils';

export async function fetchCurrentPdpConnexion(simCardInstanceId, pagination) {
  const paginationInfo = pagination
    ? `, pagination: {page: ${pagination.page}, limit: ${pagination.limit}}`
    : '';
  const response = await query(
    `
    query {
      consumableUsageHistory(consumableToGet: DATA, simCardInstanceId: ${simCardInstanceId}, ${paginationInfo}) {
        total
        items {
          dataHistory {
            connectionId
            accessPointId
            connectionStatus
            connectionClosingReason
            startDate
            endDate
            apn
            ipAddressType
            ipV4Address
            ipV6Address
            uploadVolume
            downloadVolume
            plmn
            cellChangeDate
            isLast
            offerCode
            partyId
            imei
            zipCode
            city
            cellLatitude
            cellLongitude
          }
        }
      }
    }
    `
  );
  return response.data.consumableUsageHistory.items.map(e => e.dataHistory);
}
