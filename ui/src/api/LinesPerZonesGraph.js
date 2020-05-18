import { query } from './utils';

export async function fetchDistributionInfo() {
  const queryStr = `query {
    doughnutAreaDistribution(filter: {
      partnerId: 2
    }) {
      areaLabel
      accessPointNumber
      percentage
    }
  }
  `;
  const response = await query(queryStr);
  return response.data.doughnutAreaDistribution;
}
