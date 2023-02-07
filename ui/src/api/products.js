import { query } from './utils';

export async function fetchSim(partnerId, customerAccountId, simCategoryFilter, allSim) {
  const response = await query(
    `
  query FindLatestSimcardsOrder($partnerId: Long!,$customerAccountId: Long, $simCategoryFilter: SIMCardCategoryFilterInput) {
    findLatestSimcardsOrder(pagination: {page: 0, limit: 999}, sorting: {orderDate: DESC}, partyId: $partnerId, customerAccountId: $customerAccountId, SimCategoryFilter: $simCategoryFilter, allSimCards: ${allSim}) {
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
          family
        }
        disabled
      }
    }
  }
    `,
    { partnerId, customerAccountId, simCategoryFilter }
  );

  return response.data.findLatestSimcardsOrder.items;
}

export async function getAvailableSim(partnerId, pagination) {
  const response = await query(
    `
    query{
      getAvailableSim(availableSimFilterInput: {partyId: ${partnerId}}, pagination: { page: ${pagination.page}, limit: ${pagination.limit}}){
        total
        items{
          orderDate
          simCard {
            id
            gencode
            code
            name
            label
            type
            help
            format
            licence
            number
            electricProfile {
              name
            }
            graphicProfile {
              label
            }
            hardwareType {
              name
            }
            category
            description
          }
          disabled
        }
      }
    }
    `
  );

  if (response && response.errors) {
    return { errors: response.errors };
  }

  return response.data.getAvailableSim.items;
}

export async function updateSimsOnParty(partnerId, simCards) {
  const response = await query(
    `
    mutation {
      updateSimsOnParty(
        partnerId: ${partnerId}
        simcardIds: [${simCards}]
      )
    }

    `
  );

  return response.data.updateSimsOnParty;
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

export async function enableSimCard(partnerId, simId) {
  const response = await query(
    `
      mutation{
        enableSimForParty(partnerId: ${partnerId}, simcardId: ${simId})
      }
    `
  );

  return response.data.disableSimForParty;
}
