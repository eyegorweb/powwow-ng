import { query } from './utils';

export async function fetchIndicators() {
  const response = await query(
    `
    query {
      ordersIndicators {
        averageProcessingTime
      }
    }
    `
  );
  return response.data.ordersIndicators;
}

export async function fetchPrecalculatedIndicators(keys, partners, partnerType) {
  let partnerGql = '';
  let partnerTypeGql = '';

  if (partners && partners.length) {
    partnerGql = `, partyIds: [${partners.join(',')}]`;
  }

  if (partnerType) {
    partnerTypeGql = `, partyType: ${partnerType}`;
  }

  const queryStr = `
  query{
    indicators(names: [${keys.join(',')}]${partnerGql}${partnerTypeGql}) {
      name
      stringValue
      dateValue
      updateDate
      updateRequestDate
      numberValue
    }
  }
  `;

  const response = await query(queryStr);
  if (response && response.data && response.data.indicators) {
    return response.data.indicators;
  }

  return undefined;
}
export async function fetchPrecalculatedTopIndicators(keys, partners, partnerType) {
  let partnerGql = '';
  let partnerTypeGql = '';

  if (partners && partners.length) {
    partnerGql = `, partyIds: [${partners.join(',')}]`;
  }

  if (partnerType) {
    partnerTypeGql = `, partyType: ${partnerType}`;
  }

  const queryStr = `
  query{
    topIndicators(names: [${keys.join(',')}]${partnerGql}${partnerTypeGql}, limit: 5) {
      name
      partyName
      numberValue
    }
  }
  `;

  const response = await query(queryStr);
  return response.data.topIndicators;
}

export async function fetchEntitiesIndicators(keys, partners, partnerType) {
  let partnerGql = '';
  let partnerTypeGql = '';

  if (partners && partners.length) {
    partnerGql = `, partyIds: [${partners.join(',')}]`;
  }

  if (partnerType) {
    partnerTypeGql = `, partyType: ${partnerType}`;
  }
  const queryStr = `
  query{
    topIndicatorsEntities(names: [${keys.join(',')}]${partnerGql}${partnerTypeGql}, limit:5 ) {
      name
      partyName
      numberValue
      stringValue
      updateDate
      updateRequestDate
      entityId
    }
   }
  `;
  const response = await query(queryStr);
  if (response.data) return response.data.topIndicatorsEntities;
}

export async function fetchBillingExchange(rubric, partnerType) {
  let partnerTypeGql = '';
  if (partnerType) {
    partnerTypeGql = `, partyType: ${partnerType}`;
  }
  const queryStr = `
  query{
    topBillingExchanges(rubricEnum: ${rubric}, depth: 2 ${partnerTypeGql}) {
        periode
        billingExchanges {
          partyId
          partyName
          amount
        }
    }
  }
  `;

  const response = await query(queryStr);
  // console.log('response', response);
  if (response.data) return response.data.topBillingExchanges;
}
