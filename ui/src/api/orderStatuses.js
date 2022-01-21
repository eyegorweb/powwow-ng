import { query } from './utils';

export async function fetchOrderStatuses() {
  const queryStr = `query {
    fetchOrderStatusEnum
  }`;
  const response = await query(queryStr);
  return response.data.fetchOrderStatusEnum;
}
