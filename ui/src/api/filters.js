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

  return query(
    `
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
  }`,
    { sorting, filters }
  ).then(res =>
    res.data.countries.countries.map(country => ({
      name: country[key],
      code: country.code,
      codeIso3: country.codeIso3,
      id: country.id,
      latitude: country.latitude,
      longitude: country.longitude,
    }))
  );
}

export async function fetchFilters(module) {
  const queryStr = `query GetFiltersModule($module: ModuleEnum!) {
    getFiltersModule(module: $module) {
      id
      name
      filter
      userId
      created
    }
  }`;

  const response = await query(queryStr, {
    module,
  });
  return response.data.getFiltersModule;
}

export async function createFilter(name, module, filter) {
  const queryStr = `mutation CreateFilterModule($input: FilterModuleInput) {
    createFilterModule(input: $input) {
      id
      name
      filter
      userId
      created
    }
  }`;

  const response = await query(queryStr, {
    input: { name, module, filter },
  });
  return response.data.createFilterModule;
}

export async function deleteFilter(filterModuleId) {
  const queryStr = `mutation DeleteFilterModule($filterModuleId: Long) {
    deleteFilterModule(filterModuleId: $filterModuleId)
  }`;

  const response = await query(queryStr, {
    filterModuleId,
  });
  return response.data.deleteFilterModule;
}
