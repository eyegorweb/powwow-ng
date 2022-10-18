import { query } from './utils';

export async function setLanguage(lang) {
  const queryStr = `mutation {
    setLanguage(language:${lang})
  }
  `;

  const response = await query(queryStr);
  return response.data.setLanguage;
}

export async function fetchAllLanguages() {
  const queryStr = `query {
    getAvailableLanguages {
      language
      label
    }
  }
  `;

  const response = await query(queryStr);
  // const response2 = {
  //   errors: [
  //     {
  //       message: 'Access denied for the current user',
  //       extensions: {
  //         user: 'CUSTOMER_ACCOUNT_USER_NOT_ALLOWED',
  //         classification: 'ExecutionAborted',
  //       },
  //     },
  //   ],
  //   data: null,
  // };
  if (response.errors) {
    return {
      errors: response.errors,
    };
  }
  return response.data.getAvailableLanguages;
}
