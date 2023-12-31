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
      :size="6"
      @applyFilters="applyFilters"
    >
      <div slot="title">
        {{ $t('getadmin.partners.total', { total: $formatLargeNumber(total) }) }}
      </div>
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
            return `/getadmin/partner/${id}/users/admins`;
          },
        },
        visibleWhen: () => {
          return this.havePermission('party', 'read');
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
        orderable: false,
        visible: true,
      },
      {
        id: 3,
        label: this.$t('partnerType'),
        name: 'partyType',
        format: {
          type: 'Getter',
          getter: (row) => {
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
        label: this.$t('getadmin.partners.status'),
        name: 'status',
        orderable: false,
        visible: true,
      },
      {
        id: 5,
        label: this.$t('groupAccount'),
        name: 'partyGroups',
        format: {
          type: 'Getter',
          getter: (row) => {
            return row.partyGroups.map((p) => p.name).join(',');
          },
        },
        orderable: false,
        visible: true,
      },
      {
        id: 6,
        label: this.$t('getadmin.partners.siren'),
        name: 'siren',
        visible: false,
      },
      {
        id: 7,
        label: this.$t('getadmin.partners.creationDate'),
        name: 'created',
        orderable: true,
        visible: false,
        format: {
          type: 'Getter',
          getter: (row) => {
            return row.auditable.created;
          },
        },
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
    ...mapGetters(['userIsBO', 'havePermission']),
  },
  methods: {
    async applyFilters(payload) {
      const { pagination, filters } = payload || {
        pagination: { page: 0, limit: 20 },
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
