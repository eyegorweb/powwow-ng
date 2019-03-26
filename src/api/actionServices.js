import { query } from './utils';

export async function getActionServices() {
  const queryStr = `query {
    __type(name: "ActionServiceEnum") {
      enumValues {
        name
      }
    }
  }`;
  const response = await query(queryStr);
  return response.data.__type.enumValues.map(e => e.name);
}
