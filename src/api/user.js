import { query } from './utils';

export async function fetchCurrentUserInfos() {
  const response = await query(
    `
    query {
      getCurrentUser{
        email
        name {
          title
          firstName
          lastName
        }
      }
    }
    `
  );

  return response.data.getCurrentUser;
}
