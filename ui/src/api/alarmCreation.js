import { query } from './utils';
import get from 'lodash.get';
import { getSharedAlarmParamsFormatted } from './alarms';

export async function alarmOnChangeISP(params) {
  const gqlParams = getFormGQLParams(params);
  gqlParams.push(`plmnList:[${params.formData.map((p) => `"${p.id}"`).join(',')}]`);

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
  gqlParams.push(`countryIsoCodes:[${params.formData.map((p) => `"${p.id}"`).join(',')}]`);

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

  if (response.errors) {
    return { errors: response.errors };
  }
  return response.data.createStatusChangeAlarm;
}

export async function createStatusChangeProfileAlarm(params) {
  const gqlParams = getFormGQLParams(params);

  gqlParams.push(`statusChangeProfile: ${params.formData}`);

  const queryStr = `
  mutation {
    createStatusChangeProfileAlarm(
      filter: {${getScopeGQLParams(params)}},
      alarmCreationInput: {${gqlParams.join(',')}}
      )
      {
        tempDataUuid
        validated
        errors {
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

  return response.data.createStatusChangeProfileAlarm;
}

export async function createSharedConsumptionAlarm(params) {
  const queryStr = `mutation CreateSharedConsumptionAlarm($offerAlarmCreationInput: OfferAlarmCreationInput!){
    createSharedConsumptionAlarm(offerAlarmCreationInput: $offerAlarmCreationInput)
  }`;

  // remplacer 'endOfMonth' with null
  params = await getSharedAlarmParamsFormatted(params);
  const response = await query(queryStr, {
    offerAlarmCreationInput: params,
  });

  if (response.errors) {
    return { errors: response.errors };
  }

  return response.data.createSharedConsumptionAlarm;
}

export async function createInactivityAlarm(params) {
  const gqlParams = getFormGQLParams(params);

  if (get(params, 'formData.dataNoSession')) {
    gqlParams.push(`dataNoSession:${get(params, 'formData.dataNoSession')}`);
  }
  if (get(params, 'formData.dataInactiveSession')) {
    gqlParams.push(`dataInactiveSession:${get(params, 'formData.dataInactiveSession')}`);
  }

  const queryStr = `
  mutation {
    createInactivityAlarm(
      filter: {${getScopeGQLParams(params)}},
      alarmCreationInput: {${gqlParams.join(',')}}
      )
      {
        tempDataUuid
        validated
        errors {
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

  return response.data.createInactivityAlarm;
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
  function moToOctet(value) {
    return value * 1024 * 1024;
  }

  function secToMin(value) {
    return value * 60;
  }

  if (params.formData) {
    if (params.formData.dataES) {
      alarmLevels.push(`level1: ${moToOctet(params.formData.dataES)}`);
    }
    if (params.formData.dataOut) {
      alarmLevels.push(`level1Up: ${moToOctet(params.formData.dataOut)}`);
    }
    if (params.formData.dataIn) {
      alarmLevels.push(`level1Down: ${moToOctet(params.formData.dataIn)}`);
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
      alarmLevels.push(`level3: ${secToMin(params.formData.voiceES)}`);
    }
    if (params.formData.voiceIn) {
      alarmLevels.push(`level3Down: ${secToMin(params.formData.voiceIn)}`);
    }
    if (params.formData.voiceOut) {
      alarmLevels.push(`level3Up: ${secToMin(params.formData.voiceOut)}`);
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

  if (get(params, 'scope.offer.meta.id')) {
    gqlParams.push(`workflowId:${get(params, 'scope.offer.meta.id')}`);
  }
  if (get(params, 'scope.billingAccount.data.id')) {
    gqlParams.push(`customerAccountId:${get(params, 'scope.billingAccount.data.id')}`);
  }
  if (get(params, 'streamId')) {
    gqlParams.push(`streamId:${get(params, 'streamId')}`);
  }

  return gqlParams;
}

function getScope(params) {
  if (!params.scope) return;

  const searchById =
    get(params, 'scope.searchById.type') || get(params, 'scope.searchByFile.tempDataUuid');

  if (searchById) {
    return 'LINE';
  }

  if (params.scope.partner && params.scope.partner.id) {
    return 'PARTY';
  }

  const offer = get(params, 'scope.offer.id');
  const billingAccount = get(params, 'scope.billingAccount.id');

  if (offer || billingAccount) {
    return 'OFFER';
  }
}

function getScopeGQLParams(params) {
  const tempDataUuid = get(params, 'scope.searchByFile.tempDataUuid');
  const searchById = get(params, 'scope.searchById');

  if (!params.scope) return '';
  if (params.scope.partner && params.scope.partner.id && tempDataUuid) {
    return `idParty: {eq: ${params.scope.partner.id}}, tempDataUuid: "${tempDataUuid}"`;
  }

  if (params.scope.partner && params.scope.partner.id && !searchById) {
    return `idParty: {eq: ${params.scope.partner.id}}`;
  }

  if (params.scope.partner && params.scope.partner.id && searchById) {
    const searchByIdGqlParams = [`idParty: {eq: ${params.scope.partner.id}}`];

    searchByIdGqlParams.push(`${searchById.type}: {eq: "${searchById.value}"}`);
    return searchByIdGqlParams.join(',');
  }

  const offer = get(params, 'scope.offer.id');
  const billingAccount = get(params, 'scope.billingAccount.id');

  if (offer && billingAccount) {
    const offerGqlParams = [`idParty: {eq: ${params.scope.partnerId}}`];
    offerGqlParams.push(`relatedOffers: {eq: "${offer}"}`);
    offerGqlParams.push(`idCF: {eq: ${billingAccount}}`);
    return offerGqlParams.join(',');
  }

  if (offer) {
    const offerGqlParams = [`idParty: {eq: ${params.scope.partnerId}}`];
    offerGqlParams.push(`relatedOffers: {eq: "${offer}"}`);

    return offerGqlParams.join(',');
  }

  if (billingAccount) {
    const offerGqlParams = [`idParty: {eq: ${params.scope.partnerId}}`];
    offerGqlParams.push(`idCF: {eq: ${billingAccount}}`);
    return offerGqlParams.join(',');
  }

  if (tempDataUuid) {
    return `tempDataUuid: "${tempDataUuid}"`;
  }
}
