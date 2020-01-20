import { query, getValuesIdsWithoutQuotes, getFilterValue } from './utils';
import moment from 'moment';

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
  if (!response.data) return;
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
  if (!response.data) return;

  return response.data.alarmsWithInfo;
}

export async function searchAlarmById(id) {
  const orderBy = {};
  const pagination = { page: 0, limit: 10 };
  const filters = [{ id: 'filters.alarmId', value: id }];
  const response = await searchAlarms(orderBy, pagination, filters);

  if (response && response.items && response.items.length) {
    return response.items[0];
  }

  return;
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
        type
        alarmScope
        observationCycle
        notifyByWs
        notifyByEmail
        mailingList {
          name
          emails
        }
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
        startDate
      }
    }
  }`;
  const response = await query(queryStr);
  return response.data.alarms;
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

function formatFilters(selectedFilters) {
  const gqlFilters = [];

  addPartnerFilter(gqlFilters, selectedFilters);
  addCustomerAccount(gqlFilters, selectedFilters);
  addScope(gqlFilters, selectedFilters);
  addAlarmType(gqlFilters, selectedFilters);
  addDateTriggerAlarm(gqlFilters, selectedFilters);
  addId(gqlFilters, selectedFilters);

  return gqlFilters.join(',');
}

function addId(gqlFilters, selectedFilters) {
  const partyIds = getFilterValue(selectedFilters, 'filters.alarmId');
  if (partyIds) {
    gqlFilters.push(`alarmId: {eq: ${partyIds}}`);
  }
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

function addDateTriggerAlarm(gqlFilters, selectedFilters) {
  const dateFilter = selectedFilters.find(f => f.id === 'getvsion.filters.DATE_TRIGGER');
  if (dateFilter && dateFilter.startDate && dateFilter.endDate) {
    const formattedStartDate = `${formatDateForGql(dateFilter.startDate)}`;

    const formattedEndDate = `${prepareEndDateForBackend(dateFilter.endDate)}`;

    gqlFilters.push(
      `triggerDateStart: {eq: "${formattedStartDate}"}, triggerDateEnd: {eq: "${formattedEndDate}"}`
    );
  }

  function prepareEndDateForBackend(inDate) {
    const dateToEdit = inDate.replace(/\//g, '/');
    const parts = dateToEdit.split(' ');
    let endDate;
    let formatToUse;

    if (parts.length === 2) {
      formatToUse = 'DD/MM/YYYY hh:mm:ss';
      endDate = moment(dateToEdit, formatToUse);
      if (!dateFilter.sameDay) {
        endDate = endDate.add(1, 'days');
      }
      return endDate.format(formatToUse);
    } else {
      formatToUse = 'DD/MM/YYYY';
      endDate = moment(`${parts[0]}`, formatToUse);
      if (!dateFilter.sameDay) {
        endDate = endDate.add(1, 'days');
      }
      return endDate.format(formatToUse) + ' 00:00:00';
    }
  }
}

function formatDateForGql(inDate) {
  if (!inDate) return '';
  const startDate = inDate.replace(/\//g, '/');
  const parts = startDate.split(' ');
  if (parts) {
    if (parts.length === 2) {
      return startDate;
    } else {
      return `${parts[0]} 00:00:00`;
    }
  }
}
