import { query } from './utils';
import get from 'lodash.get';

export async function alarmOnChangeISP(params) {
  const gqlParams = getFormGQLParams(params);
  gqlParams.push(`plmnList:[${params.formData.map(p => `"${p.id}"`).join(',')}]`);

  console.log(params);

  const queryStr = `mutation {
    createPLMNChangeAlarm(
      filter: {${getScopeGQLParams(params)}},
      alarmCreationInput: {${gqlParams.join(',')}}
    ) {
      tempDataUuid
      validated
      errors{
        key
        number
      }
    }
  }`;

  const response = await query(queryStr);

  if (response.data) {
    return response.data.createPLMNChangeAlarm;
  }
  return { errors: response.errors };
}

export async function alarmOnDeviceChange(params) {
  const gqlParams = getFormGQLParams(params);

  const queryStr = `
  mutation {
    createDeviceChangeAlarm(
      filter: {${getScopeGQLParams(params)}},
      alarmCreationInput: {${gqlParams.join(',')}}
      ) {
        tempDataUuid
        validated
        errors{
          key
          number
        }
    }
  }
  `;

  const response = await query(queryStr);

  if (response.data) {
    return response.data.createDeviceChangeAlarm;
  }
  return { errors: response.errors };
}

export async function alarmOnOverConso(params) {
  const response = await consoQuery('createOverConsumptionAlarm', params);

  if (response.data) {
    return response.data.createOverConsumptionAlarm;
  }
  return { errors: response.errors };
}

export async function alarmOnUnderConso(params) {
  const response = consoQuery('createUnderConsumptionAlarm', params);
  if (response.data) {
    return response.data.createUnderConsumptionAlarm;
  }
  return { errors: response.errors };
}

async function consoQuery(queryName, params) {
  const gqlParams = getFormGQLParams(params);

  const alarmLevels = [];

  if (params.formData) {
    if (params.formData.dataES) {
      alarmLevels.push(`level1: ${params.formData.dataES}`);
    }
    if (params.formData.dataOut) {
      alarmLevels.push(`level1Up: ${params.formData.dataOut}`);
    }
    if (params.formData.dataIn) {
      alarmLevels.push(`level1Down: ${params.formData.dataIn}`);
    }
    if (params.formData.smsES) {
      alarmLevels.push(`level2: ${params.formData.smsES}`);
    }
    if (params.formData.smsIn) {
      alarmLevels.push(`level2Down: ${params.formData.smsIn}`);
    }
    if (params.formData.smsOut) {
      alarmLevels.push(`level2Up: ${params.formData.smsOut}`);
    }
    if (params.formData.voiceES) {
      alarmLevels.push(`level3: ${params.formData.voiceES}`);
    }
    if (params.formData.voiceIn) {
      alarmLevels.push(`level3Down: ${params.formData.voiceIn}`);
    }
    if (params.formData.VoiceOut) {
      alarmLevels.push(`level3Up: ${params.formData.VoiceOut}`);
    }
    alarmLevels.push(`observationCycle: ${params.formData.period}`);
  }

  gqlParams.push(`alarmLevels: {${alarmLevels.join(',')}}`);

  const queryStr = `
  mutation {
    ${queryName}(
      filter: {${getScopeGQLParams(params)}},
      alarmCreationInput: {${gqlParams.join(',')}}
      ) {
        tempDataUuid
        validated
        errors{
          key
          number
        }
    }
  }
  `;

  return await query(queryStr);
}

function getFormGQLParams(params) {
  const gqlParams = [];

  gqlParams.push(`alarmScope:${getScope(params)}`);
  gqlParams.push(`alarmName:"${params.alarmName}"`);
  gqlParams.push(`activateAlarm:${params.enableAlarm}`);
  gqlParams.push(`emailNotification:${params.sholdNotify}`);
  gqlParams.push(`webServiceNotification:${params.webserviceNotification}`);
  if (params.sholdNotify) {
    gqlParams.push(`mailingList:${params.notifList}`);
  }

  return gqlParams;
}

function getScope(params) {
  if (!params.scope) return;

  if (params.scope.partner && params.scope.partner.id) {
    return 'PARTY';
  }

  const searchById = get(params, 'scope.searchById.type');

  if (searchById) {
    return 'LINE';
  }

  const offer = get(params, 'scope.offer.id');

  if (offer) {
    return 'OFFER';
  }
}

function getScopeGQLParams(params) {
  if (!params.scope) return '';

  if (params.scope.partner && params.scope.partner.id) {
    return `idParty: {eq: ${params.scope.partner.id}}`;
  }

  const searchById = get(params, 'scope.searchById');

  if (searchById) {
    return `${searchById.type}: {eq: "${searchById.value}"}`;
  }

  const offer = get(params, 'scope.offer.id');
  const billingAccount = get(params, 'scope.billingAccount.value');

  if (offer) {
    const offerGqlParams = [`idParty: {eq: ${params.scope.partnerId}}`];

    offerGqlParams.push(`relatedOffers: {eq: "${offer}"}`);

    if (billingAccount) {
      offerGqlParams.push(`idCF: {eq: ${billingAccount}}`);
    }

    return offerGqlParams.join(',');
  }

  const tempDataUuid = get(params, 'scope.searchByFile.tempDataUuid');

  if (tempDataUuid) {
    return `tempDataUuid: {eq: ${tempDataUuid}}`;
  }
}
