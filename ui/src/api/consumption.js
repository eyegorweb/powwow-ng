import { query } from './utils';
import moment from 'moment';

export async function fetchSMSConsumption(simInstanceId) {
  const startDate = moment()
    .subtract(6, 'month')
    .format('DD-MM-YYYY HH:mm:ss');
  const endDate = moment().format('DD-MM-YYYY HH:mm:ss');

  const queryStr = `{
    smsConsumptionGraph(simCardInstanceId: ${simInstanceId}, startDate: {goe: "${startDate}"}, endDate: {lt: "${endDate}"}) {
      date
      numberOfSentSMS
      numberOfReceivedSMS
    }
  }
  `;
  const response = await query(queryStr);

  return response.data.smsConsumptionGraph;
}

export async function fetchVoiceUsageForGraph(simInstanceId) {
  const startDate = moment()
    .subtract(6, 'month')
    .format('DD-MM-YYYY HH:mm:ss');
  const endDate = moment().format('DD-MM-YYYY HH:mm:ss');
  const queryStr = `{
    voiceConsumptionGraph(simCardInstanceId: ${simInstanceId}, startDate: {goe: "${startDate}"}, endDate: {lt: "${endDate}"}) {
      date
      outgoing
      incoming
      outgoingMinutesTotal
      incomingMinutesTotal
    }
  }
  `;
  const response = await query(queryStr);

  return response.data.voiceConsumptionGraph;
}

export async function smsUsage(simInstanceId, pagination) {
  const paginationInfo = pagination
    ? `, pagination: {page: ${pagination.page}, limit: ${pagination.limit}}`
    : '';
  const queryStr = `{
    consumableUsageHistory(consumableToGet: SMS, simCardInstanceId: ${simInstanceId}, getLastOnly: false${paginationInfo}) {
      total
      items{
        smsHistory {
          accessPointId
          incomming
          recordOpeningTime
          recordOpeningSlice
          partyId
          countryISO3
          plmn
          updatedDate
          partitionId
          offerCode
          callingNumber
          calledNumber
          cellId
          usageType
          typeAppel
          zipCode
          city
          imei
          cellLongitude
          cellLatitude
        }
      }

    }
  }
  `;

  const response = await query(queryStr);

  return response.data.consumableUsageHistory;
}

export async function voiceUsage(simInstanceId, pagination) {
  const paginationInfo = pagination
    ? `, pagination: {page: ${pagination.page}, limit: ${pagination.limit}}`
    : '';
  const queryStr = `{
    consumableUsageHistory(consumableToGet: VOICE, simCardInstanceId: ${simInstanceId}, getLastOnly: false${paginationInfo}) {
      total
      items {
        voiceHistory{
          tiketId
          accessPointId
          incomming
          recordOpeningTime
          recordOpeningSlice
          partyId
          countryISO3
          plmn
          updatedDate
          partitionId
          offerCode
          callingNumber
          calledNumber
          duration
          cellId
          details
          usageType
          typeAppel
          imei
          zipCode
          city
          cellLatitude
          cellLongitude
        }
      }

    }
  }
  `;

  const response = await query(queryStr);

  return response.data.consumableUsageHistory;
}

export async function dataUsage(simInstanceId, pagination) {
  const paginationInfo = pagination
    ? `, pagination: {page: ${pagination.page}, limit: ${pagination.limit}}`
    : '';
  const queryStr = `{
    consumableUsageHistory(consumableToGet: DATA, simCardInstanceId: ${simInstanceId}, getLastOnly: false${paginationInfo}) {
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
  `;

  const response = await query(queryStr);

  return response.data.consumableUsageHistory;
}
