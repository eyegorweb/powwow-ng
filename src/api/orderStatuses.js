import { query } from './utils';

export async function fetchOrderStatuses() {
  const queryStr = `query{ orderStatus }`;
  const response = await query(queryStr);
  return response.data.orderStatus;
}
