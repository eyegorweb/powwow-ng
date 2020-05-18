import { query } from './utils';

export async function fetchDistributionInfo() {
  const queryStr = `query {
    countryLinesDistribution(
      filter: { partnerId: 2  }
    ) {
      accessPointNumber
      countryIsoCode3
      countryIsoCode2
      countryName
      percentage
    }
  }
  `;
  const response = await query(queryStr);
  return response.data.countryLinesDistribution;
}
