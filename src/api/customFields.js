// MOCK temporaire en attendant l'api du backend
import { delay } from './utils';

export async function fetchCustomFields() {
  await delay(300);
  return mockData;
}

export var mockData = [
  {
    label: 'Champ libre 1',
    id: 0,
    type: 'input',
    value: '0041 - Marketing',
  },
  {
    label: 'Référence projet [facultatif]',
    id: 1,
    type: 'listchoices',
    value: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
  },
  {
    label: 'Champ libre 3',
    id: 2,
    type: 'date',
  },
];
