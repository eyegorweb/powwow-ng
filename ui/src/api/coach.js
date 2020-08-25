import { query } from './utils';

export async function startAnalysis(accessPointId) {
  const queryStr = `
  mutation{
    coachAnalysis(filter: {type:AP_ID value:"${accessPointId}"}){
      id
      simcardTrafficAllowedTest
      dataTrafficAllowedTest
      simcardAlreadyConnectedTest
      simcardAlreadyConnectedTestWarnFlag
      alreadyAssignedIPAdressTest
      alreadyAssignedIPAdressTestWarnFlag
      devicePoweredTest
      devicePoweredTestWarnFlag
      devicePoweredLastDate
      localisation
      lastNetworkDetectionTest
      lastUsageInformation
      smsConsumption
      voiceConsumption
      dataConsumption
      updateDate
      linesLocalityTest
      linesCellTest
      deviceImei
      deviceReference
      deviceManufacturer
    }
  }
  `;

  const response = await query(queryStr);

  if (response && response.data) {
    return response.data.coachAnalysis;
  }

  return undefined;
}

export async function findCoach(accessPointId) {
  const queryStr = `
  query{
    findCoach(accessPointId: ${accessPointId}){
      id
      simcardTrafficAllowedTest
      dataTrafficAllowedTest
      simcardAlreadyConnectedTest
      simcardAlreadyConnectedTestWarnFlag
      alreadyAssignedIPAdressTest
      alreadyAssignedIPAdressTestWarnFlag
      devicePoweredTest
      devicePoweredTestWarnFlag
      devicePoweredLastDate
      localisation
      lastNetworkDetectionTest
      lastUsageInformation
      smsConsumption
      voiceConsumption
      dataConsumption
      updateDate
      linesLocalityTest
      linesCellTest
      deviceImei
      deviceReference
      deviceManufacturer
    }
  }
  `;

  const response = await query(queryStr);

  if (response && response.data) {
    return response.data.findCoach;
  }

  return undefined;
}
