<template>
  <div>
    <div class="searchBar">
      <label for>{{ $t('getadmin.users.searchUser') }}</label>
      <UiInput
        v-model="searchValue"
        class="d-block"
        :placeholder="$t('getadmin.users.searchPlaceholder')"
      />
    </div>
    <div class="cards">
      <CardButton v-if="canCreate" @click="openCreationPanel">{{
        $t('getadmin.users.addUser')
      }}</CardButton>
      <Card
        v-for="user in visibleUsers"
        :key="user.id"
        :can-activate="canActivate(user)"
        :can-deactivate="canDeactivate(user)"
        :can-delete="false"
        :can-modify="canModify(user)"
        @deactivate="deactivate(user)"
        @activate="activate(user)"
        @modify="modifyUser(user)"
      >
        <div class="cardBloc-infos-name">{{ checkName(user) }}</div>
        <div class="cardBloc-infos-username">{{ user.username }}</div>
        <div class="cardBloc-infos-email">
          <a :href="'mailto:' + user.email">{{ user.email }}</a>
        </div>
        <div class="cardBloc-infos-actif">
          {{ user.disabled ? $t('col.notActive') : $t('col.active') }}
        </div>
        <div class="cardBloc-infos-role">
          {{ $t('orders.detail.roles') }}:
          <span :key="index" v-for="(role, index) in user.roles">
            {{ fetchRole(role, index) }}
          </span>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import Card from '@/components/Card';
import CardButton from '@/components/CardButton';
import UiInput from '@/components/ui/UiInput';
import { fetchUsersByPartnerId, deactivateUser, enableUser } from '@/api/users.js';
import { mapMutations, mapGetters } from 'vuex';

export default {
  components: {
    Card,
    CardButton,
    UiInput,
  },

  props: {
    partnerid: {
      type: [String, Number],
      default: undefined,
    },
    partnerLabel: {
      type: String,
      required: false,
    },
  },

  data() {
    return {
      users: [],
      visibleUsers: [],
      searchValue: null,
      roles: [],
    };
  },

  watch: {
    searchValue(newValue) {
      if (!newValue) {
        return (this.visibleUsers = [...this.users]);
      }
      this.visibleUsers = this.users.filter((u) => {
        const isUsernameValid =
          u.username && u.username.toLowerCase().indexOf(newValue.toLowerCase()) !== -1;

        let isFirstNameValid, isLastNameValid;
        if (u.name.firstName) {
          isFirstNameValid = u.name.firstName.toLowerCase().indexOf(newValue.toLowerCase()) !== -1;
        }
        if (u.name.lastName) {
          isLastNameValid = u.name.lastName.toLowerCase().indexOf(newValue.toLowerCase()) !== -1;
        }
        return isUsernameValid || isFirstNameValid || isLastNameValid;
      });
    },
  },

  methods: {
    ...mapMutations(['openPanel', 'confirmAction']),

    fetchRole(role, index) {
      return role.category == null
        ? index != 0
          ? ', ' + role.description
          : role.description
        : null;
    },

    usersFilter(searchValue) {
      return this.users.filter((value) => {
        return value.name == searchValue;
      });
    },

    checkName(e) {
      if (e.name.firstName && e.name.lastName) {
        return e.name.firstName + ' ' + e.name.lastName;
      } else if (!e.name.lastName) {
        return e.name.firstName;
      } else if (!e.name.firstName) {
        return e.name.lastName;
      } else {
        return e.username;
      }
    },

    isSelfUser(user) {
      if (user) {
        return user.id === this.userInfos.id;
      }
      return false;
    },

    canModify(user) {
      return (this.canUpdate && !this.userIsByCustomerAccount) || this.isSelfUser(user);
    },

    modifyUser(user) {
      const doReset = () => {
        this.refreshUsers();
      };
      this.openPanel({
        title: this.$t('getadmin.partnerDetail.userForm.modify-title'),
        panelId: 'getadmin.partnerDetail.userForm.title',
        payload: {
          duplicateFrom: user,
          partnerId: this.partnerid,
          partnerLabel: this.partnerLabel,
        },
        backdrop: true,
        width: '40rem',
        ignoreClickAway: true,
        onClosePanel(params) {
          if (params && params.resetSearch) {
            doReset();
          }
        },
      });
    },

    deactivate(user) {
      const doReset = () => {
        this.refreshUsers();
      };
      this.confirmAction({
        message: 'confirmAction',
        actionFn: async () => {
          await deactivateUser(user.id);
          doReset();
        },
      });
    },

    activate(user) {
      const doReset = () => {
        this.refreshUsers();
      };
      this.confirmAction({
        message: 'confirmAction',
        actionFn: async () => {
          await enableUser(user.id);
          doReset();
        },
      });
    },

    canActivate(user) {
      return this.canUpdate && user.disabled;
    },
    canDeactivate(user) {
      return this.canUpdate && !user.disabled;
    },

    async refreshUsers() {
      this.users = await fetchUsersByPartnerId(this.partnerid);

      this.visibleUsers = [...this.users];
    },

    openCreationPanel() {
      const doReset = () => {
        this.refreshUsers();
      };

      this.openPanel({
        title: this.$t('getadmin.partnerDetail.userForm.title'),
        panelId: 'getadmin.partnerDetail.userForm.title',
        payload: { fromPartnerMenu: true, partnerId: this.partnerid, fromPage: 'partner' },
        backdrop: true,
        width: '40rem',
        ignoreClickAway: true,
        onClosePanel(params) {
          if (params && params.resetSearch) {
            doReset();
          }
        },
      });
    },
  },

  computed: {
    ...mapGetters(['userInfos', 'havePermission', 'userIsByCustomerAccount']),
    canUpdate() {
      return this.havePermission('user', 'create');
    },
    canCreate() {
      return this.canUpdate && !this.userIsByCustomerAccount;
    },
  },

  async mounted() {
    await this.refreshUsers();
  },
};
</script>

<style lang="scss" scoped>
.searchBar {
  width: 49%;

  label {
    font-weight: bold;
    display: block;
  }
}

.cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  .cardBloc-infos {
    &-name {
      font-weight: 500;
      color: #454545;
      margin-bottom: 7px;
      font-size: 16px;
    }

    &-role {
      font-size: 12px;
      margin-top: 5px;
      margin-bottom: 15px;
    }

    &-actif {
      position: absolute;
      top: 1rem;
      right: 1rem;
    }

    &-email {
      margin-top: 5px;

      a {
        color: #009dcc;
        text-decoration: underline;
      }
    }
  }
}
</style>
