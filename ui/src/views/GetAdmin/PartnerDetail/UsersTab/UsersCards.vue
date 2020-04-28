<template>
  <div>
    <div class="searchBar">
      <label for>Rechercher un utilisateur</label>
      <UiInput v-model="searchValue" class="d-block" placeholder="Saisir un nom, prénom ou login" />
    </div>
    <div class="cards">
      <div class="addNew" @click="openCreationPanel">
        <div class="addNew-logo">
          <i class="icon ic-User-Icon"></i>
        </div>
        <div>{{ $t('getadmin.users.addUser') }}</div>
      </div>
      <Card
        v-for="user in visibleUsers"
        :key="user.id"
        :can-delete="true"
        @delete="deleteUser(user)"
        @modify="modifyUser(user)"
      >
        <div class="cardBloc-infos-name">{{ checkName(user) }}</div>
        <div class="cardBloc-infos-username">{{ user.username }}</div>
        <div class="cardBloc-infos-email">
          <a :href="'mailto:' + user.email">
            {{ user.email }}
          </a>
        </div>
        <div class="cardBloc-infos-role">
          Rôle(s):
          <span :key="role.description" v-for="role in user.roles">{{
            role.description + ' '
          }}</span>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import Card from '@/components/Card';
import UiInput from '@/components/ui/UiInput';

import { fetchUsersByPartnerId, deactivateUser } from '@/api/users.js';
import { mapMutations } from 'vuex';

export default {
  components: {
    Card,
    UiInput,
  },

  props: {
    partnerid: {
      type: String,
      default: undefined,
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
      this.visibleUsers = this.users.filter(u => {
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

    usersFilter(searchValue) {
      return this.users.filter(value => {
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

    modifyUser(user) {
      const doReset = () => {
        this.refreshUsers();
      };
      this.openPanel({
        title: this.$t('getadmin.partnerDetail.userForm.modify-title'),
        panelId: 'getadmin.partnerDetail.userForm.title',
        payload: { duplicateFrom: user, partnerId: this.partnerid },
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

    deleteUser(user) {
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
        payload: { partnerId: this.partnerid },
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

  .addNew {
    width: 49%;
    height: 220px;
    border-radius: 5px;
    font-size: 14px;
    padding: 20px;
    border: #dddddd solid 1px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 600;
    flex-direction: column;
    cursor: pointer;

    &-logo {
      width: 50px;
      height: 50px;
      background-color: #009dcc;
      border-radius: 100px;
      margin-bottom: 10px;
      display: flex;
      justify-content: center;
      align-items: center;

      i {
        color: white;
      }
    }
  }

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
