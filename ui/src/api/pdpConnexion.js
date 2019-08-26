import { query } from './utils';

export async function fetchCurrentPdpConnexion(simCardInstanceId) {
  const response = await query(
    `
  query {
    pdpConnections(simCardInstanceId: ${simCardInstanceId}, pagination: {limit: 1, page: 0}) {
      connectionStatus
      connectionClosingReason
      startDate
      endDate
      apn
      ipAddressType
      ipV4Address
      ipV6Address
    }
  }
    `
  );
  return response.data.pdpConnections;
}
