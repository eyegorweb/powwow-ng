import { query } from './utils';

const coachFields = `id
simcardTrafficAllowedTest
simcardTrafficAllowedTestSuccess
dataTrafficAllowedTest
dataTrafficAllowedTestSuccess
simcardAlreadyConnectedTest
simcardAlreadyConnectedTestSuccess
simcardAlreadyConnectedTestWarnFlag
alreadyAssignedIPAdressTest
alreadyAssignedIPAdressTestSuccess
alreadyAssignedIPAdressTestWarnFlag
devicePoweredTest
devicePoweredTestSuccess
devicePoweredTestWarnFlag
devicePoweredLastDate
localisation
localisationSuccess
lastNetworkDetectionTest
lastNetworkDetectionTestSuccess
lastUsageInformation
lastUsageInformationSuccess
smsConsumption
voiceConsumption
dataConsumption
updateDate
linesLocalityTest
linesLocalityTestSuccess
linesCellTest
linesCellTestSuccess
deviceImei
deviceReference
deviceManufacturer`;

export async function startAnalysis(accessPointId) {
  const queryStr = `
  mutation{
    coachAnalysis(filter: {type:AP_ID value:"${accessPointId}"}){
      ${coachFields}
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
      ${coachFields}
    }
  }
  `;

  const response = await query(queryStr);

  if (response && response.data) {
    return response.data.findCoach;
  }

  return undefined;
}
