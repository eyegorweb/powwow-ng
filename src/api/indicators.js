import { query } from './utils';

export async function fetchGetSimIndicators() {
  const response = await query(
    `
    query{
      ordersIndicators {
        ordersToBeConfirmed
        ordersInProgress
        ordersNotConfirmed
        ordersFailed
        averageProcessingTime
        orderToBeConfirmedByBO
      }
    }
    `
  );

  return response.data.ordersIndicators;
}
