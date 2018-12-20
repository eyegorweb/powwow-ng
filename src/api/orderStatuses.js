import { query } from './utils';

export async function fetchOrderStatuses() {
  const response = await query(
    `
    query {
      orderStatuses {
        id
        label
        checked
      }
    }
    `
  );

  return response.data.orderStatuses;
}
