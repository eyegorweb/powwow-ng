<template>
  <div class="mt-4">
    <div class="card">
      <div class="card-body p-1">
        <div class="row">
          <div class="col-3 pr-0">
            <RolesChoice
              :roles="roles"
              :on-role-click="onRoleClick"
              :selected-role="selectedRole"
            />
          </div>
          <div class="col-9 permissions-list">
            <div v-if="!selectedRole" class="alert alert-warning mt-2">
              {{ $t('getadmin.chooseRole') }}
            </div>

            <template v-else>
              <div class="d-flex justify-content-end mb-2">
                <div class="pt-1 pr-1">
                  {{ openAll ? $t('getadmin.closePanels') : $t('getadmin.openPanels') }}
                </div>
                <UiSimpleToggle v-model="openAll" />
              </div>
              <div v-if="domains" class="list-group">
                <PermissionChoice
                  :key="`${domain.labelDomain}_${index}`"
                  v-for="(domain, index) in domains"
                  :domain="domain"
                  :default-open="openAll"
                >
                  <ul class="list-group list-group-flush">
                    <li
                      class="list-group-item permission-item"
                      :key="`${domain.labelDomain}_${p.id}`"
                      v-for="p in domain.permissions"
                      @click.stop="() => (p.checked = !p.checked)"
                    >
                      <UiCheckbox v-model="p.checked">
                        <span class="pl-2 pb-2">{{ p.labelAction }}</span>
                      </UiCheckbox>
                    </li>
                  </ul>
                </PermissionChoice>
              </div>
              <div class="d-flex justify-content-end mt-2 mb-2">
                <UiButton :variant="'primary'" @click="savePermissions">{{ $t('save') }}</UiButton>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UiCheckbox from '@/components/ui/Checkbox';
import PermissionChoice from './PermissionChoice.vue';
import UiSimpleToggle from '@/components/ui/UiSimpleToggle.vue';
import UiButton from '@/components/ui/Button';
import { mapMutations } from 'vuex';
import union from 'lodash.union';

import {
  fetchRoles,
  fetchAllPermissions,
  fetchPermissionsByRole,
  updatePermissions,
} from '@/api/permission.js';

/**
 * Sort roles
 * @param {Object} role
 */
function sortRoles(r) {
  r.sort((a, b) => {
    const nameA = a.description.toUpperCase();
    const nameB = b.description.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });
  return r;
}

const RolesChoice = {
  functional: true,
  props: {
    roles: Array,
    selectedRole: Object,
    onRoleClick: Function,
  },

  render(h, context) {
    const { roles, selectedRole, onRoleClick } = context.props;

    return (
      <div class="roles-container">
        <ul class="list-group list-group-flush">
          {roles.map((role) => {
            return (
              <li
                class={`list-group-item ${selectedRole === role ? 'active' : ''}`}
                onClick={() => onRoleClick(role)}
              >
                {role.description}
              </li>
            );
          })}
        </ul>
      </div>
    );
  },
};

export default {
  components: {
    UiCheckbox,
    RolesChoice,
    PermissionChoice,
    UiSimpleToggle,
    UiButton,
  },

  async mounted() {
    await this.loadRoles();
    await this.loadAllPermissions();
  },

  data() {
    return {
      selectedRole: undefined,
      openAll: false,
      roles: [],
      domains: undefined,
      rolesSorted: [],
    };
  },

  methods: {
    ...mapMutations(['flashMessage', 'confirmAction']),
    onRoleClick(role) {
      this.selectedRole = role;
      this.refreshSelectedRolePermissions();
    },

    async savePermissions() {
      this.confirmAction({
        message: 'getadmin.permissions.save',
        actionFn: async () => {
          const permissions = this.domains
            .map((d) => d.permissions)
            .flat()
            .filter((p) => p.checked)
            .map((p) => p.id);
          try {
            await updatePermissions(this.selectedRole.Id, permissions);
            this.flashMessage({ level: 'success', message: this.$t('genericSuccessMessage') });
          } catch (e) {
            console.log(e);
            this.flashMessage({ level: 'danger', message: this.$t('genericErrorMessage') });
          }
        },
      });
    },

    async refreshSelectedRolePermissions() {
      const rolePermissions = await fetchPermissionsByRole(this.selectedRole.Id);
      if (rolePermissions.length) {
        rolePermissions.forEach((domainByRole) => {
          const matchingDomain = this.domains.find(
            (d) => d.labelDomain === domainByRole.labelDomain
          );
          if (matchingDomain) {
            matchingDomain.permissions.forEach((localPermission) => {
              const corresponding = domainByRole.permissions.find(
                (permissionFromApi) => permissionFromApi.id === localPermission.id
              );
              if (corresponding) {
                localPermission.checked = true;
              } else {
                localPermission.checked = false;
              }
            });
          }
        });
        // Render domains array and remove duplicate values
        this.domains = union(this.domains, rolePermissions);
      } else {
        await this.loadAllPermissions();
      }
    },

    async loadAllPermissions() {
      this.domains = await fetchAllPermissions();
      this.domains.forEach((d) => {
        d.permissions.forEach((p) => {
          p.checked = false;
        });
      });
    },

    async loadRoles() {
      let roles = await fetchRoles();
      if (roles && roles.length) {
        let rolesC = roles.filter((e) => e.category === null);
        let rolesW = roles.filter((e) => e.category === 2 || e.category === 1);

        rolesC = sortRoles(rolesC);
        rolesW = sortRoles(rolesW);

        this.rolesSorted.push(...rolesC, ...rolesW);
        this.roles = this.rolesSorted;
      } else {
        this.roles = [];
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.roles-container {
  height: 100%;
  border-right: 1px solid rgba(0, 0, 0, 0.125);
  .list-group-item {
    &:hover {
      background: $light-gray;
      cursor: pointer;
    }
    &.active {
      background: $light-gray;
      color: black;
      font-weight: bold;
      border-top: 1px solid rgba(0, 0, 0, 0.125);
      border-bottom: 1px solid rgba(0, 0, 0, 0.125);
    }
  }
}

.permissions-list {
  min-height: 50rem;
}
</style>
