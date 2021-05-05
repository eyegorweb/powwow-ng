import { query } from './utils';

export async function fetchSim(partnerId, customerAccountId, simCategoryFilter) {
  const response = await query(
    `
  query FindLatestSimcardsOrder($partnerId: Long!,$customerAccountId: Long, $simCategoryFilter: SIMCardCategoryFilterInput) {
    findLatestSimcardsOrder(pagination: {page: 0, limit: 999}, sorting: {orderDate: DESC}, partyId: $partnerId, customerAccountId: $customerAccountId, SimCategoryFilter: $simCategoryFilter) {
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
    `,
    { partnerId, customerAccountId, simCategoryFilter }
  );

  return response.data.findLatestSimcardsOrder.items;
}

export async function disableSimCard(partnerId, simId) {
  const response = await query(
    `
      mutation{
        disableSimForParty(partnerId: ${partnerId}, simcardId: ${simId})
      }
    `
  );

  return response.data.disableSimForParty;
}
