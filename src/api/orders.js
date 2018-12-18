import { query } from './utils';

export async function searchOrders(fields, orderBy, paginaton) {
  const fieldsParams = fields.reduce((all, item) => {
    all.push(getFieldParam(item));
    return all;
  }, []);
  const paginationInfo = paginaton
    ? `, pagination: {page: ${paginaton.page}, limit: ${paginaton.limit}}`
    : '';
  const orderingInfo = orderBy ? `, sorting: {${orderBy.key}: ${orderBy.direction}}` : '';

  const queryStr = `
  query {
    orders(filter: {}${paginationInfo}${orderingInfo}) {
      total
      orders {
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
