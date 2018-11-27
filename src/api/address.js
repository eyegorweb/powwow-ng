import axios from 'axios';

const address = axios.create({
  baseURL: 'https://api-adresse.data.gouv.fr',
});

export function searchAddress(q) {
  // evite une erreur dans l'appel api
  if (!q) return Promise.resolve([]);

  return (
    address
      .get('/search', { params: { q } })
      // TODO faire une fonction qui mape vers une version qui ressemble à ce qu'on a en BDD
      .then(res => res.data.features.map(f => f.properties))
  );
}
