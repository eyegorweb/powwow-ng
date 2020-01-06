import { query } from './utils';

export async function getManagementActTypes() {
  const queryStr = `query{
    actionType: getActionTypeSearch {
      code
      label
    }
  }`;
  const response = await query(queryStr);
  return response.data.actionType;
}
