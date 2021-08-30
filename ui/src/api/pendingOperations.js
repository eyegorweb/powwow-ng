import { query } from './utils';

export async function fetchPendingOperations() {
  const queryStr = `query {
  mapExports {
    downloadUri
    total
  }
}`;

  const response = await query(queryStr);

  if (response && response.data && response.data.mapExports) {
    return response.data.mapExports;
  }

  return undefined;
}
