import axios from 'axios';
import { getBaseURL } from '@/utils.js';

export const api = axios.create();

const targetUrl = getBaseURL();

const publicApiRoute = axios.create({
  baseURL: targetUrl,
});

export function fetchSimTypes() {
  return publicApiRoute.get('/api/public/digital-offer/sim').then((res) => res.data.items);
}

export function createDigitalOffer(formData) {
  try {
    const response = publicApiRoute
      .post('/api/public/digital-offer/create', formData)
      .then((res) => res.data);
    return response;
  } catch (e) {
    console.error(e);
    return {
      errors: [{ code: 'API_ERROR', message: 'API Error lors de la création de compte' }],
    };
  }
}

export function validateAccount(paymentId) {
  const dynamicValidURL = '/api/public/digital-offer/validate/' + paymentId;
  try {
    const response = publicApiRoute.post(dynamicValidURL).then((res) => res.data);
    return response;
  } catch (e) {
    console.error(e);
    return {
      errors: [
        { code: 'API_ERROR', message: 'API Error lors de la validation de création de compte' },
      ],
    };
  }
}

export function fetchWorkflows() {
  return publicApiRoute.get('/api/public/digital-offer/workflows').then((res) => res.data.items);
}
