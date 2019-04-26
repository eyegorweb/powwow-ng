import { query } from './utils';

export async function fetchSim(partnerId) {
  const response = await query(
    `
  query {
    findLatestSimcardsOrder(pagination: {page: 0, limit: 999}, sorting: {orderDate: DESC}, partyId: ${partnerId}) {
      total
      items {
        orderDate
        simCard {
          id
          code
          name
          format
          licence
          type
          number
        }
      }
    }
  }
    `
  );

  return response.data.findLatestSimcardsOrder.items;
}
