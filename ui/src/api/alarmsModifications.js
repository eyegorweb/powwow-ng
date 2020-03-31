import { query } from './utils';

export async function updateCountryChangeAlarm(params) {
  const gqlParams = getGqlParams(params);

  gqlParams.push(`countryIsoCodes:[${params.formData.map(p => `"${p.id}"`).join(',')}]`);

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

  gqlParams.push(`plmnList:[${params.formData.map(p => `"${p.id}"`).join(',')}]`);

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

function addLevels(params, gqlParams) {
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
}
function getGqlParams(params) {
  const gqlParams = [];

  gqlParams.push(`alarmId:${params.id}`);
  gqlParams.push(`alarmName:"${params.alarmName}"`);
  // gqlParams.push(`activateAlarm:${params.enableAlarm}`);
  gqlParams.push(`emailNotification:${params.sholdNotify}`);
  gqlParams.push(`webServiceNotification:${params.webserviceNotification}`);
  if (params.sholdNotify) {
    gqlParams.push(`mailingList:${params.notifList}`);
  }

  return gqlParams;
}
