import { query } from './utils';

export async function getManufacturers() {
  const queryStr = `{
    getManufacturers(pagination:{page: 0, limit: 999}) {
      total
      items {
        manufacturer
        marketingName
      }
    }
  }`;

  const response = await query(queryStr);

  if (response && response.data) {
    return response.data.getManufacturers.items;
  }
}
