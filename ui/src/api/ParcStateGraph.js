import { query } from './utils';

export async function fetchDistributionInfo() {
  const queryStr = `query {

    getDoughnutOfferDistributionInfo(filter:{partnerId:2}){
      offer
      accessPointNumber
      percentage
    }
    }
  `;
  const response = await query(queryStr);
  return response.data.getDoughnutOfferDistributionInfo;
}
