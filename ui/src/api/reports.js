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
        disabled
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

export async function enableReport(reportId) {
  const response = await query(`mutation{activateReportDefinition (reportId : ${reportId}){id}}`);
  if (response.data) return response.data.activateReportDefinition;
}

export async function disableReport(reportId) {
  const response = await query(`mutation{disableReportDefinition (reportId : ${reportId}){id}}`);
  if (response.data) return response.data.disableReportDefinition;
}
