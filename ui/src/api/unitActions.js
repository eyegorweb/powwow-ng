import { query } from './utils';

export async function fetchUnitActions(massActionId, extraArgs, pagination, orderBy, filters = []) {
  const extraFilters = [];
  if (extraArgs.statuses) {
    extraFilters.push({
      id: 'filters.statuses',
      values: extraArgs.statuses,
    });
  }
  if (extraArgs.groupedStatus) {
    extraFilters.push({
      id: 'filters.groupedStatus',
      values: extraArgs.groupedStatus,
    });
  }
  return await fetchUnitActions2(
    [
      ...filters,
      ...extraFilters,
      {
        id: 'filters.massActionId',
        value: massActionId,
      },
    ],
    pagination,
    orderBy
  );
}

export async function fetchUnitActions2(filters = [], pagination, orderBy) {
  const paginationInfo = pagination
    ? `, pagination: {page: ${pagination.page}, limit: ${pagination.limit}}`
    : '';
  const orderingInfo = orderBy
    ? `, sorting: {field: ${orderBy.key}, sorting: ${orderBy.direction}}`
    : '';

  const queryStr = `
    query {
      unitActionsV2(filter: {${formatFilters(filters)} } ${paginationInfo} ${orderingInfo}) {
      total
      items {
        unitAction {
          id
          actionType
          accessPointId
          dueDate
          created
          status
          statusDate
          errorCode
        }
        msisdn
        imsi
        iccid
        imei
        deviceReference
        deviceManufacturer
        info
        error
        massActionId
        geoloc
      }
    }
  }
    `;
  const response = await query(queryStr);
  return response.data.unitActionsV2;
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
  const actionType = selectedFilters.find(f => f.id === 'filters.actionType');
  const massActionId = selectedFilters.find(f => f.id === 'filters.massActionId');
  const groupedStatus = selectedFilters.find(f => f.id === 'filters.groupedStatus');
  const statuses = selectedFilters.find(f => f.id === 'filters.statuses');
  const accessPointId = selectedFilters.find(f => f.id === 'filters.accessPointId');

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
  if (actionType) {
    gqlFilters.push(`actionType: ${actionType.value}`);
  }
  if (massActionId) {
    gqlFilters.push(`massActionId: ${massActionId.value}`);
  }
  if (groupedStatus) {
    gqlFilters.push(`groupedStatus: ${groupedStatus.value}`);
  }
  if (accessPointId) {
    gqlFilters.push(`accessPointId: ${accessPointId.value}`);
  }
  if (statuses) {
    gqlFilters.push(`status: [${statuses.values.join(',')}]`);
  }
}
