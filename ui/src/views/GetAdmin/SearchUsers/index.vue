<template>
  <div class="mt-4">
    <div class="row mb-5">
      <div class="col-md-9">
        <h4>
          <b>GetAdmin</b>
          - {{ $t('getadmin.users.title') }}
          <Tooltip direction="right">{{ $t('getadmin.users.tooltip-text') }}</Tooltip>
        </h4>
      </div>
      <div class="col-md-3" v-if="canCreate">
        <UiButton variant="accent" block class="float-right" @click="createUserPanel()">
          {{ $t('getadmin.users.addUser') }}
        </UiButton>
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
      :is-loading="isLoading"
      @resetSearch="resetFilters"
      @applyFilters="applyFilters"
      @columnOrdered="orderedColumns = $event"
    >
      <div slot="title">{{ $t('getadmin.users.total', { total: $formatLargeNumber(total) }) }}</div>

      <div slot="topRight">
        <ExportButton :export-fn="getExportFn()" :columns="orderedColumns" :order-by="orderBy">
          <span slot="title">{{
            $t('getadmin.users.export', { total: $formatLargeNumber(total) })
          }}</span>
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
          v-if="!userIsByCustomerAccount && havePermission('user', 'create')"
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
import PartnerFilter from '@/components/Filters/filterbar/PartnerFilter';
import RolesFilter from './filters/RolesFilter';
import StatusFilter from './filters/StatusFilter';
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
      isLoading: true,
      orderedColumns: undefined,
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
            isClickable: (userId) => {
              return this.editUser(userId);
            },
          },
        },
        {
          id: 2,
          label: 'Login',
          exportId: 'LOGIN',
          name: 'username',
          orderable: true,
          visible: true,
          noHandle: true,
        },
        {
          id: 3,
          exportId: 'NOM',
          label: this.$t('common.lastName'),
          name: 'fullname',
          orderable: true,
          visible: true,
          noHandle: true,
          format: {
            type: 'Getter',
            getter: (row) => {
              return get(row, 'name.lastName');
            },
          },
        },
        {
          id: 4,
          exportId: 'PRENOM',
          label: this.$t('common.firstName'),
          name: 'PRENOM',
          orderable: true,
          visible: true,
          noHandle: true,
          format: {
            type: 'Getter',
            getter: (row) => {
              return get(row, 'name.firstName');
            },
          },
        },
        {
          id: 5,
          exportId: 'PARTENAIRE',
          label: this.$t('col.partner'),
          name: 'PARTENAIRE',
          orderable: false,
          visible: true,
          noHandle: true,
          format: {
            type: 'Truncated',
            limit: 30,
            getter: (row) => {
              return row.partners ? row.partners.map((p) => p.name).join(',') : '';
            },
          },
        },
        {
          id: 6,
          exportId: 'ROLES',
          label: this.$t('getadmin.users.filters.roles'),
          name: 'ROLES',
          orderable: false,
          visible: true,
          noHandle: true,
          format: {
            type: 'Truncated',
            limit: 30,
            getter: (row) => {
              return row.roles
                ? row.roles
                    .filter((r) => r.category == null)
                    .map((p) => p.description)
                    .join(', ')
                : '';
            },
          },
        },
        {
          id: 7,
          exportId: 'STATUT',
          label: this.$t('getadmin.users.filters.status'),
          name: 'statut',
          orderable: true,
          visible: true,
          noHandle: true,
          format: {
            type: 'Getter',
            getter: (row) => {
              return row.disabled ? this.$t('col.notActive') : this.$t('col.active');
            },
          },
        },
        {
          id: 8,
          label: this.$t('common.email'),
          name: 'email',
          exportId: 'USER_EMAIL',
          orderable: true,
          visible: true,
          noHandle: true,
          format: {
            type: 'Email',
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
  async mounted() {
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
      {
        title: 'getadmin.users.filters.status',
        component: StatusFilter,
        onChange: (selectedStatus) => {
          return {
            id: 'getadmin.users.filters.status',
            value: this.$t(selectedStatus.label),
            data: selectedStatus,
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
    ...mapGetters([
      'userIsBO',
      'userIsGroupAccount',
      'userInfos',
      'havePermission',
      'userIsByCustomerAccount',
    ]),
    canUpdate() {
      return this.havePermission('user', 'create');
    },
    canCreate() {
      return this.canUpdate && !this.userIsByCustomerAccount;
    },
  },
  methods: {
    ...mapMutations(['openPanel']),

    resetFilters() {
      this.searchByIdValue = undefined;
      this.searchByLoginValue = undefined;
      this.applyFilters();
    },

    async applyFilters(payload) {
      if (this.searchByLoginValue) {
        payload = {
          pagination: payload !== undefined ? payload.pagination : { page: 0, limit: 20 },
          filters:
            payload !== undefined
              ? [
                  ...payload.filters,
                  {
                    id: 'getadmin.users.filters.login',
                    value: this.searchByLoginValue,
                  },
                ]
              : [
                  {
                    id: 'getadmin.users.filters.login',
                    value: this.searchByLoginValue,
                  },
                ],
        };
      }
      this.lastPayload = payload;
      const { pagination, filters } = payload || {
        pagination: { page: 0, limit: 20 },
        filters: [],
      };

      this.isLoading = true;
      const data = await searchUsers('', this.orderBy, pagination, filters);
      this.isLoading = false;

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
        payload: { fromUserMenu: true, fromPage: 'users' },
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

    onDuplicateUser(user) {
      const doReset = () => {
        this.applyFilters(this.lastPayload);
      };

      this.openPanel({
        title: this.$t('getadmin.partnerDetail.userForm.title'),
        panelId: 'getadmin.partnerDetail.userForm.title',
        payload: { duplicateFrom: user, duplicate: true },
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

    onModifyUser(user) {
      const partners = get(user, 'partners', []);
      const partnerId = partners.length ? partners[0].id : undefined;
      const partnerLabel = partners.length ? partners[0].name : undefined;

      const doReset = () => {
        this.applyFilters(this.lastPayload);
      };
      this.openPanel({
        title: this.$t('getadmin.partnerDetail.userForm.modify-title'),
        panelId: 'getadmin.partnerDetail.userForm.title',
        payload: { duplicateFrom: user, partnerId, partnerLabel },
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
    editUser(userId) {
      return !this.userIsByCustomerAccount || this.userInfos.id === userId;
    },

    async searchByLogin(value) {
      this.searchByLoginValue = value;
      const data = await searchUsers('', this.orderBy, { page: 0, limit: 20 }, [
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
        return exportUsers(columnsParam, this.orderBy, exportFormat, [
          ...this.currentAppliedFilters,
          { id: 'getadmin.users.filters.userName', value: this.searchByLoginValue },
        ]);
      };
    },
    async refreshUser(user) {
      user.disabled = !user.disabled;
    },
  },
};
</script>

<style lang="scss" scoped></style>
