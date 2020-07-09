<template>
  <div>
    <PaginatedDataTable
      v-if="columnsInfos"
      :key="tableVersion"
      :columns="columnsInfos"
      :fetch-data-fn="fetchTransferSimData()"
      :size="8"
    />
  </div>
</template>

<script>
import PaginatedDataTable from '@/components/DataTable/PaginatedDataTable.vue';
import { fetchTransferSim } from '@/api/linesActions.js';
import { col } from '@/components/DataTable/utils';
import CheckBoxCell from '@/views/GetParc/ActLines/LinesTable/CheckBoxCell.vue';

export default {
  components: {
    PaginatedDataTable,
    CheckBoxCell,
  },

  data() {
    return {
      tableVersion: 0,
      columnsInfos: [
        col('', '', true, true, {
          component: CheckBoxCell,
        }),
        col('ID', 'transferId', true, true),
        col('ICCID', 'iccid', true, true),
        col('Vendeur/Source', 'fromPartner', true, true),
        col('CF', 'fromCustAccount', true, true),
        col('Client/Destination', 'toPartner', true, true),
        col('CF', 'toCustAccount', true, true),
        col('Statut de la ligne', 'status', true, true),
        col('Date de statut', 'created', true, true),
      ],
    };
  },

  methods: {
    fetchTransferSimData() {
      return async data => {
        const response = await fetchTransferSim();
        return {
          rows: response.transferSimRequests,
          total: response.transferSimRequests.length,
        };
      };
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
