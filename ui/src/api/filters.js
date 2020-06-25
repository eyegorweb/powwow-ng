import { query } from './utils';
import capitalize from 'lodash/capitalize';

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

export async function fetchDeliveryCountries(locale, filters = {}) {
  // fr -> nameFr
  const key = 'name' + capitalize(locale);
  const sorting = {};

  sorting[key] = 'ASC';

  return query(`
  query Countries($filters: CountryFilterInput, $sorting: CountrySorting!) {
    countries(sorting: $sorting, filter: $filters) {
      total
      countries {
        id
        code
        codeIso3
        latitude
        longitude
        ${key}
      }
    }
  }`, {sorting, filters}).then(res =>
    res.data.countries.countries.map(country => ({
      name: country[key],
      code: country.code,
      codeIso3: country.codeIso3,
      id: country.id,
      latitude: country.latitude,
      longitude: country.longitude
    }))
  );
}
