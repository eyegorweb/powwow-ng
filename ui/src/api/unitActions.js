import { query } from './utils';

export async function fetchUnitActionsTotals(massActionId) {
  const paginationInfo = `, pagination: {page: 0, limit: 1}`;
  const orderingInfo = `sorting: {field: id, order: DESCENDING}`;

  const queryStr = `
query {
  failed: unitActions(filter: {massActionId: ${massActionId}, status: [KO] } ${paginationInfo} ${orderingInfo}) { total }
  ongoing: unitActions(filter: {massActionId: ${massActionId}, status: [SENT] } ${paginationInfo} ${orderingInfo}) { total }
  finished: unitActions(filter: {massActionId: ${massActionId}, status: [OK] } ${paginationInfo} ${orderingInfo}) { total }
}
`;

  const response = await query(queryStr);
  return response.data;
}

export async function fetchUnitActions(massActionId, statuses, pagination, orderBy) {
  const paginationInfo = pagination
    ? `, pagination: {page: ${pagination.page}, limit: ${pagination.limit}}`
    : '';
  const orderingInfo = orderBy
    ? `, sorting: {field: ${orderBy.key}, order: ${orderBy.direction}}`
    : '';

  const queryStr = `
  query {
    unitActions(filter: {massActionId: ${massActionId}, status: ${statuses.join(
    ','
  )}} ${paginationInfo} ${orderingInfo}) {
    total
    items {
      id
      msisdn
      iccid
      status
      statusDate
      dueDate
      imsi
      error_reason
      manufacturer
      deviceReference
      imei
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
  console.log(`
  query {
    linesExport(filter: {}, columns: [${columnsParam}]${orderingInfo}, exportFormat: ${exportFormat}) {
      downloadUri
      asyncRequired
    }
  }
  `);
  return response.data.linesExport;
}
