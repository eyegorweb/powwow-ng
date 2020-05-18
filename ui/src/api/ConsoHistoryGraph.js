import { query } from './utils';

export async function fetchConsoHistory() {
  const queryStr = `query {
    consumptionHistory(partyId:2 usage:SMS) {
      partyId
      dataConsoFrIn {
        consumptionDate
        consumptionValue
      }
      dataConsoFrOut {
        consumptionDate
        consumptionValue
      }
      dataConsoRoamingIn {
        consumptionDate
        consumptionValue
      }
      dataConsoRoamingOut {
        consumptionDate
        consumptionValue
      }

      voiceConsoFrIn {
        consumptionDate
        consumptionValue
      }
      voiceConsoFrOut {
        consumptionDate
        consumptionValue
      }
      voiceConsoRoamingIn {
        consumptionDate
        consumptionValue
      }
      voiceConsoRoamingOut {
        consumptionDate
        consumptionValue
      }

      smsConsoFrIn {
        consumptionDate
        consumptionValue
      }
      smsConsoFrOut {
        consumptionDate
        consumptionValue
      }
      smsConsoRoamingIn {
        consumptionDate
        consumptionValue
      }
      smsConsoRoamingOut {
        consumptionDate
        consumptionValue
      }


    }


    }

  `;
  const response = await query(queryStr);
  return response.data.fetchConsoHistory;
}
