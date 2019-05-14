import { query } from './utils';

export async function getLinesTypeSimCard(pagination, orderBy) {
  const paginationInfo = pagination
    ? `, pagination: {page: ${pagination.page}, limit: ${pagination.limit}}`
    : '';
  const orderingInfo = orderBy ? `, sorting: {id: ${orderBy.id}}` : '';
  const queryStr = `query {
    lines(filter: {} ${paginationInfo} ${orderingInfo}) {
      items {
        accessPoint {
          simCardInstance {
            id
            type
            statuts
          }
        }
      }
   }
  }`;
  const response = await query(queryStr);
  return response.data.lines.items;
}
