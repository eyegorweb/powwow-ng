<template>
  <div>
    <UnitActsTable
      :mass-action-id="massActionId"
      grouped-status="FAILED"
      :columns="columns"
      :total.sync="totalFailed"
      @is-loading="$emit('is-loading', $event)"
    >
      <div v-if="totalFailed" slot="after">
        <div class="bg-white text-center p-2 pb-4">
          <h4>{{ $t('getparc.actDetail.actionChoice') }}:</h4>
          <div>
            <button @click.stop="acknowledgeFailedActs" class="btn btn-primary">
              <i class="ic-Check-Icon" />
              {{ $t('getparc.actDetail.discharge') }}
            </button>
            <button @click.stop="replayPopUp = true" class="btn btn-info ml-2">
              <i class="ic-Refresh-Icon" />
              {{ $t('getparc.actDetail.restart') }}
            </button>
          </div>
        </div>
        <Modal v-if="acknowledgePopUp">
          <div class="text-left" slot="body">
            <form>
              <div class="form-group">
                <label for="message">{{ $t('getparc.actDetail.enterMessage') }}</label>
                <textarea
                  v-model="acknowledgeTxt"
                  class="form-control"
                  id="message"
                  rows="3"
                ></textarea>
              </div>
            </form>
          </div>
          <div slot="footer">
            <button
              class="modal-default-button btn btn-danger btn-sm"
              @click.stop="closeAcknowledgement"
            >
              {{ $t('cancel') }}
            </button>
            <button
              class="modal-default-button btn btn-success btn-sm ml-1"
              @click.stop="saveAcknowledgement"
            >
              {{ $t('save') }}
            </button>
          </div>
        </Modal>
        <Modal v-if="replayPopUp">
          <div class="text-left" slot="body">
            <h4>{{ $t('getparc.actDetail.restart-confirmation') }}</h4>
          </div>
          <div slot="footer">
            <button
              class="modal-default-button btn btn-danger btn-sm"
              @click.stop="replayPopUp = false"
            >
              {{ $t('cancel') }}
            </button>
            <button
              class="modal-default-button btn btn-success btn-sm ml-1"
              @click.stop="restartFailedActs"
            >
              {{ $t('save') }}
            </button>
          </div>
        </Modal>
      </div>
    </UnitActsTable>
  </div>
</template>

<script>
import Modal from '@/components/Modal';
import UnitActsTable from './UnitActsTable';
import StatusCell from '@/views/GetParc/LineDetail/DetailsTab/ActsHistory/StatusCell';
import { col } from '@/components/DataTable/utils';

import { exportLines } from '@/api/unitActions';

import { acknowledgeFailedUnitActions, replayFailedUnitsActions } from '@/api/massActions';

export default {
  components: {
    Modal,
    UnitActsTable,
  },
  props: {
    rows: Array,
    total: [Number, String],
  },

  computed: {
    totalFailed: {
      get() {
        return this.total;
      },
      set(val) {
        this.$emit('update:total', val);
      },
    },
  },

  data() {
    return {
      massActionId: parseInt(this.$route.params.massActionId),
      acknowledgePopUp: false,
      replayPopUp: false,
      acknowledgeTxt: '',
      columns: [
        {
          id: 1,
          label: this.$t('getparc.actDetail.col.id'),
          name: 'id',
          orderable: true,
          visible: true,
          // exportId: 'UNKNOWN',
        },
        {
          id: 3,
          label: this.$t('getparc.actDetail.col.msisdn'),
          name: 'msisdn',
          orderable: true,
          visible: true,
          exportId: 'LINE_MSISDN',
        },
        {
          id: 4,
          label: this.$t('getparc.actDetail.col.iccid'),
          name: 'iccid',
          orderable: true,
          visible: true,
          exportId: 'LINE_ICCID',
        },
        {
          id: 2,
          label: this.$t('getparc.actDetail.col.actState'),
          name: 'status',
          orderable: true,
          visible: true,
          exportId: 'LINE_SIM_STATUS_DATE',
          format: {
            component: StatusCell,
          },
        },
        {
          id: 6,
          label: this.$t('getparc.actDetail.col.failDate'),
          name: 'statusDate',
          orderable: true,
          visible: true,
          // exportId: 'UNKNOWN',
        },
        {
          id: 7,
          label: this.$t('getparc.actDetail.col.failReason'),
          name: 'error',
          orderable: true,
          visible: true,
          // exportId: 'UNKNOWN',
        },
        col(this.$t('getparc.actDetail.col.startDate'), 'dueDate', false),
        {
          id: 5,
          label: this.$t('getparc.actDetail.col.imsi'),
          name: 'imsi',
          orderable: true,
          visible: false,
          exportId: 'LINE_IMSI',
        },
        {
          id: 8,
          label: this.$t('getparc.actDetail.col.constructor'),
          name: 'deviceManufacturer',
          orderable: true,
          visible: false,
          exportId: 'LINE_MANUFACTURER',
        },
        {
          id: 9,
          label: this.$t('getparc.actDetail.col.commercialRef'),
          name: 'deviceReference',
          orderable: true,
          visible: false,
          exportId: 'LINE_DEVICE_REFERENCE',
        },
        {
          id: 10,
          label: this.$t('getparc.actDetail.col.imei'),
          name: 'imei',
          orderable: true,
          visible: false,
        },
      ],
      page: 0,
      pageLimit: 20,
      orderBy: {
        key: 'ID',
        direction: 'DESC',
      },
      showExtraCells: false,
    };
  },
  methods: {
    changeCellsOrder(orderedCells) {
      const notVisibleCells = this.columns.filter(c => !c.visible);
      this.columns = orderedCells.concat(notVisibleCells);
    },
    closeAcknowledgement() {
      this.acknowledgePopUp = false;
      this.acknowledgeTxt = '';
    },
    async saveAcknowledgement() {
      await acknowledgeFailedUnitActions(this.acknowledgeTxt, this.$route.params.massActionId);
      this.$emit('refreshTables');
      this.closeAcknowledgement();
    },
    acknowledgeFailedActs() {
      this.acknowledgePopUp = true;
    },
    async restartFailedActs() {
      this.replayPopUp = true;
      await replayFailedUnitsActions(this.$route.params.massActionId);
      this.$emit('refreshTables');
    },
    getExportFn() {
      return exportLines;
    },
  },
};
</script>

<style lang="scss" scoped></style>
