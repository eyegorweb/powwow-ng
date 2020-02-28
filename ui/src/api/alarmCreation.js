import { query } from './utils';
import get from 'lodash.get';

export async function alarmOnChangeISP(params) {
  const queryStr = `mutation {
    createPLMNChangeAlarm(
      filter: {${getScopeGQLParams(params)}},
      alarmCreationInput: {${getFormGQLParams(params)}}
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

  return response.data.createPLMNChangeAlarm;
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

  gqlParams.push(`plmnList:[${params.formData.map(p => `"${p.id}"`).join(',')}]`);

  return gqlParams.join(',');
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

  const searchById = get(params, 'scope.searchById.type');

  if (searchById) {
    return `${searchById.type}: {eq: ${searchById.value}}`;
  }

  const offer = get(params, 'scope.offer.id');
  const billingAccount = get(params, 'scope.billingAccount.value');

  if (offer) {
    const offerGqlParams = [];

    offerGqlParams.push(`offer: {eq: ${offer}}`);

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
