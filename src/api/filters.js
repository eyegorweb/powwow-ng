import { query } from './utils';
import { capitalize } from 'lodash-es';

export async function fetchPartners(filter, pagination) {
  const paginationInfo = pagination
    ? `, pagination: {page: ${pagination.page}, limit: ${pagination.limit}}`
    : '';
  const response = await query(`
  query {
    partners(q: '${filter}'${paginationInfo}) {
      id
      name
    }
  }`);
  return response.data.partners;
}

export async function fetchDeliveryCountries(locale) {
  // fr -> nameFr
  const key = 'name' + capitalize(locale);

  return query(`
  query {
    countries(sorting: {${key}: ASC}) {
      total
      countries {
        id
        code
        ${key}
      }
    }
  }`).then(res =>
    res.data.countries.countries.map(country => ({
      name: country[key],
      code: country.code,
      id: country.id,
    }))
  );
}
