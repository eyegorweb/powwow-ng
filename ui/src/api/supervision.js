import { query } from './utils';

export async function supervisionDataGraph(partyIds) {
  const queryStr = `
  query {
    supervisionDataGraph(supervisionType:MONTH, params:{partyIds:[${partyIds.join(',')}]}) {
     date
     upload
     download
     numberRequests
     numberTraffSims
     numberRequestsOpening
   }
 }`;
  const response = await query(queryStr);
  return response.data.supervisionDataGraph;
}

export async function supervisionSmsGraph(partyIds) {
  const queryStr = `
  query {
    supervisionSmsGraph(supervisionType:MONTH, params:{partyIds:[${partyIds.join(',')}]}) {
      date
      numberOfSentSMS
      numberOfReceivedSMS
      numberOfTraffSims
    }
  }
  `;
  const response = await query(queryStr);
  return response.data.supervisionSmsGraph;
}

export async function supervisionVoiceGraph(partyIds) {
  const queryStr = `
  query {
    supervisionVoiceGraph(supervisionType:MONTH params:{partyIds:[${partyIds.join(',')}]}) {
      date
      volumeIn
      volumeOut
      numberCallsIn
      numberCallsOut
      numberTraffSims
    }
  }
  `;
  const response = await query(queryStr);
  return response.data.supervisionVoiceGraph;
}
