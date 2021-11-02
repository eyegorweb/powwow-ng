import axios from 'axios';
import { getBaseURL } from '@/utils.js';

export const api = axios.create();

const targetUrl = getBaseURL();

const publicApiSimTypes = axios.create({
  baseURL: targetUrl,
});

export function fetchSimTypes() {
  return publicApiSimTypes.get('/api/public/digital-offer/sim').then((res) => res.data.items);
}
