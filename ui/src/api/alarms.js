import { query, getValuesIdsWithoutQuotes, formatDateForGql } from './utils';

export async function fetchAlarmInstancesByAP(id) {
  const queryStr = `
  query {
    alarmInstances(searchBy: ACCESSPOINT_ID, id: ${id}) {
      id
      alarm {
        id
        type
        level1
        level1Up
        level1Down
        level2
        level2Up
        level2Down
        level3
        level3Up
        level3Down
        startDate
        party {
          id
          name
        }
      }
    }
  }
  `;

  const response = await query(queryStr);
  return response.data.alarmInstances;
}

export async function fetchAlarmsWithInfos(simCardInstanceId) {
  const queryStr = `
  query {
    alarmsWithInfo(simCardInstanceId: ${simCardInstanceId}) {
      isTriggered
      isActive
      alarm {
        id
        startDate
        expiryDate
        type
        party {
          id
          name
          partyType

        }
        observationDelay
        name
        level1
        level1Up
        level1Down
        level2
        level2Up
        level2Down
        level3
        level3Up
        level3Down
        observationCycle
        alarmScope
      }
    }
  }
  `;

  const response = await query(queryStr);
  return response.data.alarmsWithInfo;
}

export async function searchAlarms(orderBy, pagination, filters = []) {
  // const orderingInfo = orderBy ? `, sorting: {${orderBy.key}: ${orderBy.direction}}` : '';
  const paginationInfo = pagination
    ? `, pagination: {page: ${pagination.page}, limit: ${pagination.limit}}`
    : '';
  const queryStr = `
  query {
    alarms(alarmFilterInput: {
      ${formatFilters(filters)}
    }${paginationInfo}) {
      total
      items {
        id
        name
        party {
          id
          name
        }
        numberOfTargetedLines
        numberOfTriggerEvents
        level1
        level1Up
        level1Down
        level2
        level2Up
        level2Down
        level3
        level3Up
        level3Down
      }
    }
  }`;
  const response = await query(queryStr);
  return response.data.alarms;
}

function formatFilters(selectedFilters) {
  const gqlFilters = [];

  addPartnerFilter(gqlFilters, selectedFilters);
  addCustomerAccount(gqlFilters, selectedFilters);
  addScope(gqlFilters, selectedFilters);
  addAlarmType(gqlFilters, selectedFilters);

  return gqlFilters.join(',');
}

function addPartnerFilter(gqlFilters, selectedFilters) {
  const partyIds = getValuesIdsWithoutQuotes(selectedFilters, 'filters.partners');
  if (partyIds) {
    gqlFilters.push(`partyID: {in: [${partyIds}]}`);
  }
}

function addCustomerAccount(gqlFilters, selectedFilters) {
  const ids = getValuesIdsWithoutQuotes(selectedFilters, 'filters.billingAccounts');
  if (ids) {
    gqlFilters.push(`customerAccount: {in: [${ids}]}`);
  }
}

function addScope(gqlFilters, selectedFilters) {
  const ids = getValuesIdsWithoutQuotes(selectedFilters, 'getvsion.filters.ALARMS_OFFER');
  if (ids) {
    gqlFilters.push(`alarmScope: {in: [${ids}]}`);
  }
}

function addAlarmType(gqlFilters, selectedFilters) {
  const foundFilter = selectedFilters.find(f => f.id === 'getvsion.filters.ALARM_TYPE');
  if (foundFilter) {
    gqlFilters.push(`alarmType: {in: [${foundFilter.code}]}`);
  }
}

export async function createAlarmInstance(simCardInstanceId, alarmId, partyId, dueDate) {
  const queryStr = `
  mutation {
    createAlarmInstance(alarmInput: {
      alarmId: ${alarmId}
      simCardInstanceId: ${simCardInstanceId}
      partyId: ${partyId}
      dueDate: "${formatDateForGql(dueDate)}"
      notification: false
      adminSkipGDM: false
    })
  }
  `;

  const response = await query(queryStr);
  return response.data.createAlarmInstance;
}

export async function deleteAlarmInstance(simCardInstanceId, alarmId, partyId, dueDate) {
  const queryStr = `
  mutation {
    deleteAlarmInstance(alarmInput: {
      alarmId: ${alarmId}
      simCardInstanceId: ${simCardInstanceId}
      partyId: ${partyId}
      dueDate: "${formatDateForGql(dueDate)}"
      notification: false
      adminSkipGDM: false
    })
  }
  `;

  const response = await query(queryStr);
  return response.data.deleteAlarmInstance;
}
