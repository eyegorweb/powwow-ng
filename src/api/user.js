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
        roles {
          name
          description
          category
        }
      }
    }
    `
  );

  return response.data.getCurrentUser;
}
