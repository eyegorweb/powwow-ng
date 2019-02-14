import { delay } from './utils';
import { query } from './utils';

// MOCK temporaire en attendant l'api du backend
export async function fetchSim() {
  await delay(200);

  return mockData;
}

const mockData = [
  {
    id: 76,
    iccid: '8933215898343692617',
    type: 'M2M sim antivol avec code pin',
    accessPoint: null,
  },
];

export async function fetchSim2() {
  const response = await query(
    `
    query {
      findAllSimcards {
        id
        iccid
        type
        accessPoint {
          id
          commercialStatus
        }
      }
    }
    `
  );

  return response.data.findAllSimcards;
}
