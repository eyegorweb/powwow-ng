import { query } from './utils';

export async function fetchUsers(q, partners, { page, limit, partnerTypes }) {
  let partnersIds,
    partnerGqlParam = '';

  if (partners && partners.length > 0) {
    partnersIds = partners.map(i => `"${i.id}"`).join(',');
    partnerGqlParam = `, partyId:{in: [${partnersIds}]}`;
  }

  let partnerTypesGqlFilter = '';
  if (partnerTypes && partnerTypes.length) {
    const ids = partnerTypes.map(p => `${p.id}`).join(',');
    partnerTypesGqlFilter = `, partyType: {in: [${ids}]}`;
  }

  const queryStr = `
  query{
    users(filter:{fullname: {contains: "${q}"}${partnerGqlParam}${partnerTypesGqlFilter}}, pagination: {limit: ${limit}, page: ${page}}, sorting: {id: DESC}) {
      total
      items {
        __typename
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
      }
    }
  }
  `;

  const response = await query(queryStr);
  return response.data.users.items;
}
