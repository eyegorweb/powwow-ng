<template>
  <div class="transferSim">
    <div>
      <PaginatedDataTable
        v-if="columns"
        storage-id="getparc.table.sim-validation"
        storage-version="001"
        :columns="columns"
        :order="orderBy"
        :fetch-data-fn="getFetchTransferSimDataFN()"
        :size="8"
        @colEvent="onRowSelect"
      />
    </div>
    <div class="mt-2">
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
import { mapMutations } from 'vuex';

export default {
  components: {
    PaginatedDataTable,
    UiButton,
  },

  data() {
    return {
      selectedRows: [],
      transferIds: [],
      orderBy: { key: 'transferId', direction: 'DESC' },
      data: {},
      columns: undefined,
    };
  },

  mounted() {
    this.columns = [
      col('', '', true, true, {
        component: CheckBoxCell,
      }),
      col('ID', 'transferId', true, true),
      col('ICCID', 'iccid', true, true),
      col('Partenaire source', 'fromPartner', true, true, {
        component: FromPartner,
      }),
      col('Partenaire cible', 'toPartner', true, true, {
        component: ToPartner,
      }),
      col('Statut de la ligne', 'status', true, true),
      col('Date de statut', 'created', true, true),
    ];
  },

  methods: {
    ...mapMutations(['flashMessage']),
    async transferRequest(status) {
      this.fetchTransferId();
      const result = await updateTransferSim(this.transferIds, status);
      if (result && result.updateTransferSimRequests) {
        this.flashMessage({ level: 'success', message: this.$t('genericSuccessMessage') });
      } else {
        this.flashMessage({ level: 'danger', message: this.$t('genericErrorMessage') });
      }
    },

    fetchTransferId() {
      this.transferIds = [];
      if (this.selectedRows.length > 0) {
        this.selectedRows.forEach((e) => {
          this.transferIds.push(e.transferId);
        });
      } else if (this.data.length > 0) {
        this.data.forEach((e) => {
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
      return async (pageInfo, orderBy) => {
        this.data = await fetchTransferSim(pageInfo, orderBy);
        return {
          rows: this.data.items,
          total: this.data.total,
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
