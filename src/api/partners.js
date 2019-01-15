import { query } from './utils';

export async function fetchpartners(q, { page, limit }) {
  const queryStr = `
  query{
    partys(filter:{name: {contains: "${q}"}}, pagination: {limit: ${limit}, page: ${page}}, sorting: {id: DESC}) {
      total,
      items {
        id
        code
        name
      }
    }
  }
  `;
  const response = await query(queryStr);
  return response.data.partys.items;
}
