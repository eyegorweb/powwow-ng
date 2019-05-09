import { query } from './utils';
import moment from 'moment';

// TODO: Optimiser cette requette, il faudra appeler les fields au besoin
export async function searchMassActions(orderBy, pagination, filters = []) {
  const paginationInfo = pagination
    ? `, pagination: {page: ${pagination.page}, limit: ${pagination.limit}}`
    : '';
  const orderingInfo = orderBy
    ? `, sorting: {field: ${orderBy.key},order:${orderBy.direction}}`
    : '';

  const queryStr = `
  query {
    massActions(
      filter: {
        ${formatFilters(filters)}
      }
      ${paginationInfo}
      ${orderingInfo}
    ) {
      total
      items {
        massActionResponse {
          id
          actionType
          dueDate
          created
          endDate
          targetActionNumber
          completedActionNumber
          inProgressActionNumber
          errorActionNumber
          partyId
          creator
          status
          offerName
          addedServices
          removeServices
          transitionName
          destinationCustomerAccountCode
        }
        user {
          id
          name {
            title
            firstName
            lastName
          }
          username
          email
          isUserParty
          isBackOffice
          roles {
            category
          }
        }
        party {
          id
          name
          code
          siren
          naf
          contractReference
        }
        fromParty {
          id
          name
          code
          siren
          naf
          contractReference
        }
        toParty {
          id
          name
          code
          siren
          naf
          contractReference
        }
      }
    }
  }`;

  const response = await query(queryStr);
  return response.data.massActions;
}

export async function countTotalByMassActionIndicators(
  filterIndicatorActionsInProgress,
  filterIndicatorActionsFailed,
  filterIndicatorActionsToApply
) {
  const pagination = {
    page: 0,
    limit: 0,
  };
  const paginationInfo = `, pagination: {page: ${pagination.page}, limit: ${pagination.limit}}`;
  const queryStr = `
  query {
    totalMassActions: massActions(filter: {}, pagination: {limit:0, page:0}) {
      total
    }

    indicatorActionsInProgress: massActions(filter: {${formatFilters(
      filterIndicatorActionsInProgress
    )}} ${paginationInfo} ) {
      total
    }

    indicatorActionsFailed: massActions(filter: {${formatFilters(
      filterIndicatorActionsFailed
    )}} ${paginationInfo} ) {
      total
    }

    indicatorActionsToApply: massActions(filter:  {${formatFilters(
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
  addDateFilter(allFilters, filters);
  addActDateCreationFilter(allFilters, filters);
  addActDueDateFilter(allFilters, filters);
  addActEndDateFilter(allFilters, filters);
  // addServices(allFilters, filters);

  return allFilters.join(',');
}

function formatDateForGql(inDate) {
  if (!inDate) return '';
  const startDate = inDate.replace(/\//g, '-');
  const parts = startDate.split(' ');
  if (parts) {
    if (parts.length === 2) {
      return startDate;
    } else {
      return `${parts[0]} 00:00:00`;
    }
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
  const dates = selectedFilters.find(f => f.id === 'filters.actDateCreation');
  if (dates) {
    gqlFilters.push(
      `createdFrom: "${formatDateForGql(dates.startDate)}", createdTo: "${formatDateForGql(
        dates.endDate
      )}"`
    );
  }
}

function addActDueDateFilter(gqlFilters, selectedFilters) {
  const dates = selectedFilters.find(f => f.id === 'filters.actDateStart');
  if (dates) {
    gqlFilters.push(
      `dueDateFrom: "${formatDateForGql(dates.startDate)}", dueDateTo: "${formatDateForGql(
        dates.endDate
      )}"`
    );
  }
}

function addActEndDateFilter(gqlFilters, selectedFilters) {
  const dates = selectedFilters.find(f => f.id === 'filters.actDateEnd');
  if (dates) {
    gqlFilters.push(
      `endDateFrom: "${formatDateForGql(dates.startDate)}", endDateTo: "${formatDateForGql(
        dates.endDate
      )}"`
    );
  }
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
    gqlFilters.push(`status: ${actStatuses.values[0].id}`);
  }
}

function addDateFilter(gqlFilters, selectedFilters) {
  const dateFilter = selectedFilters.find(f => f.id === 'filters.actDateStart');
  if (dateFilter && dateFilter.dueDateFrom && dateFilter.dueDateTo) {
    const formattedStartDate = `${formatDateForGql(dateFilter.dueDateFrom)}`;

    const formattedEndDate = `${prepareEndDateForBackend(dateFilter.dueDateTo)}`;

    gqlFilters.push(`dueDateFrom: "${formattedStartDate}", dueDateTo: "${formattedEndDate}"`);
  }

  function formatDateForGql(inDate) {
    if (!inDate) return '';
    const startDate = inDate.replace(/\//g, '-');
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
    const dateToEdit = inDate.replace(/\//g, '-');
    const parts = dateToEdit.split(' ');
    let endDate;
    let formatToUse;

    if (parts.length === 2) {
      formatToUse = 'DD-MM-YYYY hh:mm:ss';
      endDate = moment(dateToEdit, formatToUse);
      if (!dateFilter.sameDay) {
        endDate = endDate.add(1, 'days');
      }
      return endDate.format(formatToUse);
    } else {
      formatToUse = 'DD-MM-YYYY';
      endDate = moment(`${parts[0]}`, formatToUse);
      if (!dateFilter.sameDay) {
        endDate = endDate.add(1, 'days');
      }
      return endDate.format(formatToUse) + ' 00:00:00';
    }
  }
}
