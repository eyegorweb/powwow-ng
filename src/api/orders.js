import { query } from './utils';

export async function searchOrders(orderBy, pagination) {
  const paginationInfo = pagination
    ? `, pagination: {page: ${pagination.page}, limit: ${pagination.limit}}`
    : '';
  const orderingInfo = orderBy ? `, sorting: {${orderBy.key}: ${orderBy.direction}}` : '';

  const queryStr = `
  query {
    orders(filter: {}${paginationInfo}${orderingInfo}) {
      total
      items {
        id
				creationDate
				activationAsked
        status
        orderItems {
          quantity
          orderedProduct {
            description
            code
          }
        }
      }
    }
  }
  `;
  const response = await query(queryStr);
  return response.data.orders;
}
