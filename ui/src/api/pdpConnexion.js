import { query } from './utils';

export async function fetchCurrentPdpConnexion(simCardInstanceId) {
  const response = await query(
    `
    query {
      usagePerDay(consumableToGet: DATA, simCardInstanceId: ${simCardInstanceId}, pagination: {limit: 1, page: 0}) {
       dataHistroy {
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
       }
      }
    }
    `
  );
  return response.data.usagePerDay;
}
