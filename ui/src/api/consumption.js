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
  /*
  const response = {
    data: {
      consumableUsageHistory: {
        total: 2,
        items: [
          {
            smsHistory: {
              accessPointId: 5915471,
              incomming: true,
              recordOpeningTime: '25-09-2018',
              recordOpeningSlice: 'T1',
              partyId: 397,
              countryISO3: 'FRA',
              plmn: '20820',
              updatedDate: '25-09-2018',
              partitionId: 71,
              offerCode: 'COMPTEUR_CSD_FR',
              callingNumber: '33620793108',
              calledNumber: '336112670262253',
              cellId: '4ED50EFA',
              usageType: 'SMS',
              typeAppel: 'SMSMT',
              zipCode: null,
              city: null,
              imei: '35985702142700',
              cellLongitude: null,
              cellLatitude: null,
            },
          },
          {
            smsHistory: {
              accessPointId: 5915471,
              incomming: true,
              recordOpeningTime: '25-09-2018',
              recordOpeningSlice: 'T1',
              partyId: 397,
              countryISO3: 'FRA',
              plmn: '20820',
              updatedDate: '25-09-2018',
              partitionId: 71,
              offerCode: 'COMPTEUR_CSD_FR',
              callingNumber: '33620793108',
              calledNumber: '336112670262253',
              cellId: '4ED50EFA',
              usageType: 'SMS',
              typeAppel: 'SMSMT',
              zipCode: null,
              city: null,
              imei: '35985702142700',
              cellLongitude: null,
              cellLatitude: null,
            },
          },
        ],
      },
    },
  };//*/

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

export async function fetchDataConsumptionForGraph(simCardInstanceId) {
  const queryStr = `{
    dataConsumptionGraph(simCardInstanceId: ${simCardInstanceId}) {
      date
      upload
      download
      pdpConnectionsNumber
    }
  }
  `;

  const response = await query(queryStr);
  return response.data.dataConsumptionGraph;
}

export async function consumptionOnDemand(simCardInstanceId, pagination) {
  const paginationInfo = pagination
    ? `, pagination: {page: ${pagination.page}, limit: ${pagination.limit}}`
    : '';
  const queryStr = `{
    consumptionOnDemand(simCardInstanceId: ${simCardInstanceId}${paginationInfo}) {
      isAllowCreateConsumptionOnDemand
      consumptionsOnDemands {
        total
        items {
          id
          periodStartDate
          periodEndDate
          fistIncomingTicketDate
          fistOutgoingTicketDate
          lastIncomingTicketDate
          lastOutgoingTicketDate
          dataIn
          dataOut
          smsIn
          smsOut
          voiceIn
          voiceOut
          Statut
        }
      }
    }
  }
  `;

  /*
  const response = {
    data: {
      consumptionOnDemand: {
        isAllowCreateConsumptionOnDemand: false,
        consumptionsOnDemands: {
          total: 1,
          items: [
            {
              id: 0,
              periodStartDate: '23-05-2015 00:00:00',
              periodEndDate: '23-05-2015 00:00:00',
              fistIncomingTicketDate: '23-05-2015 00:00:00',
              fistOutgoingTicketDate: '23-05-2015 00:00:00',
              lastIncomingTicketDate: '23-05-2015 00:00:00',
              lastOutgoingTicketDate: '23-05-2015 00:00:00',
              dataIn: 22,
              dataOut: 35,
              smsIn: 10,
              smsOut: 14,
              voiceIn: 36,
              voiceOut: 70,
            },
          ],
        },
      },
    },
  };
  //*/

  const response = await query(queryStr);

  return response.data.consumptionOnDemand;
}

export async function createConsumptionOnDemand(simId, startDate, endDate) {
  const queryStr = `
  mutation {
    createConsumptionOnDemand(startDate: "${startDate} 00:00:00", endDate: "${endDate} 00:00:00", simCardInstanceId: ${simId}) {
      id
    }
  }
  `;
  return await query(queryStr);
}
