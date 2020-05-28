import { query } from './utils';

export async function globalActifParc(filters = {}) {
  return geoCounter({
    filter: {
      counter: 'COUNTER1',
      usageType: 'ALL',
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

export async function fetchContinentData(usageType) {
  return geoMap({
    filter: {
      scale: 'CONTINENT',
      usageType,
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

export async function fetchDataForCells(iso3CountryCode, usageType, bounds) {
  return geoMap({
    filter: {
      scale: 'CELL',
      iso3CountryCode,
      usageType,
      ...bounds,
    },
  });
}

export async function fetchDataForCities(iso3CountryCode, usageType, bounds) {
  return geoMap({
    filter: {
      scale: 'CITY',
      iso3CountryCode,
      usageType,
      ...bounds,
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
