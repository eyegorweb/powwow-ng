import { query } from './utils';

export async function getManagementActTypes() {
  const queryStr = `query {
    __type(name: "ActionTypeSearchEnum") {
        enumValues{name}
      }
  }`;
  const response = await query(queryStr);
  return response.data.__type.enumValues.map(e => e.name);
}
