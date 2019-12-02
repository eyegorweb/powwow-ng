import { query } from './utils';
import moment from 'moment';

export async function exportMassAction(massActonId, statuses, columns, pagination, exportFormat) {
  const columnsParam = columns.join(',');
  const statusesParam = statuses.join(',');
  const paginationInfo = pagination
    ? `, pagination: {page: ${pagination.page}, limit: ${pagination.limit}}`
    : '';

  const queryStr = `
  query  {
    exportMassAction(filter: {massActionId: ${massActonId}},
      unitActionStatus:[${statusesParam}],
      columns: [${columnsParam}],
      ${paginationInfo},
      exportFormat: ${exportFormat}){
      downloadUri
      total
    }
  }
  `;

  const response = await query(queryStr);

  return response.data.exportMassAction;
}
export async function exportAllMassActions(columns, pagination, exportFormat) {
  const columnsParam = columns.join(',');
  const paginationInfo = pagination
    ? `, pagination: {page: ${pagination.page}, limit: ${pagination.limit}}`
    : '';
  const queryStr = `
  query  {
    exportMassAction(filter: {}, columns: [${columnsParam}] ${paginationInfo}, exportFormat: ${exportFormat}){
      downloadUri
      total
      asyncRequired
    }
  }
  `;

  const response = await query(queryStr);

  return response.data.exportMassAction;
}

export async function searchMassActionsById(massActionId) {
  const response = await searchMassActions(
    { key: 'ID', direction: 'DESC' },
    { page: 0, limit: 1 },
    [{ id: 'filters.massActionId', value: massActionId }]
  );

  if (response && response.items && response.items.length) {
    return response.items[0];
  }
}

export async function fetchTotalMassActions(filters) {
  const queryStr = `
  query {
    massActions(
      filter: {
        ${formatFilters(filters)}
      }
      , pagination: {page: 0, limit: 20}
      , sorting: {field: id,sorting:DESC}
    ) {
      total
    }
  }
  `;
  const response = await query(queryStr);
  return response.data.massActions;
}

export async function searchMassActions(orderBy, pagination, filters = []) {
  const paginationInfo = pagination
    ? `, pagination: {page: ${pagination.page}, limit: ${pagination.limit}}`
    : '';
  const orderingInfo = orderBy
    ? `, sorting: {field: ${orderBy.key},sorting:${orderBy.direction}}`
    : '';

  const queryStr = `
  query {
    massActionsV2(filter: {${formatFilters(filters)}}${paginationInfo}${orderingInfo}) {
      total
      items {
        massAction {
          id
          actionType
          created
          dueDate
          status
          started
          ended
          targetEntitiesNumber
        }
        failedEntitiesNumber
        completedEntitiesNumber
        pendingEntitiesNumber
        partyName
        creatorUsername
        info
        type
        partyName
        creatorEmail
      }
    }
  }
  `;
  const response = await query(queryStr);
  return response.data.massActionsV2;
}

export async function countTotalForMassAction(filters) {
  const pagination = {
    page: 0,
    limit: 1,
  };
  const paginationInfo = `, pagination: {page: ${pagination.page}, limit: ${pagination.limit}}`;
  const queryStr = `
  query {

    massActionsV2(filter: {${formatFilters(filters)}} ${paginationInfo} ) {
      total
    }

  }
  `;
  const response = await query(queryStr);
  return response.data.massActionsV2;
}

export async function averageTimeMassAction(partyId, period, actionTypes) {
  const queryStr = `
  query {
    massActionAverageTime(partyIds:[${partyId}] averageType: ${period}, ${formatFilters(
    actionTypes
  )}){
      total
      items {
        key
        value
      }
    }
  }
  `;
  const response = await query(queryStr);
  return response.data.massActionAverageTime;
}

export async function fetchSingleIndicator(filters, contextFilters = []) {
  const filtersToUse = [...filters, ...contextFilters];
  const queryStr = `
  query {
    massActionsV2(filter: { ${formatFilters(
      filtersToUse
    )} }, pagination: {page: 0, limit: 1}) { total }
  }
  `;
  const response = await query(queryStr);
  return response.data.massActionsV2;
}

export async function countTotalByMassActionIndicators(
  filterIndicatorActionsInProgress,
  filterIndicatorActionsFailed,
  filterIndicatorActionsToApply
) {
  const pagination = {
    page: 0,
    limit: 1,
  };
  const paginationInfo = `, pagination: {page: ${pagination.page}, limit: ${pagination.limit}}`;
  const queryStr = `
  query {
    totalMassActions: massActionsV2(filter: {}, pagination: {limit:0, page:0}) {
      total
    }

    indicatorActionsInProgress: massActionsV2(filter: {${formatFilters(
      filterIndicatorActionsInProgress
    )}} ${paginationInfo} ) {
      total
    }

    indicatorActionsFailed: massActionsV2(filter: {${formatFilters(
      filterIndicatorActionsFailed
    )}} ${paginationInfo} ) {
      total
    }

    indicatorActionsToApply: massActionsV2(filter:  {${formatFilters(
      filterIndicatorActionsToApply
    )}} ${paginationInfo} ) {
      total
    }
  }
  `;

  const response = await query(queryStr);
  return response.data;
}

export async function acknowledgeFailedUnitActions(message, massActionId) {
  const queryStr = `
  mutation {
    acknowledgeFailedUnitActions(message: "${message}", massActionId: ${massActionId})
  }
  `;
  const response = await query(queryStr);
  return response.data;
}

export async function replayFailedUnitsActions(massActionId) {
  const queryStr = `
  mutation {
    replayFailedUnitsActions(massActionId: ${massActionId})
  }
  `;
  const response = await query(queryStr);
  return response.data;
}

export async function cancelMassAction(massActionId) {
  const queryStr = `
    mutation {
      cancelMassAction(massActionId: ${massActionId})
    }
  `;
  const response = await query(queryStr);
  return response.data;
}

function formatFilters(filters) {
  const allFilters = [];
  const partyIds = getValuesIdsForInt(filters, 'filters.partners');
  if (partyIds) {
    allFilters.push(`partyIds: [${partyIds}]`);
  }

  const offers = getValuesIds(filters, 'filters.offers');
  if (offers) {
    allFilters.push(`workflowCode: {in: [${offers}]}`);
  }

  const customFields = getFilterValues(filters, 'filters.customFields');
  if (customFields && customFields.length > 0) {
    const customFeldsGQLparams = customFields
      .map(c => `${c.id}: {contains: "${c.value}"}`)
      .join(',');

    allFilters.push(customFeldsGQLparams);
  }

  // addQuantityFilter(allFilters, filters);
  addActionTypeFilter(allFilters, filters);
  actStatus(allFilters, filters);
  addActDateCreationFilter(allFilters, filters);
  addActDueDateFilter(allFilters, filters);
  addActEndDateFilter(allFilters, filters);
  addMassActionId(allFilters, filters);
  addIdsFilter(allFilters, filters);
  addCreatorFilter(allFilters, filters);
  addTransitionName(allFilters, filters);
  // addServices(allFilters, filters);

  return allFilters.join(',');
}

function addIdsFilter(gqlFilters, selectedFilters) {
  const iccid = selectedFilters.find(f => f.id === 'filters.iccid');
  const imsi = selectedFilters.find(f => f.id === 'filters.imsi');
  const msisdn = selectedFilters.find(f => f.id === 'filters.msisdn');
  const msisdnA = selectedFilters.find(f => f.id === 'filters.msisdnA');
  const imei = selectedFilters.find(f => f.id === 'filters.imei');
  const massActionID = selectedFilters.find(f => f.id === 'filters.massActionID');
  const unitActionId = selectedFilters.find(f => f.id === 'filters.unitActionId');

  if (iccid) {
    gqlFilters.push(`identifierFilter: {iccid: "${iccid.value}"}`);
  }
  if (imsi) {
    gqlFilters.push(`identifierFilter: {imsi: "${imsi.value}"}`);
  }
  if (msisdn) {
    gqlFilters.push(`identifierFilter: {msisdn: "${msisdn.value}"}`);
  }
  if (msisdnA) {
    gqlFilters.push(`identifierFilter: {amsisdn: "${msisdnA.value}"}`);
  }
  if (imei) {
    gqlFilters.push(`identifierFilter: {imei: "${imei.value}"}`);
  }
  if (massActionID) {
    gqlFilters.push(`massActionId: ${massActionID.value}`);
  }
  if (unitActionId) {
    gqlFilters.push(`unitActionId: ${unitActionId.value}`);
  }
}

// transitionName

function addTransitionName(gqlFilters, selectedFilters) {
  const transitionNameFilter = selectedFilters.find(f => f.id === 'filters.transitionName');
  if (transitionNameFilter) {
    gqlFilters.push(`transitionName: "${transitionNameFilter.value}"`);
  }
}

function addCreatorFilter(gqlFilters, selectedFilters) {
  const creatorIds = getValuesIdsForInt(selectedFilters, 'filters.orderCreator');
  if (creatorIds) {
    gqlFilters.push(`creator: [${creatorIds}]`);
  }
}

function addMassActionId(gqlFilters, selectedFilters) {
  const massActionIdFilter = selectedFilters.find(f => f.id === 'filters.massActionId');
  if (massActionIdFilter) {
    gqlFilters.push(`massActionId: ${massActionIdFilter.value}`);
  }
}

function addActionTypeFilter(gqlFilters, selectedFilters) {
  const actionTypes = selectedFilters.find(f => f.id === 'filters.actTypes');
  if (actionTypes) {
    const actionTypesValues = actionTypes.values.map(a => a.id);
    gqlFilters.push(`actionTypes: [ ${[...actionTypesValues]} ]`);
  }
}

function addActDateCreationFilter(gqlFilters, selectedFilters) {
  addDateFilter2(
    'filters.actDateCreation',
    'createdFrom',
    'createdTo',
    gqlFilters,
    selectedFilters
  );
}

function addActDueDateFilter(gqlFilters, selectedFilters) {
  addDateFilter2('filters.actDateStart', 'dueDateFrom', 'dueDateTo', gqlFilters, selectedFilters);
}

function addActEndDateFilter(gqlFilters, selectedFilters) {
  addDateFilter2('filters.actDateEnd', 'endDateFrom', 'endDateTo', gqlFilters, selectedFilters);
}

/*
function addServices(gqlFilters, selectedFilters) {
  const services = selectedFilters.find(f => f.id === 'filters.services');
  if (services) {
    gqlFilters.push(`optionalServiceAction:  ${services.values[0].id}`);
  }
}
//*/

function getValuesIds(filters, filterId) {
  const values = getFilterValues(filters, filterId);
  if (values) {
    return values.map(i => `"${i.id}"`).join(',');
  }
}

function getValuesIdsForInt(filters, filterId) {
  const values = getFilterValues(filters, filterId);
  if (values) {
    return values.map(i => `${i.id}`).join(',');
  }
}

function getFilterValues(filters, filterId) {
  if (!filters) return;

  const foundFilter = filters.find(f => f.id === filterId);
  if (foundFilter) {
    return foundFilter.values;
  }
}

// TODO: update request when statuses will be allowed to be more than one selected
// function actStatus(gqlFilters, selectedFilters) {
//   const actStatuses = selectedFilters.find(f => f.id === 'filters.actStatus');
//   actStatuses && gqlFilters.push(`status: {${actStatuses.values.map(o => o.id)}}`);
// }
function actStatus(gqlFilters, selectedFilters) {
  const actStatuses = selectedFilters.find(f => f.id === 'filters.actStatus');
  if (actStatuses && actStatuses.values && actStatuses.values.length) {
    const actStatusesValues = actStatuses.values.map(a => a.id);
    gqlFilters.push(`status: [ ${[...actStatusesValues]} ]`);
  }
}

function addDateFilter2(filterKey, dateFromKey, dateEndKey, gqlFilters, selectedFilters) {
  const dateFilter = selectedFilters.find(f => f.id === filterKey);
  if (dateFilter) {
    let gqlStartDate = '';
    let gqlEndDate = '';
    const gqlDateParams = [];
    if (dateFilter.startDate) {
      gqlStartDate = `${dateFromKey}: "${formatDateForGql(dateFilter.startDate)}"`;
      gqlDateParams.push(gqlStartDate);
    }
    if (dateFilter.endDate) {
      gqlEndDate = `${dateEndKey}: "${prepareEndDateForBackend(dateFilter.endDate)}"`;
      gqlDateParams.push(gqlEndDate);
    }
    gqlFilters.push(gqlDateParams.join(','));
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
