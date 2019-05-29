import { query } from './utils';

export async function getProfileState() {
  const queryStr = `query {
    __type(name: "ProfileStateEnum") {
      enumValues {
        name
      }
    }
  }`;
  const response = await query(queryStr);
  return response.data.__type.enumValues.map(e => e.name);
}
