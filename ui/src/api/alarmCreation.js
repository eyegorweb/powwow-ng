import { query } from './utils';
import get from 'lodash.get';

export async function alarmOnChangeISP(params) {
  const gqlParams = getFormGQLParams(params);
  gqlParams.push(`plmnList:[${params.formData.map(p => `"${p.id}"`).join(',')}]`);

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

  if (response.errors) {
    return { errors: response.errors };
  }

  return response.data.createPLMNChangeAlarm;
}

export async function alarmOnChangeCountry(params) {
  const gqlParams = getFormGQLParams(params);
  gqlParams.push(`countryIsoCodes:[${params.formData.map(p => `"${p.id}"`).join(',')}]`);

  const queryStr = `mutation {
    createCountryChangeAlarm(
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

  if (response.errors) {
    return { errors: response.errors };
  }

  return response.data.createCountryChangeAlarm;
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

  if (response.errors) {
    return { errors: response.errors };
  }

  return response.data.createDeviceChangeAlarm;
}

export async function createStatusChangeAlarm(params) {
  const gqlParams = getFormGQLParams(params);

  gqlParams.push(`status: ${params.formData}`);

  const queryStr = `
  mutation {
    createStatusChangeAlarm(
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
    return response.data.createStatusChangeAlarm;
  }
  return { errors: response.errors };
}

export async function createSharedConsumptionAlarm(params) {
  const queryStr = `mutation CreateSharedConsumptionAlarm($offerAlarmCreationInput: OfferAlarmCreationInput!){
    createSharedConsumptionAlarm(offerAlarmCreationInput: $offerAlarmCreationInput)
  }`;

  const response = await query(queryStr, {
    offerAlarmCreationInput: params,
  });

  if (response.data) {
    return response.data.createSharedConsumptionAlarm;
  }
  return { errors: response.errors };
}

export async function alarmOnOverConso(params) {
  const response = await consoQuery('createOverConsumptionAlarm', params);

  if (response.errors) {
    return { errors: response.errors };
  }

  return response.data.createOverConsumptionAlarm;
}

export async function alarmOnUnderConso(params) {
  const response = await consoQuery('createUnderConsumptionAlarm', params);

  if (response.errors) {
    return { errors: response.errors };
  }

  return response.data.createUnderConsumptionAlarm;
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

    if (params.formData.period === 'CUSTOM') {
      alarmLevels.push(`observationDelay: ${params.formData.customPeriodValue}`);
    }
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
  if (params.enableSuspension) {
    gqlParams.push(`suspensionAuto: ${params.enableSuspension}`);
  }
  if (params.enableReactivation) {
    gqlParams.push(`reactivationAuto: ${params.enableReactivation}`);
  }
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

  const searchById =
    get(params, 'scope.searchById.type') || get(params, 'scope.searchByFile.tempDataUuid');

  if (searchById) {
    return 'LINE';
  }

  const offer = get(params, 'scope.offer.id');

  if (offer) {
    return 'OFFER';
  }
}

function getScopeGQLParams(params) {
  const tempDataUuid = get(params, 'scope.searchByFile.tempDataUuid');
  if (!params.scope) return '';

  if (params.scope.partner && params.scope.partner.id && tempDataUuid) {
    return `idParty: {eq: ${params.scope.partner.id}}, tempDataUuid: "${tempDataUuid}"`;
  }

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

  if (tempDataUuid) {
    return `tempDataUuid: "${tempDataUuid}"`;
  }
}
