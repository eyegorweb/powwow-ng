import { query } from './utils';

export async function fetchPLMNDistribution(partnerId, workflowCode, customerAccountId) {
  const params = [];

  params.push(`partnerId:${partnerId}`);
  if (workflowCode) {
    params.push(`workflowCode:"${workflowCode}"`);
  }

  if (customerAccountId) {
    params.push(`customerAccountId:${customerAccountId}`);
  }
  const queryStr = `query {
    doughnutPlmnFrDistribution(filter: {${params.join(',')}}) {
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

export async function countryLinesDistribution(partnerId, workflowCode, customerAccountId) {
  const params = [];

  params.push(`partnerId:${partnerId}`);
  if (workflowCode) {
    params.push(`workflowCode:"${workflowCode}"`);
  }

  if (customerAccountId) {
    params.push(`customerAccountId:${customerAccountId}`);
  }
  const queryStr = `query {
    countryLinesDistribution(
      filter: {${params.join(',')}}
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

export async function doughnutAreaDistribution(partnerId, workflowCode, customerAccountId) {
  const params = [];

  params.push(`partnerId:${partnerId}`);
  if (workflowCode) {
    params.push(`workflowCode:"${workflowCode}"`);
  }

  if (customerAccountId) {
    params.push(`customerAccountId:${customerAccountId}`);
  }
  const queryStr = `query {
    doughnutAreaDistribution(filter: {${params.join(',')}}) {
      areaLabel
      accessPointNumber
      percentage
    }
  }
  `;
  const response = await query(queryStr);
  return response.data.doughnutAreaDistribution;
}

export async function getDoughnutOfferDistributionInfo(partnerId, workflowCode, customerAccountId) {
  const params = [];

  params.push(`partnerId:${partnerId}`);
  if (workflowCode) {
    params.push(`workflowCode:"${workflowCode}"`);
  }

  if (customerAccountId) {
    params.push(`customerAccountId:${customerAccountId}`);
  }

  const queryStr = `query {

    getDoughnutOfferDistributionInfo(filter:{${params.join(',')}}){
      offer
      accessPointNumber
      percentage
    }
    }
  `;
  const response = await query(queryStr);
  return response.data.getDoughnutOfferDistributionInfo;
}
