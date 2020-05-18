import { query } from './utils';

export async function fetchDistributionInfo(partnerId) {
  const queryStr = `query {
    doughnutPlmnFrDistribution(filter: {
      partnerId: ${partnerId}
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
