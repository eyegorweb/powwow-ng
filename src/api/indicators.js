import { query } from './utils';

export async function fetchGetSimIndicators() {
  const response = await query(
    `
    query {
      indicators {
        ordersToValidate
        ordersInProgress
        nonConfirmedOrders
        faillingOrders
        ordersToBeValidated
      }
    }
    `
  );

  return response.data.indicators;
}
