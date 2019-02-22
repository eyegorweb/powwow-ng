import { query } from './utils';

export async function fetchOrderStatuses() {
  const queryStr = `query {
    __type(name: "OrderStatusEnum") {
        enumValues{name}
      }
  }`;
  const response = await query(queryStr);
  return response.data.__type.enumValues.map(e => e.name);
}
