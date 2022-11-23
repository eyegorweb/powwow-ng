import axios from 'axios';
import { getBaseURL } from '@/utils.js';

const address = axios.create({
  baseURL: 'https://api-adresse.data.gouv.fr',
});

export function searchAddress(q) {
  // evite une erreur dans l'appel api
  if (!q) return Promise.resolve([]);
  // lance la recherche à partir du troisième caractère (pour éviter des erreurs 400 internes à l'api)
  q = q.trim();
  if (q && q.length > 2) {
    return (
      address
        .get('/search', { params: { q } })
        // TODO faire une fonction qui mape vers une version qui ressemble à ce qu'on a en BDD
        .then((res) => res.data.features.map((f) => f.properties))
    );
  }
}

// Public API exposed for countries
const authURL = getBaseURL();
const publicApiCountries = axios.create({
  baseURL: authURL,
});
export function fetchCountries() {
  return publicApiCountries.get('/api/public/digital-offer/countries').then((res) => res.data);
}
