import { query } from './utils';

export async function fetchRoles() {
  const queryStr = `
  query{
    roles{
      Id
      name
      description
      category
      scope
    }
  }
`;

  const response = await query(queryStr);

  return response.data.roles;
}

export async function fetchAllPermissions() {
  const queryStr = `
query{
  permissions{
    labelDomain
    permissions{
      id
      labelAction
    }
  }
}
`;

  const response = await query(queryStr);
  return response.data.permissions;
}

export async function fetchPermissionsByRole(roleId) {
  const queryStr = `
query{
  permissions(roleId: ${roleId}){
    labelDomain
    permissions{
      id
      labelAction
    }
  }
}

`;

  const response = await query(queryStr);

  return response.data.permissions;
}

export async function updatePermissions(roleId, permissionIds) {
  const queryStr = `
mutation UpdatePermissions($roleId: Long!, $permissionIds: [Long!]) {
    updatePermissions(roleId: $roleId, permissionIds: $permissionIds)
}
`;

  const response = await query(queryStr, { roleId, permissionIds });

  return response.data.permissions;
}
