import { query } from './utils';

export async function fetchSim(partnerId) {
  const response = await query(
    `
  query {
    findLatestSimcardsOrder(pagination: {page: 0, limit: 999}, sorting: {orderDate: ASC}, partyId: ${partnerId}) {
      total
      items {
        simCard {
          id
          code
          name
          format
          licence
        }
      }
    }
  }
    `
  );

  return response.data.findLatestSimcardsOrder.items;
}
