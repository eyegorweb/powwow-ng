import { query } from './utils';

export async function fetchDistributionInfo() {
  const queryStr = `query {
    doughnutPlmnFrDistribution(filter: {
      partnerId: 2
    }) {
      plmn
      operator
      accessPointNumber
      percentage
    }
  }
  `;
  const response = await query(queryStr);
  return response.data.doughnutPlmnFrDistribution;
}
