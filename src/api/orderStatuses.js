// MOCK temporaire en attendant l'api du backend
export async function fetchOrderStatuses() {
  return mockData;
}

const mockData = [
  {
    label: 'En attente de validation',
    checked: false,
    id: 0,
  },
  {
    label: 'Validée',
    checked: true,
    id: 1,
  },
  {
    label: 'En cours de validation',
    checked: false,
    id: 2,
  },
];
