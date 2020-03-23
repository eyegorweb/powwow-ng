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
      :filters="filters"
      :columns="columns"
      :rows="rows"
      :total="total"
      :order-by.sync="orderBy"
      :size="0"
      @applyFilters="applyFilters"
    ></TableWithFilter>
  </div>
</template>

<script>
import TableWithFilter from '@/components/Filters/TableWithFilter';
import { fetchAllPartners } from '@/api/partners';
import PartnerNameFilter from './filters/PartnerNameFilter';
import PartnerTypeFilter from './filters/PartnerTypeFilter';
import PartnerGroupFilter from './filters/PartnerGroupFilter';
// Evolution futur
// import TypeSimCardFilter from './filters/TypeSimCardFilter';

export default {
  components: {
    TableWithFilter,
  },
  mounted() {
    this.applyFilters();
  },
  data() {
    return {
      filters: [
        {
          title: 'getadmin.partners.name',
          component: PartnerNameFilter,
          onChange(chosenValue) {
            return {
              id: 'getadmin.partners.name',
              value: chosenValue,
            };
          },
        },
        {
          title: 'partnerType',
          component: PartnerTypeFilter,
          onChange(chosenValue) {
            return {
              id: 'partnerType',
              value: chosenValue.label,
              data: chosenValue,
            };
          },
        },
        {
          title: 'getadmin.users.partnerGroup',
          component: PartnerGroupFilter,
          onChange(chosenValues) {
            return {
              id: 'getadmin.users.partnerGroup',
              values: chosenValues,
            };
          },
        },
        // Evolution futur
        // {
        //   title: 'filters.lines.typeSIMCard',
        //   component:TypeSimCardFilter,
        //   onChange(chosenValues) {
        //     return {
        //       id: 'filters.lines.typeSIMCard',
        //       values: chosenValues,
        //     };
        //   },
        // },
      ],
      columns: [
        {
          id: 1,
          label: 'Raison sociale',
          name: 'name',
          orderable: true,
          visible: true,
        },
        {
          id: 2,
          label: 'Code',
          name: 'code',
          orderable: true,
          visible: true,
        },
        {
          id: 3,
          label: 'Type de Partenaire',
          name: 'partyType',
          orderable: true,
          visible: true,
        },
        {
          id: 4,
          label: 'Actif',
          name: 'disabled',
          orderable: true,
          visible: true,
        },
        {
          id: 5,
          label: 'Compte groupe',
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
      ],
      rows: [],
      total: 0,
      orderBy: {
        key: 'id',
        direction: 'DESC',
      },
    };
  },
  methods: {
    async applyFilters(payload) {
      const { pagination, filters } = payload || {
        pagination: { page: 0, limit: 10 },
        filters: [],
      };

      const data = await fetchAllPartners(this.orderBy, pagination, filters);
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
