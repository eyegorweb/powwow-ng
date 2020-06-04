import { query } from './utils';

export async function lineDistributionByManufacturer(partnerIds = []) {
  const queryStr = `query {lineDistributionByManufacturer(initialPartyIds:[${partnerIds.join(
    ','
  )}]) {
    label
    accessPointNumber
  }
  }
  `;

  const response = await query(queryStr);
  return response.data.lineDistributionByManufacturer;
}

export async function lineDistributionByDeviceReference(partnerIds = []) {
  const queryStr = `query {lineDistributionByDeviceReference(initialPartyIds:[${partnerIds.join(
    ','
  )}]) {
    label
    accessPointNumber
  }
  }
  `;

  const response = await query(queryStr);
  return response.data.lineDistributionByDeviceReference;
}

export async function lineDistributionByTechno(partnerIds = []) {
  const queryStr = `query {lineDistributionByTechno(initialPartyIds:[${partnerIds.join(',')}]) {
    label
    accessPointNumber
  }
  }
  `;

  const response = await query(queryStr);
  return response.data.lineDistributionByTechno;
}
