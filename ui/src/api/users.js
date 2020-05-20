import { query, getFilterValue, getFilterValues, getValuesIdsWithoutQuotes } from './utils';

export async function fetchAllowedRoles(userId, partyId, partyGroupId) {
  let partyGroupParam = '';
  if (partyGroupId) {
    partyGroupParam = `partyGroupId: ${partyGroupId},`;
  }

  let partyParam = '';
  if (partyId) {
    partyParam = `partyId: ${partyId},`;
  }
  const queryStr = `query {
    userAllowedRoles(userId: ${userId}, withWS: false, ${partyParam} ${partyGroupParam}) {
      Id
      name
      description
      category
      scope
    }
  }`;

  const response = await query(queryStr);
  return response.data.userAllowedRoles;
}

export async function deactivateUser(id) {
  const queryStr = `mutation { deactivateUser(userId: ${id}) }`;

  const response = await query(queryStr);
  return response.data.deactivateUser;
}

export async function createUser(params) {
  let partyGroupParam = '';
  if (params.partyGroupId) {
    partyGroupParam = `partyGroupId: ${params.partyGroupId},`;
  }

  let partyParam = '';
  if (params.partyId) {
    partyParam = `partyId: ${params.partyId},`;
  }
  const queryStr = `
  mutation {
    createUser(userCreationInput: {
      title: ${params.title},
      firstName: "${params.firstName}",
      lastName: "${params.lastName}",
      email: "${params.email}",
      username: "${params.username}",
      password: "${params.password}",
      confirmPassword: "${params.confirmPassword}",
      ${partyParam}
      ${partyGroupParam}
      roles: [${params.roles.map(r => r.code).join(',')}]
    }){
      id
    }
  }`;
  const response = await query(queryStr);
  return response.data.createUser;
}

export async function updateUser(params) {
  let partyGroupParam = '';
  if (params.partyGroupId) {
    partyGroupParam = `partyGroupId: ${params.partyGroupId},`;
  }

  let partyParam = '';
  if (params.partyId) {
    partyParam = `partyId: ${params.partyId},`;
  }

  const queryStr = `
  mutation {
    updateUser(
      userToUpdate: ${params.id},
      userCreationInput: {
      title: ${params.title},
      firstName: "${params.firstName}",
      lastName: "${params.lastName}",
      email: "${params.email}",
      username: "${params.username}",
      password: "${params.password}",
      confirmPassword: "${params.confirmPassword}",
      ${partyParam}
      ${partyGroupParam}
      roles: [${params.roles.map(r => r.code).join(',')}]
    }){
      id
    }
  }`;
  const response = await query(queryStr);
  if (!response) {
    return {
      errors: ['unknown'],
    };
  }
  if (response.errors) {
    return {
      errors: response.errors,
    };
  }
  return response.data.updateUser;
}

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
  if (!response) {
    return {
      errors: ['unknown'],
    };
  }
  if (response.errors) {
    return {
      errors: response.errors,
    };
  }
  return response.data.users;
}

export async function fetchUsersByPartnerId(id) {
  const response = await searchUsers({ key: 'id', direction: 'DESC' }, { page: 0, limit: 999 }, [
    { id: 'getadmin.users.filters.partners', values: [{ id }] },
  ]);

  if (response) {
    return response.items;
  }
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

export async function fetchUserRoles() {
  const queryStr = `
  query {
    rolesForCurrentUser {
      Id
      name
      description
      scope
    }
  }
  `;

  const response = await query(queryStr);
  return response.data.rolesForCurrentUser;
}

export function formatFilters(selectedFilters) {
  const gqlFilters = [];

  addFullNameFilter(gqlFilters, selectedFilters);
  addUserNameFilter(gqlFilters, selectedFilters);
  addEmailFilter(gqlFilters, selectedFilters);
  addPartnerGroupFilter(gqlFilters, selectedFilters);
  addLoginFilter(gqlFilters, selectedFilters);
  addPartnerFilter(gqlFilters, selectedFilters);
  addRolesFilter(gqlFilters, selectedFilters);

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

function addRolesFilter(gqlFilters, selectedFilters) {
  const rolesName = getValuesIdsWithoutQuotes(selectedFilters, 'getadmin.users.filters.roles');
  if (rolesName) {
    gqlFilters.push(`roleName: {in: ["${rolesName}"]}`);
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

export async function exportUsers(columns, orderBy, exportFormat, filters = []) {
  const columnsParam = columns.join(',');
  const orderingInfo = orderBy ? `, sorting: {${orderBy.key}: ${orderBy.direction}}` : '';
  const response = await query(
    `
    query {
      exportUsers(filters: {${formatFilters(
        filters
      )}}, columns: [${columnsParam}]${orderingInfo}, exportFormat: ${exportFormat} ) {
        downloadUri
        total
      }
    }
    `
  );
  if (!response) {
    return {
      errors: ['unknown'],
    };
  }
  if (response.errors) {
    return {
      errors: response.errors,
    };
  }
  return response.data.exportUsers;
}

export async function enableUser(userId) {
  const response = await query(`mutation{activateUser (userId : ${userId})}`);
  return response.data.activateuser;
}

export async function disableUser(userId) {
  const response = await query(`mutation{deactivateUser (userId : ${userId})}`);
  return response.data.deactivateUser;
}
