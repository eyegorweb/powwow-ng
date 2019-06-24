import { query, formatDateForGql } from './utils';
import { formatFilters } from './linesActions';

async function suspendReactivateLines(filters, lines, params, suspension) {
  const { suspendreFacturation, notifEmail, dueDate, nonModifiableParClient, partyId } = params;
  let gqlFilter = '';
  let lineIds = '';
  if (lines && lines.length > 0) {
    lineIds = lines.map(l => l.id).join(',');
  } else {
    gqlFilter = formatFilters(filters);
  }

  const queryStr = `
  mutation {
    suspendReactivateLines(
      input: {
        filter: {${gqlFilter}},
        partyId: ${partyId},
        simCardInstanceIds: [${lineIds}],
        suspendBilling: ${boolStr(suspendreFacturation)},
        notification: ${boolStr(notifEmail)},
        suspend: ${suspension},
        nonModifiableByCustomer: ${boolStr(nonModifiableParClient)},
        dueDate: "${formatDateForGql(dueDate)}"
      })
  }
  `;

  return await query(queryStr);
}

function boolStr(value) {
  return value ? 'true' : 'false';
}

export async function suspendLines(filters, lines, params) {
  return await suspendReactivateLines(filters, lines, params, true);
}

export async function reactivateLines(filters, lines, params) {
  return await suspendReactivateLines(filters, lines, params, false);
}

export async function sendSMS(filters, lines, params) {
  const { partyId, notifEmail, dueDate, texMessage, numberOfSMS, shortCode } = params;
  let gqlFilter = '';
  let lineIds = '';
  if (lines && lines.length > 0) {
    lineIds = lines.map(l => l.id).join(',');
  } else {
    gqlFilter = formatFilters(filters);
  }

  const queryStr = `
  mutation {
    sendSMS(
      input: {
        filter: {${gqlFilter}},
        partyId: ${partyId},
        simCardInstanceIds: [${lineIds}],
        notification: ${boolStr(notifEmail)},
        dueDate: "${formatDateForGql(dueDate)}"
        textMessage: "${texMessage}",
        numberOfSMS: ${numberOfSMS},
        shortCode: "${shortCode}"
        }
      )
  }
  `;

  return await query(queryStr);
}

export async function endPhaseTest(filters, lines, params) {
  const { notifEmail, dueDate, partyId } = params;
  let gqlFilter = '';
  let lineIds = '';
  if (lines && lines.length > 0) {
    lineIds = lines.map(l => l.id).join(',');
  } else {
    gqlFilter = formatFilters(filters);
  }

  const queryStr = `
    mutation {
        terminateLines(input: {
          filter: {${gqlFilter}},
          partyId: ${partyId},
          simCardInstanceIds: [${lineIds}],
          notification: ${boolStr(notifEmail)},
          dueDate: "${formatDateForGql(dueDate)}"
        })
    }
    `;

  return await query(queryStr);
}

export async function updateCustomFields(filters, lines, params) {
  let gqlFilter = '';
  let lineIds = '';
  if (lines && lines.length > 0) {
    lineIds = lines.map(l => l.id).join(',');
  } else {
    gqlFilter = formatFilters(filters);
  }

  const {
    partyId,
    notifEmail,
    dueDate,
    custom1,
    custom2,
    custom3,
    custom4,
    custom5,
    custom6,
  } = params;

  const queryStr = `
    mutation {
      changeCustomFields(
        input: {
          filter: {${gqlFilter}},
          partyId: ${partyId},
          simCardInstanceIds: [${lineIds}],
          notification: ${boolStr(notifEmail)},
          dueDate: "${formatDateForGql(dueDate)}",
          custom1: "${custom1}",
          custom2: "${custom2}",
          custom3: "${custom3}",
          custom4: "${custom4}",
          custom5: "${custom5}",
          custom6: "${custom6}"
        }
        )
    }
    `;

  return await query(queryStr);
}
