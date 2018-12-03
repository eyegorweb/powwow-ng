import { query } from './utils';

export async function fetchPossibleFilters() {
  const response = await query(`
  query {
    availableFilters {
      name
      type
      title
      values {
        label
        code
      }
    }
  }`);

  return response.data.availableFilters;
}
