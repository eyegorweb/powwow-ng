import { query } from './utils';

export async function getActStatuses() {
  const queryStr = `query {
      __type(name: "MassActionStatusEnum") {
        enumValues {
          name
        }
      }
  }`;
  const response = await query(queryStr);
  return response.data.__type.enumValues.map(e => e.name);
}
