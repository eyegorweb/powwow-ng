<template>
  <LoaderContainer :is-loading="false">
    <div>
      <div v-if="!rows || !rows.length" class="alert alert-light" role="alert">
        {{ $t('noResult') }}
      </div>
      <div v-else>
        <div class="row mb-3">
          <div class="col">
            <h2 class="text-gray font-weight-light" style="font-size: 2rem">
              {{ $t('getparc.actDetail.title', { total: total }) }}
            </h2>
          </div>
        </div>
        <DataTable
          :columns.sync="columns"
          :rows="rows || []"
          :page.sync="page"
          :page-limit.sync="pageLimit"
          :total="total || 0"
          :order-by.sync="orderBy"
          :show-extra-columns.sync="showExtraCells"
          @change-order="changeCellsOrder"
          :size="7"
        >
          <template slot="topLeftCorner">
            <SearchByActId />
          </template>
        </DataTable>
        <div class="bg-white text-center p-2 pb-4">
          <h4>{{ $t('getparc.actDetail.actionChoice') }}:</h4>
          <div>
            <button @click.stop="acknowledgeFailedActs" class="btn btn-primary">
              <i class="ic-Check-Icon" /> {{ $t('getparc.actDetail.discharge') }}
            </button>
            <button @click.stop="restartFailedActs" class="btn btn-info ml-2">
              <i class="ic-Refresh-Icon" /> {{ $t('getparc.actDetail.restart') }}
            </button>
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
          </div>
        </div>
      </div>
    </div>
  </LoaderContainer>
</template>

<script>
import DataTable from '@/components/DataTable/DataTable';
import LoaderContainer from '@/components/LoaderContainer';
import SearchByActId from '@/views/GetParc/SearchByActId';
import Modal from '@/components/Modal';

import { acknowledgeFailedUnitActions } from '@/api/massActions';

export default {
  components: {
    DataTable,
    LoaderContainer,
    SearchByActId,
    Modal,
  },
  props: {
    massActionId: String,
    rows: Array,
  },

  data() {
    return {
      acknowledgePopUp: false,
      acknowledgeTxt: '',
      total: 1,
      columns: [
        {
          id: 1,
          label: this.$t('getparc.actDetail.col.id'),
          name: 'id',
          orderable: true,
          visible: true,
        },
        {
          id: 3,
          label: this.$t('getparc.actDetail.col.msisdn'),
          name: 'msisdn',
          orderable: true,
          visible: true,
        },
        {
          id: 4,
          label: this.$t('getparc.actDetail.col.iccid'),
          name: 'iccid',
          orderable: true,
          visible: true,
        },
        {
          id: 2,
          label: this.$t('getparc.actDetail.col.actState'),
          name: 'status',
          orderable: true,
          visible: true,
        },
        {
          id: 6,
          label: this.$t('getparc.actDetail.col.failDate'),
          name: 'statusDate',
          orderable: true,
          visible: true,
        },
        {
          id: 7,
          label: this.$t('getparc.actDetail.col.failReason'),
          name: 'error_reason',
          orderable: true,
          visible: true,
        },
        {
          id: 5,
          label: this.$t('getparc.actDetail.col.imsi'),
          name: 'imsi',
          orderable: true,
          visible: false,
        },
        {
          id: 8,
          label: this.$t('getparc.actDetail.col.constructor'),
          name: 'manufacturer',
          orderable: true,
          visible: false,
        },
        {
          id: 9,
          label: this.$t('getparc.actDetail.col.commercialRef'),
          name: 'deviceReference',
          orderable: true,
          visible: false,
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
        key: 'id',
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
      await acknowledgeFailedUnitActions(this.acknowledgeTxt, this.massActionId);
      this.$emit('refreshTables');
      this.closeAcknowledgement();
    },
    acknowledgeFailedActs() {
      this.acknowledgePopUp = true;
    },
    async restartFailedActs() {
      console.log('restart en echec');

      // replayFailedUnitsActions
      /*
      const partyId = 1;
      const userId = 1;
      const massActionId = 1;
      const data = await replayFailedUnitsActions(partyId, userId, massActionId);
      console.log(data);
      //*/
    },
  },
};
</script>

<style scoped></style>
