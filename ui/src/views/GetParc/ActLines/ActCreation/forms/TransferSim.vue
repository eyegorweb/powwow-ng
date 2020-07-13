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
import ToPartner from './parts/ToPartner.vue';
import FromPartner from './parts/FromPartner.vue';

export default {
  components: {
    PaginatedDataTable,
    CheckBoxCell,
    ToPartner,
    FromPartner,
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
        col('Vendeur/Source', '', true, true, {
          component: FromPartner,
        }),
        col('Client/Destination', '', true, true, {
          component: ToPartner,
        }),
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
