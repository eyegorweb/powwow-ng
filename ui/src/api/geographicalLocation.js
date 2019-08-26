import { query } from './utils';

export async function lastGeographicalLocation(simCardInstanceId) {
  const response = await query(
    `
  query {
    lastGeographicalLocation(simCardInstanceId: ${simCardInstanceId}) {
      geographicalCoordinates
      celluleID
      lastCommunicationDate
      usageDetailsByDirection
      ticketGeneration
    }
  }
    `
  );
  return response.data.lastGeographicalLocation;
}
