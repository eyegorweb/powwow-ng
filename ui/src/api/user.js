import { query } from './utils';

export async function fetchCurrentUserInfos() {
  const response = await query(
    `
    query {
      getCurrentUser {
        id
        name {
          title
          firstName
          lastName
        }
        email
        username
        partners {
          id
          name
          partyType
          flagMsisdnA
          optionViewCellId
          mailingLists {
            id
            name
            emails
            __typename
          }
        }
        partyGroup {
          id
          name
        }
        type
        isAdminOrBackOffice
        disabled
        roles {
          Id
          name
          description
          category
          scope
        }
        permissions {
          domain
          action
        }
      }
    }
    `
  );

  if (response && response.data) {
    return response.data.getCurrentUser;
  }
  return undefined;
}
