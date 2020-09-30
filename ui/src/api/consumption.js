import { query } from './utils';

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
  const queryStr = `{
    voiceConsumptionGraph(simCardInstanceId: ${simInstanceId}) {
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
          detailsTranslated
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
        ipAddressTypeTranslated
        connectionStatusTranslated
        pdpConnectionHistory {
          uploadVolume
          downloadVolume
          apn
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
          connectionClosingReasonTranslated
        }
        location {
          detail
          detailTranslated
          cellLatitude
          cellLongitude
          zipCode
          cellId
          countryIso3Translated
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

  const response = await query(queryStr);

  return response.data.consumptionOnDemand;
}

export async function createConsumptionOnDemand(simId, startDate, endDate) {
  const queryStr = `
  mutation {
    createConsumptionOnDemand(startDate: "${startDate}", endDate: "${endDate}", simCardInstanceId: ${simId}) {
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

export async function networkInformationForLine(msisdn) {
  const queryStr = `
  query {
    networkInformationForLine(lineMSISDN: "${msisdn}") {
      dataConsumtionAmount
      barringStatus
      barringTreshhold
      temporaryBarring
    }
  }
  `;

  const response = await query(queryStr);

  return response.data.networkInformationForLine;
}

export async function exportSmsHistory(simCardInstanceId, exportFormat) {
  const response = await query(
    `
    {
      exportSmsHistory(simCardInstanceId: ${simCardInstanceId}, exportFormat: ${exportFormat}, getLastOnly: false, columns: [MSISDN, CONSUMPTION_DATE, DIRECTION, CALLING_NUMBER, CALLED_NUMBER, OPERATOR, PLMN, ZIP_CODE, CITY, CELL_ID, IMEI, OFFER, LONGITUDE, LATITUDE, COUNTRY]) {
        downloadUri
        total
        asyncRequired
      }
    }
    `
  );
  if (!response) {
    return { errors: ['unknown'] };
  }
  if (response.errors) {
    return { errors: response.errors };
  }
  return response.data.exportSmsHistory;
}

export async function exportDataHistory(simCardInstanceId, exportFormat) {
  const response = await query(
    `
    {
      exportDataHistory(simCardInstanceId: ${simCardInstanceId}, exportFormat: ${exportFormat}, getLastOnly: false, columns: [MSISDN, CONNECTION_START_DATE, CONNECTION_END_DATE, CONNECTION_STATUS, REASON, UL_VOLUME, DL_VOLUME, IP_TYPE, APN, IP_V4_ADDRESS, IP_V6_ADDRESS, OPERATOR, PLMN, ZIP_CODE, CITY, COUNTRY, IMEI, OFFER, CELL_ID, LONGITUDE, LATITUDE]) {
        downloadUri
        total
        asyncRequired
      }
    }
    `
  );
  if (!response) {
    return { errors: ['unknown'] };
  }
  if (response.errors) {
    return { errors: response.errors };
  }
  return response.data.exportDataHistory;
}
export async function exportVoiceHistory(simCardInstanceId, exportFormat) {
  const response = await query(
    `
    {
      exportVoiceHistory(simCardInstanceId: ${simCardInstanceId}, exportFormat: ${exportFormat}, getLastOnly: false, columns: [MSISDN, CONSUMPTION_DATE, DURATION, USAGE_TYPE, DETAILS, DIRECTION, CALLING_NUMBER, CALLED_NUMBER, OPERATOR, PLMN, ZIP_CODE, CITY, CELL_ID, IMEI, OFFER, LONGITUDE, LATITUDE]) {
        downloadUri
        total
        asyncRequired
      }
    }
    `
  );
  if (!response) {
    return { errors: ['unknown'] };
  }
  if (response.errors) {
    return { errors: response.errors };
  }
  return response.data.exportVoiceHistory;
}

export async function fetchLastVisitedCountries(accessPointId) {
  const queryStr = `
    query {
      lastVisitedCountries(accessPointId: ${accessPointId}) {
        total
        items {
          countryName
          operator
          PLMN
          visitDate
          type
          usage
        }
      }
    }

  `;

  const response = await query(queryStr);
  return response.data.lastVisitedCountries;
}

export async function exportLastVisitedCountries(accessPointId, exportFormat) {
  const response = await query(
    `
    query {
      exportLastVisitedCountries(accessPointId: ${accessPointId} , exportFormat: ${exportFormat}){
        downloadUri
        total
        asyncRequired
      }
    }
  `
  );
  if (!response) {
    return { errors: ['unknown'] };
  }
  if (response.errors) {
    return { errors: response.errors };
  }
  return response.data.exportLastVisitedCountries;
}

export async function fetchCellsHistoryConsumption(accessPointId, pagination, orderBy) {
  const paginationInfo = pagination
    ? `, pagination: {page: ${pagination.page}, limit: ${pagination.limit}}`
    : '';
  const orderingInfo = orderBy ? `, sorting: {${orderBy.key}: ${orderBy.direction}}` : '';
  const queryStr = `
    query {
      cellsHistory(accessPointId: ${accessPointId} ${paginationInfo} ${orderingInfo}) {
        total
        items {
          cellId
          cellChangeDate
          country
          operator
          PLMN
          realPLMN
          zipCode
          city
          longitude
          latitude
        }
      }
    }
  `;

  const response = await query(queryStr);
  if (response.errors) {
    return { errors: response.errors };
  }
  return response.data.cellsHistory;
}

export async function exportCellsHistory(accessPointId, exportFormat) {
  const response = await query(
    `
    query{
      exportCellsHistory(accessPointId: ${accessPointId},  exportFormat: ${exportFormat}, columns:[CELLID CELLCHANGEDATE COUNTRY OPERATOR PLMN REALPLMN ZIPCODE CITY LONGITUDE LATITUDE]) {
          total
          downloadUri
          asyncRequired
        }
      }
    `
  );
  if (!response) {
    return { errors: ['unknown'] };
  }
  if (response.errors) {
    return { errors: response.errors };
  }
  return response.data.exportCellsHistory;
}

export async function fetchConsoHistory(filters) {
  const params = [];

  params.push(`partyId:${filters.partyId}`);
  if (filters.customerAccountCode) {
    params.push(`customerAccountCode:"${filters.customerAccountCode}"`);
  }

  const queryStr = `
  {
    consumptionHistory(${params.join(',')}) {
      partyId
      smsConsumption{
        consumptionDate
        consumptionFrIn
        consumptionFrOut
        consumptionRoamingIn
        consumptionRoamingOut
      }

      voiceConsumption{
        consumptionDate
        consumptionFrIn
        consumptionFrOut
        consumptionRoamingIn
        consumptionRoamingOut
      }

      dataConsumption{
        consumptionDate
        consumptionFrIn
        consumptionFrOut
        consumptionRoamingIn
        consumptionRoamingOut
      }
    }


  }
  `;
  const response = await query(queryStr);
  if (response.data) return response.data.consumptionHistory;
}
