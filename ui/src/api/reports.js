import { query } from './utils';

export async function fetchReports(orderBy, pagination, partnerID) {
  const orderingInfo = orderBy ? `, sorting: {${orderBy.key}: ${orderBy.direction}}` : '';
  const paginationInfo = pagination
    ? `, pagination: {page: ${pagination.page}, limit: ${pagination.limit}}`
    : '';
  let partnerIdParam = '';

  if (partnerID) {
    partnerIdParam = `partyId: ${partnerID}`;
  }

  const queryStr = `
  query {
    reportDefinitions(
      ${partnerIdParam}
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
        auditable {
          creator {
            name {
              title
              firstName
              lastName
            }
            email
          }
        }
        party {
          id
          name
        }
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
