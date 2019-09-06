import { query } from './utils';

export async function fetchUnitActionsTotals(massActionId) {
  const paginationInfo = `, pagination: {page: 0, limit: 20}`;
  const orderingInfo = `sorting: {field: id, order: DESC}`;

  const queryStr = `
query {
  failed: unitActions(filter: {massActionId: ${massActionId}, status: [KO] } ${paginationInfo} ${orderingInfo}) { total }
  ongoing: unitActions(filter: {massActionId: ${massActionId}, status: [WAITING, SENT, IN_PROGRESS] } ${paginationInfo} ${orderingInfo}) { total }
  finished: unitActions(filter: {massActionId: ${massActionId}, status: [OK, REPLAYED, CANCELLED] } ${paginationInfo} ${orderingInfo}) { total }
}
`;

  const response = await query(queryStr);
  return response.data;
}

export async function fetchUnitActions(massActionId, statuses, pagination, orderBy, filters = []) {
  const paginationInfo = pagination
    ? `, pagination: {page: ${pagination.page}, limit: ${pagination.limit}}`
    : '';
  const orderingInfo = orderBy
    ? `, sorting: {field: ${orderBy.key}, order: ${orderBy.direction}}`
    : '';

  const queryStr = `
  query {
    unitActions(filter: {${formatFilters(
      filters
    )} massActionId: "${massActionId}", status: [${statuses.join(
    ','
  )}]} ${paginationInfo} ${orderingInfo}) {
    total
    items {
      id
      msisdn
      ICCID
      status
      statusDate
      dueDate
      imsi
      error_reason
      manufacturer
      deviceReference
      imei
      actionType
    }
  }
}
  `;
  const response = await query(queryStr);
  return response.data.unitActions;
}

export async function exportLines(columns, orderBy, exportFormat) {
  const columnsParam = columns.join(',');
  const orderingInfo = orderBy ? `, sorting: {${orderBy.key}: ${orderBy.direction}}` : '';
  const response = await query(
    `
    query {
      linesExport(filter: {}, columns: [${columnsParam}]${orderingInfo}, exportFormat: ${exportFormat}) {
        downloadUri
        asyncRequired
      }
    }
    `
  );

  return response.data.linesExport;
}

function formatFilters(filters) {
  const allFilters = [];

  addIdsFilter(allFilters, filters);

  return allFilters.join(',');
}

function addIdsFilter(gqlFilters, selectedFilters) {
  const iccid = selectedFilters.find(f => f.id === 'filters.iccid');
  const imsi = selectedFilters.find(f => f.id === 'filters.imsi');
  const msisdn = selectedFilters.find(f => f.id === 'filters.msisdn');
  const msisdnA = selectedFilters.find(f => f.id === 'filters.msisdnA');
  const imei = selectedFilters.find(f => f.id === 'filters.imei');
  const unitActionId = selectedFilters.find(f => f.id === 'filters.unitActionId');

  if (iccid) {
    gqlFilters.push(`accesPointFilter: {iccid: "${iccid.value}"}`);
  }
  if (imsi) {
    gqlFilters.push(`imsi: {eq: "${imsi.value}"}`);
    gqlFilters.push(`accesPointFilter: {imsi: "${imsi.value}"}`);
  }
  if (msisdn) {
    gqlFilters.push(`accesPointFilter: {msisdn: "${msisdn.value}"}`);
  }
  if (msisdnA) {
    gqlFilters.push(`accesPointFilter: {amsisdn: "${msisdnA.value}"}`);
  }
  if (imei) {
    gqlFilters.push(`imei: {eq: "${imei.value}"}`);
    gqlFilters.push(`accesPointFilter: {imei: "${imei.value}"}`);
  }
  if (unitActionId) {
    gqlFilters.push(`unitActionId: "${unitActionId.value}"`);
  }
}

export async function fetchUnitActionsWithaccessPoint(
  accessPointId,
  statuses,
  pagination,
  filters = []
) {
  const paginationInfo = `, pagination: {page: 0, limit: 20}`;
  const sorting = null;

  const queryStr = `
  query {
    unitActions(filter: {${formatFilters(
      filters
    )} accessPointId: "${accessPointId}", status: [${statuses.join(
    ','
  )}]} ${paginationInfo}, sorting: ${sorting}) {
    total
    items {
      id
      msisdn
      ICCID
      status
      statusDate
      dueDate
      imsi
      error_reason
      manufacturer
      deviceReference
      imei
      actionType
    }
  }
}
  `;
  const response = await query(queryStr);
  return response.data.unitActions;
}
