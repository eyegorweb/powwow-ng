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
    </div>
    <TableWithFilter
      v-if="filters"
      :filters="filters"
      :columns="columns"
      :rows="rows"
      :total="total"
      :order-by.sync="orderBy"
      :size="0"
      @applyFilters="applyFilters"
      @colEvent="onColEvent"
    >
      <div slot="title">{{ $t('getadmin.users.total', { total: total }) }}</div>

      <div slot="topLeft">
        <SearchByLogin
          @searchByLogin="searchByLogin"
          @inputIsEmpty="clearSearch"
          :init-value="searchByLoginValue"
        />
      </div>
    </TableWithFilter>
  </div>
</template>

<script>
import Tooltip from '@/components/ui/Tooltip';
import TableWithFilter from '@/components/Filters/TableWithFilter';
import FullNameFilter from './filters/FullNameFilter';
import EmailFilter from './filters/EmailFilter';
import SearchByLogin from './filters/SearchByLogin';
import GroupPartnerFilter from './filters/GroupPartnerFilter';
import PartnerFilter from './filters/PartnerFilter';
import { searchUsers } from '@/api/users';
import get from 'lodash.get';
import { mapGetters } from 'vuex';

export default {
  components: {
    Tooltip,
    TableWithFilter,
    SearchByLogin,
  },
  data() {
    return {
      filters: undefined,
      columns: [
        {
          id: 1,
          label: 'ID',
          name: 'id',
          orderable: true,
          visible: true,
          noHandle: true,
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
          name: 'lastname',
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
          name: 'firstname',
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
          id: 4,
          label: 'Partenaire',
          name: 'partner',
          orderable: true,
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
          id: 5,
          label: 'Rôles',
          name: 'roles',
          orderable: false,
          visible: true,
          noHandle: true,
        },
        {
          id: 6,
          label: 'Actif',
          name: 'disabled',
          orderable: true,
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
        direction: 'DESC',
      },
      searchByLoginValue: undefined,
      searchLoginResults: [],
    };
  },
  mounted() {
    let currentVisibleFilters = [
      {
        title: 'getadmin.users.filters.fullName',
        component: FullNameFilter,
        onChange(chosenValue) {
          return {
            id: 'getadmin.users.filters.fullName',
            value: chosenValue,
          };
        },
      },
      {
        title: 'getadmin.users.filters.email',
        component: EmailFilter,
        onChange(chosenValue) {
          return {
            id: 'getadmin.users.filters.email',
            value: chosenValue,
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
  },
  methods: {
    async applyFilters(payload) {
      const { pagination, filters } = payload || {
        pagination: { page: 0, limit: 10 },
        filters: [],
      };

      const data = await searchUsers(this.orderBy, pagination, filters);
      this.total = data.total;
      this.rows = data.items;
    },
    onColEvent(payload) {
      console.log('col event', payload);
    },
    async searchByLogin(value) {
      this.searchByLoginValue = value;
      const data = await searchUsers(this.orderBy, { page: 0, limit: 10 }, [
        {
          id: 'getadmin.users.login',
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
  },
};
</script>

<style lang="scss" scoped></style>
