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
              Veuillez choisir un rôle
            </div>

            <template v-else>
              <div class="d-flex justify-content-end mb-2">
                <div class="pt-1 pr-1">
                  {{ openAll ? 'Fermer tout les panneaux' : 'Ouvrir tout les panneaux' }}
                </div>
                <UiSimpleToggle v-model="openAll" />
              </div>
              <div v-if="domains" class="list-group">
                <PermissionChoice
                  :key="domain.id"
                  v-for="domain in domains"
                  :domain="domain"
                  :default-open="openAll"
                />
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
import PermissionChoice from './PermissionChoice.vue';
import UiSimpleToggle from '@/components/ui/UiSimpleToggle.vue';
import UiButton from '@/components/ui/Button';
import { mapMutations } from 'vuex';

import {
  fetchRoles,
  fetchAllPermissions,
  fetchPermissionsByRole,
  updatePermissions,
} from '@/api/permission.js';

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
                {role.name}
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
    RolesChoice,
    PermissionChoice,
    UiSimpleToggle,
    UiButton,
  },
  async mounted() {
    await this.loadRoles();
    await this.loadAllPermissions();
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
          } catch {
            this.flashMessage({ level: 'danger', message: this.$t('genericErrorMessage') });
          }
        },
      });
    },

    async refreshSelectedRolePermissions() {
      const rolePermissions = await fetchPermissionsByRole(this.selectedRole.Id);

      if (rolePermissions) {
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
              }
            });
          }
        });
      }
    },

    async loadAllPermissions() {
      this.domains = await fetchAllPermissions();
    },

    async loadRoles() {
      const roles = await fetchRoles();
      if (roles && roles.length) {
        this.roles = roles;
      } else {
        this.roles = [];
      }
    },
  },
  data() {
    return {
      selectedRole: undefined,
      openAll: false,
      roles: [],
      domains: undefined,
    };
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
