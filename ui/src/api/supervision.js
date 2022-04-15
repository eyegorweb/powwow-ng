import { query } from './utils';

export async function supervisionDataGraph(partyIds) {
  return fetchSupervisionGraphData({
    supervisionType: 'MONTH',
    params: {
      partyIds,
    },
  });
}

export async function supervisionSmsGraph(partyIds) {
  return fetchSupervisionGraphSMS({
    supervisionType: 'MONTH',
    params: {
      partyIds,
    },
  });
}

export async function supervisionVoiceGraph(partyIds) {
  return fetchSupervisionGraphVoice({
    supervisionType: 'MONTH',
    params: {
      partyIds,
    },
  });
}

// Page supervision

export async function fetchSupervisionAlerts(filters, pagination, sorting) {
  const queryStr = `query SupervisionAlerts($filters: SupervisionAlertFilterInput!, $sorting: SupervisionAlertSorting, $pagination: Pagination!){
    supervisionAlerts(filter:$filters, sorting:$sorting, pagination: $pagination){
      total
      items{
        alertId
        partnerName
        startDate
        endDate
        type
        status
        usage
        label
        countryName
        countryNameFr
      }
    }
  }
  `;

  const variables = {
    filters: filters || {},
    pagination,
  };

  if (sorting) {
    variables.sorting = sorting;
  }

  const response = await query(queryStr, variables);

  if (response.data) {
    return response.data.supervisionAlerts;
  }
}

export async function fetchCockpitMarkers(filters) {
  const queryStr = `query CountServicesStateByCountry($filter:ServicesStateFilterInput! ){
    countServicesStateByCountry(filter: $filter ){
      locationCode
      locationCodeISO2
      countryCode
      locationName
      locationLatitude
      locationLongitude
      alertNumber
      activeAlertNumber
      dataTrafic
      smsTrafic
      voiceTrafic
      validFineGrainedSearch
      enoughValues
      raiseAlert
    }
  }
  `;

  const response = await query(queryStr, {
    filter: filters,
  });

  if (response.errors) {
    return {
      errors: response.errors,
    };
  }

  if (response.data) {
    return response.data.countServicesStateByCountry;
  }
}

export async function exportRequestFleetSupervision(params, exportFormat, sliceType, usageType) {
  var slices = getSlices(sliceType, params.dateSplitted);
  const offerCodeFilter = params.offerCode ? ` offerCode: "${params.offerCode}", ` : '';
  const queryStr = `mutation {
    addExportRequestFleetSupervision(
      filter: { ${offerCodeFilter} partyId: ${
    params.partyId
  }, usageType:${usageType}, selectedDate:"${
    params.date
  }", sliceType:${sliceType}, slices:[${slices.map((i) => `"${i}"`).join(',')}] ,country:"${
    params.country
  }"}, exportFormat:${exportFormat} ){
      downloadUri
      total
      asyncRequired
    }
  }
  `;
  const response = await query(queryStr);
  if (response.data) {
    return response.data;
  }
}

function getSlices(sliceType, date) {
  var slices = [];
  switch (sliceType) {
    case 'INTRA_DAY':
      if (date.length == 1) {
        slices = ['T0'];
      } else if (date.length == 2 && date[1] == '12h') {
        slices = ['T1'];
      } else if (date.length == 2 && date[1] == '18h') {
        slices = ['T2'];
      } else if (date.length == 2 && date[1] == '24h') {
        slices = ['T3'];
      }
      break;
    case 'INTRADAY_CUMUL':
      if (date.length == 1) {
        slices = ['T0'];
      } else if (date.length == 2 && date[1] == '12h') {
        slices = ['T0', 'T1'];
      } else if (date.length == 2 && date[1] == '18h') {
        slices = ['T0', 'T1', 'T2'];
      } else if (date.length == 2 && date[1] == '24h') {
        slices = ['T0', 'T1', 'T2', 'T3'];
      }
      break;
  }
  return slices;
}

export async function fetchLinesForCounter(filters, pagination = { limit: 10, page: 0 }, sorting) {
  const queryStr = `query GeoCounterList($filter: GeolocCounterFilterInput!, $pagination: Pagination!, $sorting: GeolocListSorting!) {
    geoCounterList(filter: $filter, pagination: $pagination, sorting: $sorting) {
    msisdn
    id
    countryName
    countryNameFr
    operatorName
    plmn
    address
    zipCode
    city
    cellid
    lastUsageDate
    lastUsageType
    lastPdpConStatus
    lastPdpConStartDate
    lastPdpConEndDate
    imei
    deviceReference
    deviceManufacturer
    networkStatus
    offer
    accesspoint
    lastTypeAppel
    infoExtra
    addressIpType
    addressIpV4
    addressIpV6
    apn
    operatorRealPlmn
    partyId
    partyName
    ticketGeneration
    imsi
    iccid
    locLongitude
    locLatitude
    usageDetails
    }
}
`;
  const response = await query(queryStr, {
    filter: filters,
    pagination,
    sorting,
  });

  if (response.errors) {
    return {
      errors: response.errors,
    };
  }

  return response.data.geoCounterList;
}

export async function fetchLinesForMarker(
  locationType,
  filters,
  pagination = { limit: 10, page: 0 },
  sorting = { cellid: 'ASC' }
) {
  const filtersForQuery = { ...filters };

  if (filters.msisdn || filters.imei) {
    filtersForQuery.locationType = 'CELL';
  }
  const queryStr = `query GeoList($filter: GeolocListFilterInput, $pagination: Pagination!, $sorting: GeolocListSorting!) {

    geoList(filter: $filter, pagination: $pagination, sorting: $sorting) {
        total
        items {
            msisdn
            id
            countryName
            countryNameFr
            operatorName
            plmn
            address
            zipCode
            city
            cellid
            lastDirection
            lastUsageDate
            lastUsageType
            lastPdpConStatus
            lastPdpConStartDate
            lastPdpConEndDate
            imei
            deviceReference
            deviceManufacturer
            networkStatus
            offer
            offerLabel
            accesspoint
            lastTypeAppel
            infoExtra
            addressIpType
            addressIpV4
            addressIpV6
            apn
            operatorRealPlmn
            partyId
            partyName
            ticketGeneration
            imsi
            iccid
            locLongitude
            locLatitude
            usageDetails
        }
    }
}
`;
  const response = await query(queryStr, {
    filter: {
      locationType,
      ...filtersForQuery,
    },
    pagination,
    sorting,
  });

  if (response.data) {
    return response.data.geoList;
  }
}

export async function fetchCockpitIndicator(filter = {}, usage = 'DATA') {
  const queryStr = `
  query CountWorldServiceState($filter: ServicesStateFilterInput!, $usage: ServicesStateUsageEnum!){
      countWorldServiceState(filter: $filter, usage: $usage)
  }
  `;

  const response = await query(queryStr, { filter, usage });

  if (response.data) {
    return response.data.countWorldServiceState;
  }
}

export async function globalActifParc(filters = {}) {
  return fetchIndicator('COUNTER1', 'ALL', filters);
}

export async function linesWithoutTraffic(filters = {}) {
  return fetchIndicator('COUNTER2', 'ALL', filters);
}

export async function linesWIthoutTraffic30Days(filters = {}) {
  return fetchIndicator('COUNTER3', 'ALL', filters);
}

export async function linesNonLocalizedTraffic(filters = {}) {
  return fetchIndicator('COUNTER4', 'ALL', filters);
}

export async function fetchIndicator(counter, usageType, filters = {}) {
  return geoCounter({
    filter: {
      counter,
      usageType,
      ...filters,
    },
  });
}

async function geoCounter(filters) {
  const queryStr = `
  query GeoCounter($filter: GeolocCounterFilterInput!){
      geoCounter(filter: $filter)
  }
`;

  const response = await query(queryStr, filters);
  if (!response) {
    return '-';
  }

  if (response.data) {
    return response.data.geoCounter;
  }
}

export async function fetchDataForAlarms() {}

export async function fetchGeoMapData(location, usageType, bounds, filters = {}) {
  const country = location.country != undefined ? location.country : null;
  return geoMap({
    filter: {
      scale: location.type,
      iso3CountryCode: country,
      frIncl: location.frIncl,
      usageType,
      ...filters,
      ...bounds,
    },
  });
}

async function geoMap(filters) {
  // ignorer la clé zone
  console.log('filters', filters.filter);
  delete filters.zone;
  const queryStr = `
  query GeoMap($filter: GeolocMapFilterInput!) {
    geoMap(filter:$filter) {
        locationCode
        countryCode
        locationName
        locationLatitude
        locationLongitude
        activeCount
        passiveCount
        nbAlarms
    }
  }`;

  const response = await query(queryStr, filters);

  if (response.data) {
    return response.data.geoMap;
  }
}

export async function fetchSupervisionOptions(partnerId) {
  const queryStr = `query {
    getOfferSupervisionOptions(partyId: ${partnerId}){
      workflowId
      description
      workflowCode
      autoDiagnosticEnabled
      fleetEnabled
      geolocalisationEnabled
      requestConsoEnabled
      imeiEnabled
      reportAvaiPDPEnabled
      dmdGeolocCPT
      dmdGeolocLimit
      dmdConsoLimit
      dmdConsoCPT
      rCard
    }
  }`;

  const response = await query(queryStr);
  if (response.data) {
    return response.data.getOfferSupervisionOptions;
  }
}

export async function fetchSupervisionGraphData(filters) {
  const queryStr = `query SupervisionDataGraph($supervisionType: SupervisionGraphType!, $params: GeoLocSearchParams!
    $beginDate: Date,
    $endDate: Date){
      supervisionDataGraphV2(supervisionType: $supervisionType,
        params: $params,
        beginDate: $beginDate,
        endDate: $endDate) {
        lastUpdateDate
        responses {
          date
          formatDate
          upload
          download
          numberRequests
          numberTraffSims
          numberRequestsOpening
        }
      }
    }
    `;

  const response = await query(queryStr, filters);

  if (!response || !response.data) {
    return {
      errors: ['unknown'],
    };
  }
  if (response.errors) {
    return {
      errors: response.errors,
    };
  }

  if (response.data) {
    return response.data.supervisionDataGraphV2;
  }
}

export async function fetchSupervisionGraphSMS(filters) {
  const queryStr = `query SupervisionSmsGraph($supervisionType: SupervisionGraphType!, $params: GeoLocSearchParams!
    $beginDate: Date,
    $endDate: Date){
      supervisionSmsGraphV2(supervisionType: $supervisionType,
        params: $params,
        beginDate: $beginDate,
        endDate: $endDate){
        responses{
          date
          formatDate
          numberOfSentSMS
          numberOfReceivedSMS
          numberOfTraffSims
        }
        lastUpdateDate
      }
    }
    `;

  const response = await query(queryStr, filters);

  if (!response || !response.data) {
    return {
      errors: ['unknown'],
    };
  }
  if (response.errors) {
    return {
      errors: response.errors,
    };
  }

  if (response.data) {
    return response.data.supervisionSmsGraphV2;
  }
}

export async function fetchSupervisionGraphVoice(filters) {
  const queryStr = `query SupervisionVoiceGraph($supervisionType: SupervisionGraphType!, $params: GeoLocSearchParams!
    $beginDate: Date,
    $endDate: Date){
      supervisionVoiceGraphV2(supervisionType: $supervisionType,
        params: $params,
        beginDate: $beginDate,
        endDate: $endDate){
        responses{
          date
          formatDate
          volumeIn
          volumeOut
          numberCallsIn
          numberCallsOut
          numberTraffSims

        }
        lastUpdateDate
      }
    }
    `;

  const response = await query(queryStr, filters);

  if (!response || !response.data) {
    return {
      errors: ['unknown'],
    };
  }
  if (response.errors) {
    return {
      errors: response.errors,
    };
  }

  if (response.data) {
    return response.data.supervisionVoiceGraphV2;
  }
}

let SUPERVISION_FILTERS_CACHE;

async function loadSupervisionAlertFilters() {
  if (SUPERVISION_FILTERS_CACHE) return;

  const queryStr = `
  query{
    getSupervisionAlertFilterLists{
      statuses{
        key
        value
      }
      types{
        key
        value
      }
      labels{
        key
        value
      }
    }
  }
  `;
  const response = await query(queryStr);

  if (response.data) {
    SUPERVISION_FILTERS_CACHE = response.data.getSupervisionAlertFilterLists;
  }
}

export async function getSupervisionAlertFilters() {
  await loadSupervisionAlertFilters();
  return SUPERVISION_FILTERS_CACHE;
}

export async function geoListExport(params) {
  const queryStr = `query GeoListExport($filter: GeolocListFilterInput, $columns: [AccessPointByLocationColumnEnum!]!, $exportFormat: ExportFormatEnum!, $asyncExportRequest: Boolean!) {
    geoListExport(filter: $filter, columns: $columns, exportFormat: $exportFormat, asyncExportRequest: $asyncExportRequest) {
        downloadUri
        total
        asyncRequired
    }
  }`;

  if (params.filter) {
    if (params.filter.iso3CountryCode === 'USA') {
      params.filter.locationType = 'STATES';
    }

    if (params.filter.msisdn || params.filter.ismsi) {
      params.filter.locationType = 'CELL';
    }
  }

  const response = await query(queryStr, params);

  if (!response || !response.data) {
    return {
      errors: ['unknown'],
    };
  }
  if (response.errors) {
    return {
      errors: response.errors,
    };
  }
  return response.data.geoListExport;
}

export async function geoCounterListExport(params) {
  const queryStr = `query GeoCounterListExport($filter: GeolocCounterFilterInput!, $columns: [AccessPointByLocationColumnEnum!]!, $exportFormat: ExportFormatEnum!, $asyncExportRequest: Boolean!) {
    geoCounterListExport(filter: $filter, columns: $columns, exportFormat: $exportFormat, asyncExportRequest: $asyncExportRequest) {
        downloadUri
        total
        asyncRequired
    }
  }`;

  const response = await query(queryStr, params);

  if (!response || !response.data) {
    return {
      errors: ['unknown'],
    };
  }
  if (response.errors) {
    return {
      errors: response.errors,
    };
  }
  return response.data.geoCounterListExport;
}

export async function supervisionExport(params) {
  const queryStr = `query SupervisionExport($supervisionType: SupervisionGraphType!, $params: GeoLocSearchParams!, $columns: [SupervisionColumnEnum!]!, $exportFormat: ExportFormatEnum!, $beginDate: Date, $endDate: Date) {
    supervisionExport(supervisionType: $supervisionType, params: $params, exportFormat: $exportFormat, columns: $columns, beginDate: $beginDate, endDate: $endDate) {
      downloadUri
      total
    }
  }`;

  const response = await query(queryStr, params);
  if (!response || !response.data) {
    return {
      errors: ['unknown'],
    };
  }
  if (response.errors) {
    return {
      errors: response.errors,
    };
  }
  return response.data.supervisionExport;
}

export async function lineDistributionByPlmn(params) {
  const queryStr = `query LineDistributionByPlmn($filter: GeolocListFilterInput ){
    lineDistributionByPlmn(
      filter: $filter
    ) {
      plmn
      accessPointNumber
      percentage
      operator
    }
  }
  `;

  const response = await query(queryStr, params);
  if (!response || !response.data) {
    return {
      errors: ['unknown'],
    };
  }
  if (response.errors) {
    return {
      errors: response.errors,
    };
  }

  return response.data.lineDistributionByPlmn;
}
