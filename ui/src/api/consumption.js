import { query } from './utils';
import moment from 'moment';

export async function fetchSMSConsumption(simInstanceId) {
  const queryStr = `{
    smsConsumptionGraph(simCardInstanceId: ${simInstanceId}) {
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
    voiceConsumptionGraph(simCardInstanceId: ${simInstanceId}, startDate: {goe: "${startDate}"}, endDate: {gt: "${endDate}"}) {
      date
      outgoing
      incoming
      outgoingMinutesTotal
      incomingMinutesTotal
    }
  }
  `;
  const response = await query(queryStr);

  /*
  const response = {
    data: {
      voiceConsumptionGraph: [
        {
          date: '01-05-2018',
          outgoing: 1,
          incoming: 2,
          outgoingMinutesTotal: 4,
          incomingMinutesTotal: 5,
        },
        {
          date: '09-05-2018',
          outgoing: 6,
          incoming: 4,
          outgoingMinutesTotal: 18,
          incomingMinutesTotal: 20,
        },

        {
          date: '12-05-2018',
          outgoing: 10,
          incoming: 9,
          outgoingMinutesTotal: 60,
          incomingMinutesTotal: 15,
        },
      ],
    },
  };
  //*/

  return response.data.voiceConsumptionGraph;
}

export async function smsUsage(simInstanceId, pagination) {
  const paginationInfo = pagination
    ? `, pagination: {page: ${pagination.page}, limit: ${pagination.limit}}`
    : '';
  const queryStr = `{
    usagePerDay(consumableToGet: SMS, simCardInstanceId: ${simInstanceId}, getLastOnly: false${paginationInfo}) {
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
      }
    }
  }
  `;

  const response = await query(queryStr);

  /*
  const response = {
    data: {
      usagePerDay: [
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
          },
        },
      ],
    },
  };
  //*/

  return response.data.usagePerDay;
}
