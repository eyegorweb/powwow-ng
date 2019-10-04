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
    smsUsageHistory(simCardInstanceId: ${simInstanceId}, getLastOnly: false${paginationInfo}) {
      total
      items{
        smsHistoryData{
          accessPointId
          incomming
          recordOpeningTime
          recordOpeningSlice
          partyId
          plmn
          updatedDate
          partitionId
          offerCode
          callingNumber
          calledNumber
          usageType
          typeAppel
          imei
          offerCode
        }
        location {
          detail
          cellLatitude
          cellLongitude
          zipCode
          city
          cellId
          countryIso3
          referentialIso3
          operator
        }
      }

    }
  }
  `;

  const response = await query(queryStr);

  return response.data.smsUsageHistory;
}

export async function voiceUsage(simInstanceId, pagination) {
  const paginationInfo = pagination
    ? `, pagination: {page: ${pagination.page}, limit: ${pagination.limit}}`
    : '';
  const queryStr = `{
    voiceUsageHistory(simCardInstanceId: ${simInstanceId}, getLastOnly: false${paginationInfo}) {
        total
        items{
          voiceHistoryData{
            accessPointId
            incomming
            recordOpeningTime
            recordOpeningSlice
            partyId
            plmn
            updatedDate
            partitionId
            offerCode
            callingNumber
            calledNumber
            usageType
            typeAppel
            imei
            offerCode
            duration
            usageType
            callingNumber
            details
          }
          location {
            detail
            cellLatitude
            cellLongitude
            zipCode
            city
            cellId
            countryIso3
            referentialIso3
            operator
          }
        }

      }
    }
    `;

  const response = await query(queryStr);

  return response.data.voiceUsageHistory;
}

export async function dataUsage(simInstanceId, pagination) {
  const paginationInfo = pagination
    ? `, pagination: {page: ${pagination.page}, limit: ${pagination.limit}}`
    : '';
  const queryStr = `{
    dataUsageHistory(simCardInstanceId: ${simInstanceId}, getLastOnly: false ${paginationInfo}) {
      total
      items {
        pdpConnectionHistory {
          connectionStatus
          uploadVolume
          downloadVolume
          apn
          ipAddressType
          imei
          offerCode
          connectionId
          accessPointId
          ipV4Address
          ipV6Address
          cellChangeDate
          isLast
          partyId

        }
      	pdpConnectionDateInfo {
          startDate
          endDate
          connectionClosingReason
        }
        location {
          detail
          cellLatitude
          cellLongitude
          zipCode
          cellId
          countryIso3
          referentialIso3
          operator
        }
      }
    }
  }
  `;

  const response = await query(queryStr);

  return response.data.dataUsageHistory;
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
              Statut: 'RUNNING',
            },
            {
              id: 1,
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
              Statut: 'WAITING',
            },
            {
              id: 3,
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
              Statut: 'TERMINATED',
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

export async function removeConsumptionOnDemand(consumptionOnDemandId) {
  const queryStr = `
  mutation {
    removeConsumptionOnDemand(consumptionOnDemandId:${consumptionOnDemandId} ) {id }
  }
  `;
  return await query(queryStr);
}
