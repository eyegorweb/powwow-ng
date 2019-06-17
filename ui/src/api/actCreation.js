import { query, formatDateForGql } from './utils';
import { formatFilters } from './linesActions';

async function suspendReactivateLines(filters, lines, params, suspension) {
  const { suspendreFacturation, notifEmail, dueDate, nonModifiableParClient } = params;
  let gqlFilter = '';
  let lineIds = '';
  if (lines && lines.length > 0) {
    lineIds = lineIds.map(l => l.id).join(',');
  } else {
    gqlFilter = formatFilters(filters);
  }

  const queryStr = `
  mutation {
    suspendReactivateLines(filter: {${gqlFilter}},
      suspendreFacturation: ${boolStr(suspendreFacturation)},
      notifEmail: ${boolStr(notifEmail)},
      suspension: ${suspension},
      nonModifiableParClient: ${boolStr(nonModifiableParClient)},
      dueDate: "${formatDateForGql(dueDate)}")
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

function boolStr(value) {
  return value ? 'true' : 'false';
}
