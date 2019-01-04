// Comptes de facturation
// MOCK temporaire en attendant l'api du backend
import { delay } from './utils';

export async function fetchOffers(q, partners, pagination) {
  const qlowercase = q.toLowerCase();
  const filtered = mockData.filter(i => i.label.toLowerCase().includes(qlowercase));
  const groups = groupItems(filtered, pagination.limit);
  if (groups.length === 0) return [];
  await delay(300);
  return groups[pagination.page - 1];
}

function groupItems(items, size) {
  var result = [];

  for (let i = 0, j = items.length; i < j; i += size) {
    result.push(items.slice(i, i + size));
  }
  return result;
}

export var mockData = [
  {
    id: 1,
    label: 'Offre 1 - Neptide',
    partnerId: 1,
  },
  {
    id: 2,
    label: 'Offre 2 - Neptide',
    partnerId: 1,
  },
  {
    id: 3,
    label: 'Offre 1 - Eschoir',
    partnerId: 2,
  },
  {
    id: 4,
    label: 'Offre 2 - Eschoir',
    partnerId: 2,
  },
];
