import { query } from './utils';

export async function fetchCurrentUserInfos() {
  const response = await query(
    `
    query {
      getCurrentUser {
        ... on User {
          id
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
        ... on UserParty {
          id
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
          party {
            id
            name
            code
          }
        }
        ... on UserPartyGroup {
          id
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
        ... on Node {
          __typename
        }
      }
    }
    `
  );

  return response.data.getCurrentUser;
}
