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

export function fetchSimTypesWhithParty(partyId) {
  const simUrl = '/api/public/digital-offer/sim?partyId=' + partyId;
  return publicApiRoute.get(simUrl).then((res) => res.data.items);
}

export function createDigitalOffer(formData, token) {
  const config = {
    headers: {
      Authorization: token,
    },
  };
  try {
    const response = publicApiRoute
      .post('/api/public/digital-offer/create', formData, config)
      .then((res) => res.data);
    return response;
  } catch (e) {
    console.error(e);
    return {
      errors: [{ code: 'API_ERROR', message: 'API Error lors de la création de compte' }],
    };
  }
}

export function validateAccount(paymentId, status) {
  const dynamicValidPayment = '/api/public/digital-offer/validate/' + paymentId + '/' + status;
  try {
    const response = publicApiRoute.post(dynamicValidPayment).then((res) => res.data);
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

export function validatePartner(fields) {
  try {
    const response = publicApiRoute
      .post('/api/public/digital-offer/validateInput', fields)
      .then((res) => {
        return res.data;
      });
    return response;
  } catch (e) {
    console.error(e);
    return {
      errors: [
        { code: 'API_ERROR', message: 'API Error lors de la validation de création du partenaire' },
      ],
    };
  }
}
