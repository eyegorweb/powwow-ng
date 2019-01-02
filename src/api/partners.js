// MOCK temporaire en attendant l'api du backend
import { delay } from './utils';

export async function fetchpartners(q, pagination) {
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
    label: 'Duflex',
    id: 0,
  },
  {
    label: 'Neptide',
    id: 1,
  },
  {
    label: 'Eschoir',
    id: 2,
  },
  {
    label: 'Comtrek',
    id: 3,
  },
  {
    label: 'Speedbolt',
    id: 4,
  },
  {
    label: 'Olympix',
    id: 5,
  },
  {
    label: 'Navir',
    id: 6,
  },
  {
    label: 'Geekfarm',
    id: 7,
  },
  {
    label: 'Aquafire',
    id: 8,
  },
  {
    label: 'Zaj',
    id: 9,
  },
  {
    label: 'Lunchpad',
    id: 10,
  },
  {
    label: 'Bunga',
    id: 11,
  },
  {
    label: 'Cincyr',
    id: 12,
  },
  {
    label: 'Insurity',
    id: 13,
  },
  {
    label: 'Polarax',
    id: 14,
  },
  {
    label: 'Injoy',
    id: 15,
  },
  {
    label: 'Bizmatic',
    id: 16,
  },
  {
    label: 'Comtour',
    id: 17,
  },
  {
    label: 'Shadease',
    id: 18,
  },
  {
    label: 'Circum',
    id: 19,
  },
  {
    label: 'Xylar',
    id: 20,
  },
  {
    label: 'Aeora',
    id: 21,
  },
  {
    label: 'Zensure',
    id: 22,
  },
  {
    label: 'Emoltra',
    id: 23,
  },
  {
    label: 'Comtrak',
    id: 24,
  },
  {
    label: 'Powernet',
    id: 25,
  },
  {
    label: 'Enomen',
    id: 26,
  },
  {
    label: 'Kaggle',
    id: 27,
  },
  {
    label: 'Securia',
    id: 28,
  },
  {
    label: 'Recritube',
    id: 29,
  },
  {
    label: 'Exosis',
    id: 30,
  },
  {
    label: 'Stockpost',
    id: 31,
  },
  {
    label: 'Sustenza',
    id: 32,
  },
  {
    label: 'Comveyor',
    id: 33,
  },
  {
    label: 'Geofarm',
    id: 34,
  },
  {
    label: 'Caxt',
    id: 35,
  },
  {
    label: 'Netropic',
    id: 36,
  },
  {
    label: 'Hairport',
    id: 37,
  },
  {
    label: 'Plutorque',
    id: 38,
  },
  {
    label: 'Xymonk',
    id: 39,
  },
  {
    label: 'Dancerity',
    id: 40,
  },
  {
    label: 'Uni',
    id: 41,
  },
  {
    label: 'Gushkool',
    id: 42,
  },
  {
    label: 'Unia',
    id: 43,
  },
  {
    label: 'Cinesanct',
    id: 44,
  },
  {
    label: 'Blurrybus',
    id: 45,
  },
  {
    label: 'Liquicom',
    id: 46,
  },
  {
    label: 'Grok',
    id: 47,
  },
  {
    label: 'Straloy',
    id: 48,
  },
  {
    label: 'Concility',
    id: 49,
  },
  {
    label: 'Manglo',
    id: 50,
  },
  {
    label: 'Kozgene',
    id: 51,
  },
  {
    label: 'Interloo',
    id: 52,
  },
  {
    label: 'Supremia',
    id: 53,
  },
  {
    label: 'Talkola',
    id: 54,
  },
  {
    label: 'Mangelica',
    id: 55,
  },
  {
    label: 'Rockabye',
    id: 56,
  },
  {
    label: 'Velity',
    id: 57,
  },
  {
    label: 'Xleen',
    id: 58,
  },
  {
    label: 'Quiltigen',
    id: 59,
  },
  {
    label: 'Ginkogene',
    id: 60,
  },
  {
    label: 'Digial',
    id: 61,
  },
  {
    label: 'Zidox',
    id: 62,
  },
  {
    label: 'Zaphire',
    id: 63,
  },
  {
    label: 'Comtent',
    id: 64,
  },
  {
    label: 'Photobin',
    id: 65,
  },
  {
    label: 'Kidstock',
    id: 66,
  },
  {
    label: 'Immunics',
    id: 67,
  },
  {
    label: 'Paragonia',
    id: 68,
  },
  {
    label: 'Talae',
    id: 69,
  },
  {
    label: 'Atgen',
    id: 70,
  },
  {
    label: 'Slax',
    id: 71,
  },
  {
    label: 'Qiao',
    id: 72,
  },
  {
    label: 'Kraggle',
    id: 73,
  },
  {
    label: 'Pushcart',
    id: 74,
  },
  {
    label: 'Comtest',
    id: 75,
  },
  {
    label: 'Bleendot',
    id: 76,
  },
  {
    label: 'Paprikut',
    id: 77,
  },
  {
    label: 'Cipromox',
    id: 78,
  },
  {
    label: 'Cinaster',
    id: 79,
  },
  {
    label: 'Twiist',
    id: 80,
  },
  {
    label: 'Zytrax',
    id: 81,
  },
  {
    label: 'Electonic',
    id: 82,
  },
  {
    label: 'Quarmony',
    id: 83,
  },
  {
    label: 'Menbrain',
    id: 84,
  },
  {
    label: 'Viasia',
    id: 85,
  },
  {
    label: 'Overfork',
    id: 86,
  },
  {
    label: 'Kyagoro',
    id: 87,
  },
];
