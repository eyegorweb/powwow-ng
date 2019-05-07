import { query } from './utils';

export async function fetchCurrentUserInfos() {
  const response = await query(
    `
    query {
      getCurrentUser {
        ... on User {
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
