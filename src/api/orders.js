import { query } from './utils';

export async function searchOrders(fields, orderBy, pagination) {
  const fieldsParams = fields.reduce((all, item) => {
    all.push(getFieldParam(item));
    return all;
  }, []);
  const paginationInfo = pagination
    ? `, pagination: {page: ${pagination.page}, limit: ${pagination.limit}}`
    : '';
  const orderingInfo = orderBy ? `, sorting: {${orderBy.key}: ${orderBy.direction}}` : '';

  const queryStr = `
  query {
    orders(filter: {}${paginationInfo}${orderingInfo}) {
      total
      items {
        ${fieldsParams.join('\n')}
      }
    }
  }
  `;
  const response = await query(queryStr);
  return response.data.orders;
}

function getFieldParam(item) {
  if (item === 'singleProduct') {
    return `
    singleProduct {
      description
    }`;
  }
  return item;
}
