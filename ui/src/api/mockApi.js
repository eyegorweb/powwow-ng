/**
 * API mockée utilisée pour les composants en attente d'API
 */

import uuid from 'uuid/v1';

export async function fetchData(orderBy, pagination, filters = []) {
  console.log('Fetch data for: ', orderBy, pagination, filters);

  const mockData = [];

  for (let i = 0; i < 20; i++) {
    mockData.push({
      id: i,
      name: 'mock ' + uuid().split('-')[0],
    });
  }

  const total = mockData.length;

  const startIndex = pagination.page * pagination.limit;

  let data = [];

  if (startIndex < total) {
    data = mockData.slice(
      pagination.page * pagination.limit,
      (pagination.page + 1) * pagination.limit
    );
  }

  return {
    total,
    data,
  };
}
