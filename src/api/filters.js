import { query } from './utils';

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
