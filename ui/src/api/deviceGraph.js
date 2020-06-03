import { query } from './utils';

export async function lineDistributionByManufacturer(partnerIds = []) {
  if (!partnerIds) return;

  const queryStr = `query {lineDistributionByManufacturer(initialPartyIds:[${partnerIds.join(
    ', '
  )}]) {
    label
    accessPointNumber
  }
  }
    }}
  `;
  const response = await query(queryStr);
  return response.data.lineDistributionByManufacturer;
}

export async function lineDistributionByDeviceReference(partnerIds = []) {
  if (!partnerIds) return;

  const queryStr = `query {

    query {lineDistributionByDeviceReference(initialPartyIds:[${partnerIds.join(', ')}]) {
      label
      accessPointNumber
    }}
  `;
  const response = await query(queryStr);
  console.log(queryStr);
  return response.data.lineDistributionByDeviceReference;
}

export async function lineDistributionByTechno(partnerIds = []) {
  if (!partnerIds) return;
  const queryStr = `query {

    query {lineDistributionByTechno(initialPartyIds:[${partnerIds.join(', ')}]) {
      label
      accessPointNumber
    }}
  `;
  const response = await query(queryStr);
  return response.data.lineDistributionByTechno;
}
