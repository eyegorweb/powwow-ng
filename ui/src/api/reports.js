import { query } from './utils';

export async function fetchReports(orderBy, pagination, partnerID, creator) {
  const orderingInfo = orderBy ? `, sorting: {${orderBy.key}: ${orderBy.direction}}` : '';
  const paginationInfo = pagination
    ? `, pagination: {page: ${pagination.page}, limit: ${pagination.limit}}`
    : '';
  let partnerIdParam = '';
  let reportParams = '';
  if (partnerID) {
    partnerIdParam = `partyId: ${partnerID}`;
  }
  if (creator) {
    reportParams = `,creatorId: ${creator}`;
  }
  const queryStr = `
  query {
    reportDefinitionsV2(
      filter: {${partnerIdParam} ${reportParams}}
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
        generationStatus
        notification
        disabled
        auditable {
          creator {
            id
            name {
              title
              firstName
              lastName
            }
            username
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

  return response.data.reportDefinitionsV2;
}

export async function enableReport(reportId) {
  const response = await query(`mutation{activateReportDefinition (reportId : ${reportId}){id}}`);
  if (response.data) return response.data.activateReportDefinition;
}

export async function disableReport(reportId) {
  const response = await query(`mutation{disableReportDefinition (reportId : ${reportId}){id}}`);
  if (response.data) return response.data.disableReportDefinition;
}
