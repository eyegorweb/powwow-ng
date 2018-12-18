import { query } from './utils';

export async function fetchGetSimIndicators() {
  const response = await query(
    `
    query {
      indicators {
        ordersToValidate
        ordersInProgress
        ordersNonConfirmed
        ordersFailing
        ordersToBeValidated
      }
    }
    `
  );

  return response.data.indicators;
}
