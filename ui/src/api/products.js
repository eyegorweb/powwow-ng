import { query } from './utils';

export async function fetchSim(partnerId, cfID) {
  let cfParam = '';

  if (cfID) {
    cfParam = `, customerAccountId: ${cfID}`;
  }

  const response = await query(
    `
  query {
    findLatestSimcardsOrder(pagination: {page: 0, limit: 999}, sorting: {orderDate: DESC}, partyId: ${partnerId}${cfParam}) {
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
          category
        }
      }
    }
  }
    `
  );

  return response.data.findLatestSimcardsOrder.items;
}
