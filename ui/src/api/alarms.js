import { query } from './utils';

export async function getAlarmEvents(filter) {
  let filterObject = {
    searchBy: filter.searchBy,
    id: filter.id,
  };

  const queryStr = `
  query {
    alarmEvents(searchBy: ${filterObject.searchBy}, id: ${filterObject.id}) {
      id
      emissionDate
      alarm {
        id
        type
        party {
          id
          name
        }
      }
    }
  }
  `;

  const response = await query(queryStr);
  return response.data.alarmEvents;
}
