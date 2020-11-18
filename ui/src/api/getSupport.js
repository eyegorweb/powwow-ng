import { query } from './utils';

export async function getAccessToGetSupport(getSupportPage) {
  const queryStr = `query GetAccessToGetSupport($getSupportPage: GetSupportPageEnum!) {
    getAccessToGetSupport(page: $getSupportPage)
  }
  `;

  const response = await query(queryStr, { getSupportPage });
  if (response && response.data && response.data.getAccessToGetSupport) {
    return response.data.getAccessToGetSupport;
  }
}
