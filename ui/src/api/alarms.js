import { query } from './utils';

export async function fetchAlarmInstancesByAP(id) {
  const queryStr = `
  query {
    alarmInstances(searchBy: ACCESSPOINT_ID, id: ${id}) {
      id
      alarm {
        id
        type
        level1
        level1Up
        level1Down
        level2
        level2Up
        level2Down
        level3
        level3Up
        level3Down
        startDate
        party {
          id
          name
        }
      }
    }
  }
  `;

  const response = await query(queryStr);
  return response.data.alarmInstances;
}

export async function fetchAlarmsWithInfos(simCardInstanceId) {
  const queryStr = `
  query {
    alarmsWithInfo(simCardInstanceId: ${simCardInstanceId}) {
      isTriggered
      isActive
      alarm {
        id
        startDate
        expiryDate
        type
        party {
          id
          name
          partyType

        }
        observationDelay
        name
        level1
        level1Up
        level1Down
        level2
        level2Up
        level2Down
        level3
        level3Up
        level3Down
        observationCycle
        alarmScope
      }
    }
  }
  `;

  const response = await query(queryStr);
  return response.data.alarmsWithInfo;
}
