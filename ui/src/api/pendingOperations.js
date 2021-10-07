import { query } from './utils';

export async function fetchPendingOperations() {
  const queryStr = `query {
    asyncOperationResponses {
      requestId
      successMessage
      finished
      exportFile
      taskType
      errorMessage
  
    }
}`;

  const response = await query(queryStr);


  if (response && response.errors) {
    return { errors: response.errors };
  }

  return response.data.asyncOperationResponses;
}

export async function deleteBackgroundOperation(requestId) {
  const queryStr = `mutation {
    deleteBackgroundOperation (requestId: "${requestId}")
}`;
  return await query(queryStr);
}
