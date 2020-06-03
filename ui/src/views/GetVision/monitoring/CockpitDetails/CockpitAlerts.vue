<template>
  <PaginatedDataTable
    :columns="columns"
    :fetch-data-fn="fetchDataFn()"
    :size="7"
    :order="orderBy"
  ></PaginatedDataTable>
</template>

<script>
import PaginatedDataTable from '@/components/DataTable/PaginatedDataTable';
import { fetchSupervisionAlerts } from '@/api/supervision.js'
import uuid from 'uuid/v1';

export default {
  components: {
    PaginatedDataTable,
  },
  props: {
    markerData: Object,
    appliedFilters: Array,
  },

  data() {
    return {
      columns: [
        {
          id: uuid(),
          label: 'Début',
          orderable: false,
          visible: true,
          name: 'startDate',
        },
        {
          id: uuid(),
          label: 'Fin',
          orderable: false,
          visible: true,
          name: 'endDate',
        }, {
          id: uuid(),
          label: 'Compte',
          orderable: false,
          visible: true,
          name: 'partnerName',
        },
        {
          id: uuid(),
          label: 'Code pays',
          orderable: false,
          visible: true,
          name: 'countryNameFr',
        },
        {
          id: uuid(),
          label: 'Usage',
          orderable: false,
          visible: true,
          name: 'usage',
        },
        {
          id: uuid(),
          label: 'Type',
          orderable: false,
          visible: true,
          name: 'type',
        },
        {
          id: uuid(),
          label: 'Libellé',
          orderable: false,
          visible: true,
          name: 'label',
        },
        {
          id: uuid(),
          label: 'Statut',
          orderable: false,
          visible: true,
          name: 'status',
        },
      ],
      orderBy: undefined,

    }
  },

  methods: {
    fetchDataFn() {
      return async (pageInfo) => {
        const sorting = {};
        const filters = {};

        if (this.appliedFilters) {
          const partnerFilter = this.appliedFilters.find(f => f.id === 'getadmin.users.filters.partners');
          if (partnerFilter) {
            filters.partnerId = partnerFilter.data.id;
          }
        }

        const data = await fetchSupervisionAlerts(filters, pageInfo, { partnerName: 'DESC' });
        if (!data) return { rows: [], total: 0 };
        return {
          rows: data.items,
          total: data.total,
        };
      };
    },
  },
}
</script>

<style lang="scss" scoped>

</style>
