import { query } from './utils';

export async function globalActifParc(filters = {}) {
  return geoCounter({
    filter: {
      counter: 'COUNTER1',
      usageType: 'ALL',
      ...filters
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
