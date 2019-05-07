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
