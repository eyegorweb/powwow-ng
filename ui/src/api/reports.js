import { query } from './utils';

export async function fetchReports(orderBy, pagination, partnerID) {
  const orderingInfo = orderBy ? `, sorting: {${orderBy.key}: ${orderBy.direction}}` : '';
  const paginationInfo = pagination
    ? `, pagination: {page: ${pagination.page}, limit: ${pagination.limit}}`
    : '';
  const queryStr = `
  query {
    reportDefinitions(
      partyId: ${partnerID}
      ${paginationInfo}${orderingInfo}
    ) {
      total
      items {
        id
        name
        frequency
        fields
        privateReport
        generationDate
        generatedReports
        exportFormat
        notification
        mailingList {
          id
          name
          emails
          }
        }
      }
    }
  `;

  const response = await query(queryStr);

  return response.data.reportDefinitions;
}
