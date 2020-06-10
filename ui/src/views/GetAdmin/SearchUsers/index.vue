<template>
  <div class="mt-4">
    <div class="row mb-5">
      <div class="col-md-9">
        <h4>
          <b>GetAdmin</b>
          - {{ $t('getadmin.users.title') }}
          <Tooltip direction="right">{{ $t('getvsion.manage-alarms-tooltip') }}</Tooltip>
        </h4>
      </div>
      <div class="col-md-3" v-if="canShow">
        <UiButton variant="accent" block class="float-right" @click="createUserPanel()">{{
          $t('getadmin.users.addUser')
        }}</UiButton>
      </div>
    </div>
    <TableWithFilter
      v-if="filters"
      :filters="filters"
      :columns="columns"
      :rows="rows"
      :total="total"
      :order-by.sync="orderBy"
      :show-reset="!!searchByLoginValue"
      @resetSearch="resetFilters"
      @applyFilters="applyFilters"
      @colEvent="onColEvent"
    >
      <div slot="title">{{ $t('getadmin.users.total', { total: total }) }}</div>

      <div slot="topRight">
        <ExportButton :export-fn="getExportFn()" :columns="columns" :order-by="orderBy">
          <span slot="title">{{ $t('getparc.actLines.export', { total: total }) }}</span>
        </ExportButton>
      </div>

      <div slot="topLeft">
        <SearchByLogin
          @searchByLogin="searchByLogin"
          @inputIsEmpty="clearSearch"
          :init-value="searchByLoginValue"
        />
      </div>

      <template slot="actions" slot-scope="{ row }">
        <Actions
          :user="row"
          @duplicateUser="onDuplicateUser(row)"
          @modifyUser="onModifyUser(row)"
          @actionIsDone="refreshUser(row)"
        />
      </template>
    </TableWithFilter>
  </div>
</template>

<script>
import UiButton from '@/components/ui/Button';
import Tooltip from '@/components/ui/Tooltip';
import TableWithFilter from '@/components/Filters/TableWithFilter';
import SearchByLogin from './filters/SearchByLogin';
import GroupPartnerFilter from '@/components/Filters/GroupPartnerFilter';
import ExportButton from '@/components/ExportButton';
import TextFilter from '@/components/Filters/TextFilter.vue';
import PartnerFilter from './filters/PartnerFilter';
import RolesFilter from './filters/RolesFilter';
import Actions from './UserActions';
import { searchUsers, exportUsers } from '@/api/users';
import get from 'lodash.get';
import { mapGetters, mapMutations } from 'vuex';

export default {
  components: {
    UiButton,
    Tooltip,
    TableWithFilter,
    SearchByLogin,
    ExportButton,
    Actions,
  },
  data() {
    return {
      filters: undefined,
      lastPayload: undefined,
      columns: [
        {
          id: 1,
          label: 'ID',
          name: 'id',
          orderable: true,
          visible: true,
          noHandle: true,
          format: {
            type: 'LinkBtn',
            onClick: (id, user) => {
              this.onModifyUser(user);
            },
          },
        },
        {
          id: 2,
          label: 'Login',
          name: 'username',
          orderable: true,
          visible: true,
          noHandle: true,
        },
        {
          id: 3,
          label: 'Nom',
          name: 'fullname',
          orderable: true,
          visible: true,
          noHandle: true,
          format: {
            type: 'Getter',
            getter: row => {
              return get(row, 'name.lastName');
            },
          },
        },
        {
          id: 4,
          label: 'Prénom',
          name: 'PRENOM',
          orderable: true,
          visible: true,
          noHandle: true,
          format: {
            type: 'Getter',
            getter: row => {
              return get(row, 'name.firstName');
            },
          },
        },
        {
          id: 5,
          label: 'Partenaire',
          name: 'PARTENAIRE', // 'LOGIN', 'NOM', 'PRENOM', 'ROLES'',
          orderable: false,
          visible: true,
          noHandle: true,
          format: {
            type: 'Getter',
            getter: row => {
              return row.partners ? row.partners.map(p => p.name).join(',') : '';
            },
          },
        },
        {
          id: 6,
          label: 'Rôles',
          name: 'ROLES',
          orderable: false,
          visible: true,
          noHandle: true,
          format: {
            type: 'Truncated',
            limit: 30,
            getter: row => {
              return row.roles ? row.roles.map(p => p.description).join(', ') : '';
            },
          },
        },
        {
          id: 7,
          label: 'Actif',
          name: 'disabled',
          orderable: false,
          visible: true,
          noHandle: true,
          format: {
            type: 'Getter',
            getter: row => {
              return row.disabled ? 'Inactif' : 'Actif';
            },
          },
        },
      ],
      rows: [],
      total: 0,
      orderBy: {
        key: 'id',
        direction: 'ASC',
      },
      searchByLoginValue: undefined,
      searchLoginResults: [],
      currentAppliedFilters: [],
    };
  },
  mounted() {
    let currentVisibleFilters = [
      {
        title: 'getadmin.users.filters.fullName',
        component: TextFilter,
        onChange(chosenValue) {
          return {
            id: 'getadmin.users.filters.fullName',
            value: chosenValue,
          };
        },
      },
      {
        title: 'getadmin.users.filters.email',
        component: TextFilter,
        onChange(chosenValue) {
          return {
            id: 'getadmin.users.filters.email',
            value: chosenValue,
          };
        },
      },
      {
        title: 'getadmin.users.filters.roles',
        component: RolesFilter,
        onChange(chosenValues) {
          return {
            id: 'getadmin.users.filters.roles',
            values: chosenValues,
          };
        },
      },
    ];

    if (this.userIsBO) {
      currentVisibleFilters.push(
        {
          title: 'getadmin.users.filters.partnerGroup',
          component: GroupPartnerFilter,
          onChange(chosenValues) {
            return {
              id: 'getadmin.users.filters.partnerGroup',
              values: chosenValues,
            };
          },
        },
        {
          title: 'getadmin.users.filters.partners',
          component: PartnerFilter,
          onChange(chosenValues) {
            return {
              id: 'getadmin.users.filters.partners',
              values: chosenValues,
            };
          },
        }
      );
    } else if (this.userIsGroupAccount) {
      currentVisibleFilters.push({
        title: 'getadmin.users.filters.partners',
        component: PartnerFilter,
        onChange(chosenValues) {
          return {
            id: 'getadmin.users.filters.partners',
            values: chosenValues,
          };
        },
      });
    }

    this.filters = currentVisibleFilters;
    this.applyFilters();
  },
  computed: {
    ...mapGetters(['userIsBO', 'userIsGroupAccount']),
    canShow() {
      return this.havePermission('user', 'create');
    },
  },
  methods: {
    ...mapMutations(['openPanel']),

    resetFilters() {
      this.searchByIdValue = undefined;
      this.applyFilters();
    },

    async applyFilters(payload) {
      this.lastPayload = payload;
      const { pagination, filters } = payload || {
        pagination: { page: 0, limit: 10 },
        filters: [],
      };

      const data = await searchUsers(this.orderBy, pagination, filters);
      this.total = data.total;
      this.rows = data.items;

      this.currentAppliedFilters = filters;
    },

    createUserPanel() {
      const doReset = () => {
        this.applyFilters(this.lastPayload);
      };

      this.openPanel({
        title: this.$t('getadmin.partnerDetail.userForm.title'),
        panelId: 'getadmin.partnerDetail.userForm.title',
        payload: { fromUserMenu: true, partnerId: this.partnerid },
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

    onColEvent(payload) {
      console.log('col event', payload);
    },
    async searchByLogin(value) {
      this.searchByLoginValue = value;
      const data = await searchUsers(this.orderBy, { page: 0, limit: 10 }, [
        {
          id: 'getadmin.users.filters.login',
          value,
        },
      ]);
      this.total = data.total;
      this.rows = data.items;
    },
    clearSearch() {
      if (this.searchByLoginValue) {
        this.searchByLoginValue = undefined;
        this.applyFilters();
      }
    },
    getExportFn() {
      return async (columnsParam, orderBy, exportFormat) => {
        return await exportUsers(
          ['PARTENAIRE', 'LOGIN', 'NOM', 'PRENOM', 'ROLES', 'STATUT'],
          this.orderBy,
          exportFormat,
          this.currentAppliedFilters
        );
      };
    },
    onDuplicateUser(user) {
      console.log('duplicate user', user);
    },

    onModifyUser(user) {
      const partners = get(user, 'partners', []);
      const partnerId = partners.length ? partners[0].id : undefined;

      const doReset = () => {
        this.applyFilters(this.lastPayload);
      };
      this.openPanel({
        title: this.$t('getadmin.partnerDetail.userForm.modify-title'),
        panelId: 'getadmin.partnerDetail.userForm.title',
        payload: { duplicateFrom: user, partnerId },
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
    async refreshUser(user) {
      user.disabled = !user.disabled;
    },

    havePermission(domain, action) {
      return !!get(this.userInfos, 'permissions', []).find(
        p => p.domain === domain && p.action === action
      );
    },
  },
};
</script>

<style lang="scss" scoped></style>
