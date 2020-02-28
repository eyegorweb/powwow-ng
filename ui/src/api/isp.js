import { query } from './utils';

export async function fetchIsps() {
  const queryStr = `query{
    medinaCountriesPLMN(filters:{}, pagination: {page: 0, limit: 999},  sorting:{operator:ASC})
    {
      total
      items{
        id
        operator
      }
    }
  }

  `;
  const response = await query(queryStr);

  return response.data.medinaCountriesPLMN;
}
