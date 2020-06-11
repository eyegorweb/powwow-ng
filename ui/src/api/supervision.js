import { query } from './utils';

// TODO: Refact : utiliser la fonction fetchSupervisionGraphData
export async function supervisionDataGraph(partyIds) {
  const queryStr = `
  query {
    supervisionDataGraph(supervisionType:MONTH, params:{partyIds:[${partyIds.join(',')}]}) {
     date
     upload
     download
     numberRequests
     numberTraffSims
     numberRequestsOpening
   }
 }`;
  const response = await query(queryStr);

  return response ? response.data.supervisionDataGraph : undefined;
}

export async function supervisionSmsGraph(partyIds) {
  const queryStr = `
  query {
    supervisionSmsGraph(supervisionType:MONTH, params:{partyIds:[${partyIds.join(',')}]}) {
      date
      numberOfSentSMS
      numberOfReceivedSMS
      numberOfTraffSims
    }
  }
  `;
  const response = await query(queryStr);
  return response.data.supervisionSmsGraph;
}

export async function supervisionVoiceGraph(partyIds) {
  const queryStr = `
  query {
    supervisionVoiceGraph(supervisionType:MONTH params:{partyIds:[${partyIds.join(',')}]}) {
      date
      volumeIn
      volumeOut
      numberCallsIn
      numberCallsOut
      numberTraffSims
    }
  }
  `;
  const response = await query(queryStr);
  return response.data.supervisionVoiceGraph;
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
    return response.data.countServicesStateByCountry;
  }
}

export async function fetchCockpitMarkers(filters) {
  const queryStr = `query CountServicesStateByCountry($filter:ServicesStateFilterInput! ){
    countServicesStateByCountry(filter: $filter ){
      locationCode
      locationCodeISO2
      countryCode
      locationName
      locationNameFr
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

  if (response.data) {
    return response.data.countServicesStateByCountry;
  }
}

export async function fetchLinesForCounter(
  counter,
  usageType,
  pagination = { limit: 10, page: 0 },
  sorting = { cellid: 'ASC' }
) {
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
    filter: {
      counter,
      usageType,
    },
    pagination,
    sorting,
  });

  if (response.data) {
    return response.data.geoCounterList;
  }
}

export async function fetchLinesForMarker(
  locationType,
  filters,
  pagination = { limit: 10, page: 0 },
  sorting = { cellid: 'ASC' }
) {
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
}
`;
  const response = await query(queryStr, {
    filter: {
      locationType,
      ...filters,
    },
    pagination,
    sorting,
  });

  if (response.data) {
    return response.data.geoList.items;
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

  if (response.data) {
    return response.data.geoCounter;
  }
}

export async function fetchContinentData(usageType, filters = {}) {
  return geoMap({
    filter: {
      scale: 'CONTINENT',
      usageType,
      ...filters,
    },
  });
}

export async function fetchCountriesData(usageType) {
  return geoMap({
    filter: {
      scale: 'COUNTRY',
      usageType,
    },
  });
}

export async function fetchStatesData(usageType, bounds) {
  return geoMap({
    filter: {
      scale: 'STATES',
      iso3CountryCode: 'US',
      usageType,
      ...bounds,
    },
  });
}

export async function fetchDataForCells(usageType, bounds) {
  return geoMap({
    filter: {
      scale: 'CELL',
      usageType,
      ...bounds,
    },
  });
}

export async function fetchDataForCities(usageType, bounds, filters = {}) {
  return geoMap({
    filter: {
      scale: 'CITY',
      usageType,
      ...bounds,
      ...filters,
    },
  });
}

export async function fetchFrenchRegionsData(usageType, bounds) {
  return geoMap({
    filter: {
      scale: 'REGION',
      iso3CountryCode: 'FRA',
      usageType,
      ...bounds,
    },
  });
}

export async function fetchFrenchDepartmentsData(usageType, bounds) {
  return geoMap({
    filter: {
      scale: 'DEPARTMENT',
      iso3CountryCode: 'FRA',
      usageType,
      ...bounds,
    },
  });
}

async function geoMap(filters) {
  const queryStr = `
  query GeoMap($filter: GeolocMapFilterInput!) {
    geoMap(filter:$filter) {
        locationCode
        countryCode
        locationName
        locationNameFr
        locationLatitude
        locationLongitude
        activeCount
        passiveCount
    }
  }`;

  const response = await query(queryStr, filters);

  if (response.data) {
    return response.data.geoMap;
  }
}

export async function fetchSupervisionGraphData(filters) {
  const queryStr = `query SupervisionDataGraph($supervisionType: SupervisionGraphType!, $params: GeoLocSearchParams!
    $beginDate: Date,
    $endDate: Date){
      supervisionDataGraph(
        supervisionType: $supervisionType,
        params: $params,
        beginDate: $beginDate,
        endDate: $endDate
      ) {
        date
        upload
        download
        numberRequests
        numberTraffSims
        numberRequestsOpening
      }
    }`;

  const response = await query(queryStr, filters);

  if (response.data) {
    return response.data.supervisionDataGraph;
  }
}

export async function fetchSupervisionGraphSMS(filters) {
  const queryStr = `query SupervisionSmsGraph($supervisionType: SupervisionGraphType!, $params: GeoLocSearchParams!
    $beginDate: Date,
    $endDate: Date){
      supervisionSmsGraph(
        supervisionType: $supervisionType,
        params: $params,
        beginDate: $beginDate,
        endDate: $endDate
      ) {
        date
        numberOfSentSMS
        numberOfReceivedSMS
        numberOfTraffSims
      }
    }`;

  const response = await query(queryStr, filters);

  if (response.data) {
    return response.data.supervisionSmsGraph;
  }
}

export async function fetchSupervisionGraphVoice(filters) {
  const queryStr = `query SupervisionVoiceGraph($supervisionType: SupervisionGraphType!, $params: GeoLocSearchParams!
    $beginDate: Date,
    $endDate: Date){
      supervisionVoiceGraph(
        supervisionType: $supervisionType,
        params: $params,
        beginDate: $beginDate,
        endDate: $endDate
      ) {
        date
        volumeIn
        volumeOut
        numberCallsIn
        numberCallsOut
        numberTraffSims
      }
    }`;

  const response = await query(queryStr, filters);

  if (response.data) {
    return response.data.supervisionVoiceGraph;
  }
}
