<template>
  <div>
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
import TypeSimCardFilter from './filters/TypeSimCardFilter';

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
        {
          title: 'filters.lines.typeSIMCard',
          component:TypeSimCardFilter,
          onChange(chosenValues) {
            return {
              id: 'filters.lines.typeSIMCard',
              values: chosenValues,
            };
          },
        },
      ],
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
          label: 'NAME',
          name: 'name',
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

<style lang="scss" scoped></style>
