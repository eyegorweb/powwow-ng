<template>
  <PaginatedDataTable
    :key="version"
    :columns="columns"
    :fetch-data-fn="fetchDataFn()"
    :size="7"
    :order="orderBy"
  ></PaginatedDataTable>
</template>

<script>
import PaginatedDataTable from '@/components/DataTable/PaginatedDataTable';
import { fetchSupervisionAlerts } from '@/api/supervision.js';
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
      version: 0,
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
        },
        {
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
    };
  },

  watch: {
    appliedFilters() {
      this.version += 1;
    },
  },

  methods: {
    getFormattedFilters() {
      if (!this.appliedFilters) return {};

      return this.appliedFilters.reduce((filters, item) => {
        if (item.id === 'getadmin.users.filters.partners') {
          filters.partyIds = [item.data.id];
        }

        if (item.id === 'filters.country') {
          filters.locationCode = item.data.codeIso3;
        }

        if (item.id === 'status') {
          filters.status = item.data.value;
        }

        if (item.id === 'types') {
          filters.type = item.data.value;
        }

        if (item.id === 'col.label') {
          filters.label = item.data.value;
        }

        return filters;
      }, {});
    },
    fetchDataFn() {
      return async pageInfo => {
        const sorting = { partnerName: 'DESC' };

        const data = await fetchSupervisionAlerts(this.getFormattedFilters(), pageInfo, sorting);
        if (!data) return { rows: [], total: 0 };
        return {
          rows: data.items,
          total: data.total,
        };
      };
    },
  },
};
</script>

<style lang="scss" scoped></style>
