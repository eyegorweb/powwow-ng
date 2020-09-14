import { query } from './utils';

export async function parcStatusByMonth(partnerId, customerAccountCode, period) {
  let customerAccountParam = '';

  if (customerAccountCode) {
    customerAccountParam = `, customerAccountCode: "${customerAccountCode}"`;
  }
  const queryStr = `
  {
    parcStatusByMonth(filter: {partnerId: ${partnerId}, period: ${period}${customerAccountParam}}) {
      countStock
      countPreactivated
      countActivated
      countCancellationInProgress
      countTest
      countReleased
      countSuspended
      date
    }
  }
  `;
  const response = await query(queryStr);
  if (response.data) return response.data.parcStatusByMonth;
}

export async function billedAmountByZone(partnerId, customerAccountCode, period) {
  let customerAccountParam = '';

  if (customerAccountCode) {
    customerAccountParam = `, customerAccountCode: "${customerAccountCode}"`;
  }
  const queryStr = `
  {
    billedAmountAndConsoByZoneGraph(filter: {partnerId: ${partnerId}, period: ${period}${customerAccountParam}}) {
      date
      depassement
      forfait
      horsForfait
      data
      voice
      sms
      abonnement
    }
  }
  `;
  const response = await query(queryStr);
  if (response.data) return response.data.billedAmountAndConsoByZoneGraph;
}

export async function billedLineAndAmount(partnerId, customerAccountCode, period) {
  let customerAccountParam = '';

  if (customerAccountCode) {
    customerAccountParam = `, customerAccountCode: "${customerAccountCode}"`;
  }
  const queryStr = `
  {
    billedLinesAndAmount(filter: {partnerId: ${partnerId}, period: ${period}${customerAccountParam}}) {
      date
      billedLines
      totalAmount
      abonnement
      depassement
      dataHorsZone
      smsHorsZone
      voixHorsZone
      dataConsoTest
      smsConsoTest
      voixConsoTest
      dataConsoCompteur
      smsConsoCompteur
      voixConsoCompteur
      palierAmount
    }
  }
  `;
  const response = await query(queryStr);
  if (response.data) return response.data.billedLinesAndAmount;
}

export async function billedLineConsoZone(partnerId, customerAccountCode, period) {
  let customerAccountParam = '';

  if (customerAccountCode) {
    customerAccountParam = `, customerAccountCode: "${customerAccountCode}"`;
  }
  const queryStr = `
  {
    billedLineAndConsoByZoneGraph(filter: {partnerId: ${partnerId}, period: ${period}${customerAccountParam}}) {
      date
      dataConsoFr
      dataConsoEU
      dataConsoHorsEU
      smsConsoFr
      smsConsoEU
      smsConsoHorsEU
      voixConsoFr
      voixConsoEU
      voixConsoHorsEU
      nbBilledLine
    }
  }
  `;
  const response = await query(queryStr);
  if (response.data) return response.data.billedLineAndConsoByZoneGraph;
}

export async function billedLinesByStep(partnerId, customerAccountCode, period) {
  let customerAccountParam = '';

  if (customerAccountCode) {
    customerAccountParam = `, customerAccountCode: "${customerAccountCode}"`;
  }
  const queryStr = `
  {
    billedLinesByStep(filter: {partnerId: ${partnerId}, period: ${period}${customerAccountParam}}) {
      date
      palierValues {
        palier
        billedLine
      }
    }
  }
  `;
  const response = await query(queryStr);
  if (response.data) return response.data.billedLinesByStep;
}

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

export async function billedAmountByMonth(partnerId, customerAccountCode, period) {
  const params = [];
  if (customerAccountCode) {
    params.push(`customerAccountCode: "${customerAccountCode}",`);
  }

  const queryStr = `
  {
    billingAmountGraph(filter: {partnerId: ${partnerId}, ${params.join(',')} period: ${period}}) {
      date
      amount
      nbBilledLines
      nbNotBilledLines
    }
  }
  `;
  const response = await query(queryStr);
  if (response.data) return response.data.billingAmountGraph;
}

export async function averageBilledAmountByMonth(partnerId, customerAccountCode, period, usage) {
  const params = [];
  if (customerAccountCode) {
    params.push(`customerAccountCode: "${customerAccountCode}",`);
  }

  const queryStr = `
  query {
    averageBillingGraph(filter:{partnerId: ${partnerId}, ${params.join(
    ','
  )} period: ${period}, usage: ${usage} }) {
     date
     amount
     conso
   }
   }
   `;
  const response = await query(queryStr);
  if (response.data) return response.data.averageBillingGraph;
}

// billedAmountAndConsoByZoneGraph api
// query {
//   billedAmountAndConsoByZoneGraph(filter:{partnerId:2 period:MONTH24 }) {
//    date
//    depassement
//    forfait
//    horsForfait
//    data
//    voice
//    sms
//    abonnement

//  }
//  }
