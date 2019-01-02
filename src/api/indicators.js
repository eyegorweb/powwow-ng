import { delay } from './utils';

// MOCK temporaire en attendant l'api du backend
export async function fetchGetSimIndicators() {
  await delay(200);

  return {
    ordersValidated: 4,
    ordersInProgress: 1,
    nonConfirmedOrders: 5,
    faillingOrders: 8,
    ordersToBeValidated: 2,
  };
}
