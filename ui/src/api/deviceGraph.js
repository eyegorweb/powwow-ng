import { query } from './utils';

export async function lineDistributionByManufacturer(partnerIds = []) {
  let queryStr;
  if (partnerIds === undefined) {
    queryStr = `query {lineDistributionByManufacturer(initialPartyIds:[]) {
      label
      accessPointNumber
    }
    }
    `;
  } else {
    queryStr = `query {lineDistributionByManufacturer(initialPartyIds:[${partnerIds.join(' ')}]) {
      label
      accessPointNumber
    }
    }
    `;
  }
  const response = await query(queryStr);
  return response.data.lineDistributionByManufacturer;
}

export async function lineDistributionByDeviceReference(partnerIds = []) {
  let queryStr;
  if (partnerIds === undefined) {
    queryStr = `query {lineDistributionByDeviceReference(initialPartyIds:[]) {
      label
      accessPointNumber
    }
    }
    `;
  } else {
    queryStr = `query {lineDistributionByDeviceReference(initialPartyIds:[${partnerIds.join(
      ' '
    )}]) {
      label
      accessPointNumber
    }
    }
    `;
  }
  const response = await query(queryStr);
  return response.data.lineDistributionByDeviceReference;
}

export async function lineDistributionByTechno(partnerIds = []) {
  let queryStr;
  if (partnerIds === undefined) {
    queryStr = `query {lineDistributionByTechno(initialPartyIds:[]) {
      label
      accessPointNumber
    }
    }
    `;
  } else {
    queryStr = `query {lineDistributionByTechno(initialPartyIds:[${partnerIds.join(' ')}]) {
      label
      accessPointNumber
    }
    }
    `;
  }

  const response = await query(queryStr);

  return response.data.lineDistributionByTechno;
}
