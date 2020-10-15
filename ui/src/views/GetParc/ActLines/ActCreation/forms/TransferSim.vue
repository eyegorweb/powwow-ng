<template>
  <div class="transferSim">
    <div>
      <PaginatedDataTable
        v-if="columnsInfos"
        :key="tableVersion"
        :columns="columnsInfos"
        :order="orderBy"
        :fetch-data-fn="getFetchTransferSimDataFN()"
        :size="8"
        @colEvent="onRowSelect"
      />
    </div>
    <UiButton
      @click="transferRequest('IN_PROGRESS')"
      :variant="'info'"
      class="transferSim-button"
      >{{ $t('processing') }}</UiButton
    >
    <UiButton
      @click="transferRequest('VALIDATE')"
      :variant="'primary'"
      class="transferSim-button"
      >{{ $t('getparc.actCreation.transferSIM.validate') }}</UiButton
    >
    <UiButton @click="transferRequest('CANCEL')" :variant="'danger'" class="transferSim-button">{{
      $t('getparc.actCreation.transferSIM.deny')
    }}</UiButton>
  </div>
</template>

<script>
import PaginatedDataTable from '@/components/DataTable/PaginatedDataTable.vue';
import { fetchTransferSim, updateTransferSim } from '@/api/linesActions.js';
import { col } from '@/components/DataTable/utils';
import CheckBoxCell from '@/views/GetVision/alarmDetail/TargetedLinesByAlarmTab/CheckBoxCell.vue';
import ToPartner from './parts/ToPartner.vue';
import FromPartner from './parts/FromPartner.vue';
import UiButton from '@/components/ui/Button';

export default {
  components: {
    PaginatedDataTable,
    UiButton,
  },

  data() {
    return {
      tableVersion: 0,
      selectedRows: [],
      transferIds: [],
      orderBy: { key: 'transferId', direction: 'DESC' },
      data: {},
      columnsInfos: [
        col('', '', true, true, {
          component: CheckBoxCell,
        }),
        col('ID', 'transferId', true, true),
        col('ICCID', 'iccid', true, true),
        col('Partenaire source', '', true, true, {
          component: FromPartner,
        }),
        col('Partenaire cible', '', true, true, {
          component: ToPartner,
        }),
        col('Statut de la ligne', 'status', true, true),
        col('Date de statut', 'created', true, true),
      ],
    };
  },

  methods: {
    async transferRequest(status) {
      this.fetchTransferId();
      await updateTransferSim(this.transferIds, status);
      this.tableVersion++;
    },

    fetchTransferId() {
      this.transferIds = [];
      if (this.selectedRows.length > 0) {
        this.selectedRows.forEach((e) => {
          this.transferIds.push(e.transferId);
        });
      } else {
        this.data.transferSimRequests.forEach((e) => {
          this.transferIds.push(e.transferId);
        });
      }
    },

    onRowSelect(payload) {
      if (payload.add) {
        this.selectedRows.push(payload.add);
      }
      if (payload.remove) {
        this.selectedRows = this.selectedRows.filter(
          (r) => r.transferId !== payload.remove.transferId
        );
      }
    },

    getFetchTransferSimDataFN() {
      return async (limit, orderBy) => {
        this.data = await fetchTransferSim(orderBy);
        return {
          rows: this.data.transferSimRequests,
          total: this.data.transferSimRequests.length,
        };
      };
    },
  },
};
</script>

<style lang="scss">
.transferSim {
  margin-bottom: 3rem;

  &-button {
    margin-right: 2rem;
  }
}
</style>
