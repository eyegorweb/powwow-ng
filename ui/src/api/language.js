import { query } from './utils';

export async function setLanguage(lang) {
  const queryStr = `mutation {
    setLanguage(language:${lang})
  }
  `;

  const response = await query(queryStr);
  return response.data.setLanguage;
}
