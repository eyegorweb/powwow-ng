import { query } from './utils';

export async function fetchUnitActions(massActionId, status, pagination, orderBy) {
  const paginationInfo = pagination
    ? `, pagination: {page: ${pagination.page}, limit: ${pagination.limit}}`
    : '';
  const orderingInfo = orderBy
    ? `, sorting: {field: ${orderBy.key}, order: ${orderBy.direction}}`
    : '';

  const queryStr = `
  query {
    unitActions(filter: {massActionId: ${massActionId}, status: ${status}} ${paginationInfo} ${orderingInfo}) {
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
