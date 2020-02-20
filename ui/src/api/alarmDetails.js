import { query, getFilterValue, addDateFilter } from './utils';

export async function fetchAlarmTriggersFor2Months(orderBy, pagination, filters = []) {
  const paginationInfo = pagination
    ? `, pagination: {page: ${pagination.page}, limit: ${pagination.limit}}`
    : '';
  const queryStr = `
  {
    alarmsWithTriggers(
      linesWithTriggersFilterInput: { ${formatFilters(filters)} },
      ${paginationInfo}
    ) {
      total
      items {
        iccid
        activationDate
        lastTriggerThisMonth {
          triggerDate
          reasonAndValue {
            reason
            value
          }
        }
        lastTriggerPastMonth {
          triggerDate
          reasonAndValue {
            reason
            value
          }
        }
      }
    }
  }
  `;

  const response = await query(queryStr);

  return response.data.alarmsWithTriggers;
}

function formatFilters(selectedFilters) {
  const gqlFilters = [];
  addPartyId(gqlFilters, selectedFilters);
  addAlarmId(gqlFilters, selectedFilters);
  addThreshold(gqlFilters, selectedFilters);
  addLineId(gqlFilters, selectedFilters);
  addDateFilter(gqlFilters, selectedFilters, 'lastTriggerDate', 'getvsion.alarm.trigger_date');

  return gqlFilters.join(',');
}

function addAlarmId(gqlFilters, selectedFilters) {
  const alarmId = getFilterValue(selectedFilters, 'filters.alarmId');
  if (alarmId) {
    gqlFilters.push(`alarmId: {eq: ${alarmId}}`);
  }
}

function addPartyId(gqlFilters, selectedFilters) {
  const partyId = getFilterValue(selectedFilters, 'filters.partyId');
  if (partyId) {
    gqlFilters.push(`partyId: {eq: ${partyId}}`);
  }
}

function addThreshold(gqlFilters, selectedFilters) {
  const foundFilter = selectedFilters.find(f => f.id === 'getvsion.alarm.trigger_reason');

  if (foundFilter) {
    gqlFilters.push(`threshold: ${foundFilter.data.value}`);
  }
}

function addLineId(gqlFilters, selectedFilters) {
  const idsFilters = [];

  const _id = selectedFilters.find(f => f.id === 'filters.id');
  const accessPointId = selectedFilters.find(f => f.id === 'filters.accessPointId');
  const iccid = selectedFilters.find(f => f.id === 'filters.iccid');
  const imsi = selectedFilters.find(f => f.id === 'filters.imsi');
  const msisdn = selectedFilters.find(f => f.id === 'filters.msisdn');
  const imei = selectedFilters.find(f => f.id === 'filters.imei');
  const msisdnA = selectedFilters.find(f => f.id === 'filters.msisdnA');

  if (_id) {
    idsFilters.push(`id: {eq: "${_id.value}"}`);
  }
  if (iccid) {
    idsFilters.push(`iccid: {eq: "${iccid.value}"}`);
  }
  if (imsi) {
    idsFilters.push(`imsi: {eq: "${imsi.value}"}`);
  }
  if (msisdn) {
    idsFilters.push(`msisdn: {eq: "${msisdn.value}"}`);
  }
  if (imei) {
    idsFilters.push(`imei: {eq: "${imei.value}"}`);
  }
  if (msisdnA) {
    idsFilters.push(`msisdnA: {eq: "${msisdnA.value}"}`);
  }
  if (accessPointId) {
    idsFilters.push(`accessPointId: {eq: "${accessPointId.value}"}`);
  }

  if (idsFilters && idsFilters.length) gqlFilters.push(`lineIdentifier: ${idsFilters.join(',')}`);
}
