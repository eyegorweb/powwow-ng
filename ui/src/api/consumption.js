import { query } from './utils';

export async function fetchVoiceConsumption(simInstanceId) {
  const queryStr = `{
    smsConsumptionGraph(simCardInstanceId: ${simInstanceId}) {
      date
      numberOfSentSMS
      numberOfReceivedSMS
    }
  }
  `;
  const response = await query(queryStr);

  return response.data.smsConsumptionGraph;
}
