import { query } from './utils';

export async function updateCountryChangeAlarm(params) {
  const gqlParams = getGqlParams(params);

  gqlParams.push(`countryIsoCodes:[${params.formData.map((p) => `"${p.id}"`).join(',')}]`);

  const queryStr = `
  mutation {
    updateCountryChangeAlarm(alarmUpdateInput:{${gqlParams.join(',')}}) {
      id
    }
  }
  `;

  const response = await query(queryStr);

  if (response.errors) {
    return { errors: response.errors };
  }

  return response.data.updateCountryChangeAlarm;
}

export async function updateDeviceChangeAlarm(params) {
  const gqlParams = getGqlParams(params);

  const queryStr = `
  mutation {
    updateDeviceChangeAlarm(alarmUpdateInput:{${gqlParams.join(',')}}) {
      id
    }
  }
  `;

  const response = await query(queryStr);

  if (response.errors) {
    return { errors: response.errors };
  }

  return response.data.updateDeviceChangeAlarm;
}

export async function updateStatusChangeAlarm(params) {
  const gqlParams = getGqlParams(params);

  gqlParams.push(`status: ${params.formData}`);

  const queryStr = `
  mutation {
    updateStatusChangeAlarm(alarmUpdateInput:{${gqlParams.join(',')}}) {
      id
    }
  }
  `;

  const response = await query(queryStr);

  if (response.errors) {
    return { errors: response.errors };
  }

  return response.data.updateStatusChangeAlarm;
}

export async function updateISPList(params) {
  const gqlParams = getGqlParams(params);

  gqlParams.push(`plmnList:[${params.formData.map((p) => `"${p.id}"`).join(',')}]`);

  const queryStr = `
  mutation {
    updatePLMNChangeAlarm(alarmUpdateInput:{${gqlParams.join(',')}}) {
      id
    }
  }
  `;

  const response = await query(queryStr);

  if (response.errors) {
    return { errors: response.errors };
  }

  return response.data.updatePLMNChangeAlarm;
}

export async function modifyOverConso(params) {
  const response = await consoQuery('updateOverConsumptionAlarm', params);

  if (response.errors) {
    return { errors: response.errors };
  }

  return response.data.updateOverConsumptionAlarm;
}

export async function modifyUnderConso(params) {
  const response = await consoQuery('updateUnderConsumptionAlarm', params);

  if (response.errors) {
    return { errors: response.errors };
  }

  return response.data.updateUnderConsumptionAlarm;
}

async function consoQuery(queryName, params) {
  const gqlParams = getGqlParams(params);

  console.log(params);
  addLevels(params, gqlParams);

  const queryStr = `
  mutation {
    ${queryName}(alarmUpdateInput:{${gqlParams.join(',')}}) {
      id
    }
  }
  `;

  return await query(queryStr);
}

export async function updateSharedConsumptionAlarm(params) {
  const gqlParams = getSharedAlarmGqlParams(params);

  const queryStr = `
  mutation {
    updateSharedConsumptionAlarm(updateSharedAlarmFilterInput:{${gqlParams.join(',')}}) {
      id
    }
  }
  `;

  const response = await query(queryStr);

  if (response.errors) {
    return { errors: response.errors };
  }

  return response.data.updateSharedConsumptionAlarm;
}

function addLevels(params, gqlParams) {
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
    if (params.formData.VoiceOut) {
      alarmLevels.push(`level3Up: ${secToMin(params.formData.VoiceOut)}`);
    }
    alarmLevels.push(`observationCycle: ${params.formData.period}`);

    if (params.formData.period === 'CUSTOM') {
      alarmLevels.push(`observationDelay: ${params.formData.customPeriodValue}`);
    }
  }

  gqlParams.push(`alarmLevels: {${alarmLevels.join(',')}}`);
}
function getGqlParams(params) {
  const gqlParams = [];

  gqlParams.push(`alarmId:${params.id}`);
  gqlParams.push(`alarmName:"${params.alarmName}"`);
  // gqlParams.push(`activateAlarm:${params.enableAlarm}`);
  gqlParams.push(`emailNotification:${params.sholdNotify}`);
  gqlParams.push(`webServiceNotification:${params.webserviceNotification}`);
  gqlParams.push(`suspensionAuto: ${params.enableSuspension}`);
  gqlParams.push(`reactivationAuto: ${params.enableReactivation}`);

  if (params.sholdNotify) {
    gqlParams.push(`mailingList:${params.notifList}`);
  }

  return gqlParams;
}

function getSharedAlarmGqlParams(params) {
  const gqlParams = [];
  const levelsData = [];
  const levelsSms = [];
  const levelsVoice = [];
  console.log(params)
  gqlParams.push(`sharedAlarmId:${params.sharedAlarmId}`);
  gqlParams.push(`alarmName:"${params.alarmName}"`);
  gqlParams.push(`mailNotification:${params.emailNotification}`);
  gqlParams.push(`activateAlarm:${params.activateAlarm}`);

  if (params.levelsData) {
    if (params.levelsData.levelMax) {
      levelsData.push(`levelMax: {
        level: ${params.levelsData.levelMax.level}
        }`);
    }
    if (params.levelsData.level1) {
      levelsData.push(`level1: {
        level: ${params.levelsData.level1.level},
        dayOfMonth: ${params.levelsData.level1.dayOfMonth}
        }`);
    }
    if (params.levelsData.level2) {
      levelsData.push(`level2: {
        level: ${params.levelsData.level2.level},
        dayOfMonth: ${params.levelsData.level2.dayOfMonth}
        }`);
    }
    gqlParams.push(`levelsData: {${levelsData.join(',')}}`);
  }

  if (params.levelsSms) {
    if (params.levelsSms.levelMax) {
      levelsSms.push(`levelMax: {
        level: ${params.levelsSms.levelMax.level}
        }`);
    }
    if (params.levelsSms.level1) {
      levelsSms.push(`level1: {
          level: ${params.levelsSms.level1.level},
          dayOfMonth: ${params.levelsSms.level1.dayOfMonth}
        }`);
    }
    if (params.levelsSms.level2) {
      levelsSms.push(`level2: {
          level: ${params.levelsSms.level2.level},
          dayOfMonth: ${params.levelsSms.level2.dayOfMonth}
        }`);
    }
    gqlParams.push(`levelsSms: {${levelsSms.join(',')}}`);
  }

  if (params.levelsVoice) {
    if (params.levelsVoice.levelMax) {
      levelsVoice.push(`levelMax: {
          level: ${params.levelsVoice.levelMax.level}
        }`);
    }
    if (params.levelsVoice.level1) {
      levelsVoice.push(`level1: {
          level: ${params.levelsVoice.level1.level},
          dayOfMonth: ${params.levelsVoice.level1.dayOfMonth}
        }`);
    }
    if (params.levelsVoice.level2) {
      levelsVoice.push(`level2: {
          level: ${params.levelsVoice.level2.level},
          dayOfMonth: ${params.levelsVoice.level2.dayOfMonth}
        }`);
    }
    gqlParams.push(`levelsVoice: {${levelsVoice.join(',')}}`);
  }

  return gqlParams;
}
