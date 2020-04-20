import { query, getFilterValue, getFilterValues, getValuesIdsWithoutQuotes } from './utils';

export async function fetchUserByUsername(username) {
  const orderBy = { key: 'id', direction: 'DESC' };
  const pagination = { page: 0, limit: 1 };
  const filters = [
    {
      id: 'getadmin.users.filters.userName',
      value: username,
    },
  ];
  const response = await searchUsers(orderBy, pagination, filters);
  if (response.items && response.items.length) return response.items[0];
}

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
        id
        type
        email
        username
        name {
          title
          firstName
          lastName
        }
        disabled
        permissions {
          domain
          action
        }
        partners {
          name
          id
        }
        roles {
          Id
          name
          description
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
  addUserNameFilter(gqlFilters, selectedFilters);
  addEmailFilter(gqlFilters, selectedFilters);
  addPartnerGroupFilter(gqlFilters, selectedFilters);
  addLoginFilter(gqlFilters, selectedFilters);
  addPartnerFilter(gqlFilters, selectedFilters);

  return gqlFilters.join(',');
}

function addFullNameFilter(gqlFilters, selectedFilters) {
  const fullName = getFilterValue(selectedFilters, 'getadmin.users.filters.fullName');

  if (fullName) {
    gqlFilters.push(`fullname: {contains: "${fullName}"}`);
  }
}
function addUserNameFilter(gqlFilters, selectedFilters) {
  const userName = getFilterValue(selectedFilters, 'getadmin.users.filters.userName');

  if (userName) {
    gqlFilters.push(`username: {contains: "${userName}"}`);
  }
}
function addEmailFilter(gqlFilters, selectedFilters) {
  const email = getFilterValue(selectedFilters, 'getadmin.users.filters.email');

  if (email) {
    gqlFilters.push(`email: {contains: "${email}"}`);
  }
}
function addLoginFilter(gqlFilters, selectedFilters) {
  const login = getFilterValue(selectedFilters, 'getadmin.users.filters.login');
  if (login) {
    gqlFilters.push(`fullnameOrLogin: {contains: "${login}"}`);
  }
}
function addPartnerGroupFilter(gqlFilters, selectedFilters) {
  const values = getFilterValues(selectedFilters, 'getadmin.users.filters.partnerGroup');
  if (values && values.length) {
    const partnerGroups = values.map(p => `${p.id}`).join(',');
    gqlFilters.push(`groupId: {in: [${partnerGroups}]}`);
  }
}

function addPartnerFilter(gqlFilters, selectedFilters) {
  const partyIds = getValuesIdsWithoutQuotes(selectedFilters, 'getadmin.users.filters.partners');
  if (partyIds) {
    gqlFilters.push(`partyId: {in: [${partyIds}]}`);
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
