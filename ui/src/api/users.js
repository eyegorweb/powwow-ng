import { query, getFilterValue, getFilterValues } from './utils';

export async function searchUsers(orderBy, pagination, filters = []) {
  const orderingInfo = orderBy ? `, sorting: {${orderBy.key}: ${orderBy.direction}}` : '';
  const paginationInfo = pagination
    ? `, pagination: {page: ${pagination.page}, limit: ${pagination.limit}}`
    : '';
  const queryStr = `
  {
    users(filter: {${formatFilters(filters)}}${paginationInfo}${orderingInfo}) {
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
          username
        }
        ... on UserParty {
          id
          email
          name {
            title
            firstName
            lastName
          }
          party {
            id
            name
          }
          disabled
        }
        ... on UserPartyGroup {
          id
          email
          PartyGroup {
            id
            name
          }
          name {
            title
            firstName
            lastName
          }
          username
        }
      }
    }
  }
  `;

  const response = await query(queryStr);
  return response.data.users;
}

export async function fetchPartnerGroups(q = '') {
  const queryStr = `
  query {
    partyGroups(name: {contains: "${q}"}) {
      name
      id
      parties {
        id
        name
        partyType
        code
      }
      roles {
        category
        name
      }
      flagStatisticsEnabled
    }
  }
  `;

  const response = await query(queryStr);
  return response.data.partyGroups;
}

export function formatFilters(selectedFilters) {
  const gqlFilters = [];

  addFullNameFilter(gqlFilters, selectedFilters);
  addEmailFilter(gqlFilters, selectedFilters);
  addPartnerGroupFilter(gqlFilters, selectedFilters);
  addLoginFilter(gqlFilters, selectedFilters);

  return gqlFilters.join(',');
}

function addFullNameFilter(gqlFilters, selectedFilters) {
  const fullName = getFilterValue(selectedFilters, 'getadmin.users.fullName');

  if (fullName) {
    gqlFilters.push(`fullname: {contains: "${fullName}"}`);
  }
}
function addEmailFilter(gqlFilters, selectedFilters) {
  const email = getFilterValue(selectedFilters, 'getadmin.users.email');

  if (email) {
    gqlFilters.push(`email: {contains: "${email}"}`);
  }
}
function addLoginFilter(gqlFilters, selectedFilters) {
  const login = getFilterValue(selectedFilters, 'getadmin.users.login');
  if (login) {
    gqlFilters.push(`fullnameOrLogin: {contains: "${login}"}`);
  }
}
function addPartnerGroupFilter(gqlFilters, selectedFilters) {
  const values = getFilterValues(selectedFilters, 'getadmin.users.partnerGroup');
  if (values && values.length) {
    const partnerGroups = values.map(p => `${p.id}`).join(',');
    gqlFilters.push(`groupId: {in: [${partnerGroups}]}`);
  }
}

// Depreciated
export async function fetchUsers(q, partners, { page, limit, partnerType }) {
  let partnersIds,
    partnerGqlParam = '';

  if (partners && partners.length > 0) {
    partnersIds = partners.map(i => `"${i.id}"`).join(',');
    partnerGqlParam = `, partyId:{in: [${partnersIds}]}`;
  }

  let partnerTypeGqlFilter = '';
  if (partnerType) {
    partnerTypeGqlFilter = `, partyType: {in: [${partnerType}]}`;
  }

  const queryStr = `
  query{
    users(filter:{fullname: {startsWith: "${q}"}${partnerGqlParam}${partnerTypeGqlFilter}}, pagination: {limit: ${limit}, page: ${page}}, sorting: {id: DESC}) {
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
