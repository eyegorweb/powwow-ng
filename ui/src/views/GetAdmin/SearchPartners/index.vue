<template>
  <div class="mt-4">
    <div class="row mb-5">
      <div class="col-md-9">
        <h4>
          <b>GetAdmin</b>
          - {{ $t('menu.partners') }}
        </h4>
      </div>
    </div>
    <TableWithFilter
      v-if="columns"
      :filters="filters"
      :columns="columns"
      :is-loading="isLoading"
      :rows="rows"
      :total="total"
      :order-by.sync="orderBy"
      :size="0"
      @applyFilters="applyFilters"
    >
      <div slot="title">{{ $t('getadmin.partners.total', { total: total }) }}</div>
    </TableWithFilter>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { fetchAllPartners } from '@/api/partners';
import TableWithFilter from '@/components/Filters/TableWithFilter';
import PartnerTypeFilter from './filters/PartnerTypeFilter';
import GroupPartnerFilter from '@/components/Filters/GroupPartnerFilter';
import TypeSimCardFilter from './filters/TypeSimCardFilter';
import PartnerFilter from '@/components/Filters/filterbar/PartnerFilter';

export default {
  components: {
    TableWithFilter,
  },

  mounted() {
    this.columns = [
      {
        id: 111,
        label: 'ID',
        name: 'id',
        orderable: true,
        visible: true,
        noHandle: true,
        format: {
          type: 'Link',
          getUrl(id) {
            return `/getamin/partner/${id}`;
          },
        },
        visibleWhen: () => {
          return this.userIsBO;
        },
      },
      {
        id: 1,
        label: this.$t('getadmin.partners.name'),
        name: 'name',
        orderable: true,
        visible: true,
      },
      {
        id: 2,
        label: this.$t('common.code'),
        name: 'code',
        orderable: true,
        visible: true,
      },
      {
        id: 3,
        label: this.$t('partnerType'),
        name: 'partyType',
        format: {
          type: 'Getter',
          getter: row => {
            let typeForPartner;
            if (row && row.partyType) {
              switch (row.partyType) {
                case 'MVNO':
                  typeForPartner = this.$t('partnerTypes.MVNO');
                  break;
                case 'CUSTOMER':
                  typeForPartner = this.$t('partnerTypes.CUSTOMER');
                  break;
                case 'MULTI_CUSTOMER':
                  typeForPartner = this.$t('partnerTypes.MULTI_CUSTOMER');
                  break;
              }
            }
            return typeForPartner ? typeForPartner : '-';
          },
        },
        orderable: true,
        visible: true,
      },
      {
        id: 4,
        label: this.$t('getparc.history.details.CHANGE_STATUS.activated'),
        name: 'disabled',
        format: {
          type: 'Getter',
          getter: row => {
            return row.disabled ? this.$t('col.notActive') : this.$t('col.active');
          },
        },
        orderable: true,
        visible: true,
      },
      {
        id: 5,
        label: this.$t('groupAccount'),
        name: 'partyGroups',
        format: {
          type: 'Getter',
          getter: row => {
            return row.partyGroups.map(p => p.name).join(',');
          },
        },
        orderable: true,
        visible: true,
      },
    ];
    this.applyFilters();
  },
  data() {
    return {
      isLoading: true,
      filters: [
        {
          title: 'getadmin.partners.name',
          component: PartnerFilter,
          onChange(chosenValues) {
            return {
              id: 'getadmin.partners.name',
              values: chosenValues,
            };
          },
        },
        {
          title: 'partnerType',
          component: PartnerTypeFilter,
          onChange(chosen) {
            if (!chosen || !chosen.value) {
              return {
                id: 'partnerType',
                value: '',
              };
            } else {
              return {
                id: 'partnerType',
                value: chosen.label,
                data: chosen,
              };
            }
          },
        },
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
          title: 'getadmin.users.filters.typeSIMCard',
          component: TypeSimCardFilter,
          onChange(chosenValues) {
            return {
              id: 'getadmin.users.filters.typeSIMCard',
              values: chosenValues,
            };
          },
        },
      ],
      columns: undefined,
      rows: [],
      total: 0,
      orderBy: {
        key: 'id',
        direction: 'ASC',
      },
    };
  },
  computed: {
    ...mapGetters(['userIsBO']),
  },
  methods: {
    async applyFilters(payload) {
      const { pagination, filters } = payload || {
        pagination: { page: 0, limit: 10 },
        filters: [],
      };

      this.isLoading = true;
      const data = await fetchAllPartners(this.orderBy, pagination, filters);
      this.isLoading = false;

      this.total = data.total;
      this.rows = data.items;
    },
  },
};
</script>

<style lang="scss" scoped>
.card {
  top: 70px;
}
</style>
