<template>
  <div>
    <h4 class="text-primary text-uppercase">{{ $t('getparc.actLines.alarmList.title') }}</h4>
    <div class="bg-white p-4 rounded">
      <DataTable
        :columns.sync="columns"
        :rows="alarms || []"
        :order-by.sync="orderBy"
        @change-order="changeCellsOrder"
        :page.sync="page"
        :page-limit.sync="pageLimit"
        :total="total || 0"
        :size="5"
        :show-extra-columns.sync="showExtraCells"
      >
        <template slot="actions" slot-scope="{ row }">
          <ActionsCell :alarm="row" :simcard="content" />
        </template>
      </DataTable>
    </div>
  </div>
</template>

<script>
import DataTable from '@/components/DataTable/DataTable';
import ThresholdTriggers from './ThresholdTriggers';
import IdCell from './IdCell';
import StatusCell from './StatusCell';
import TriggerCell from './TriggerCell';
import ActionsCell from './ActionsCell';
import TypeCell from './TypeCell';
import { col } from '@/components/DataTable/utils';
import { fetchAlarmsWithInfos } from '@/api/alarms';

export default {
  components: {
    DataTable,
    ActionsCell,
  },
  props: {
    content: Object,
  },
  async mounted() {
    this.fetchAlarms();
  },
  data() {
    return {
      showExtraCells: false,
      page: 1,
      pageLimit: 20,
      total: 0,
      columns: [
        col(this.$t('col.id'), 'id', true, false, {
          component: IdCell,
        }),
        col(this.$t('getparc.lineDetail.alarms.name'), 'name', true, false, {
          component: TypeCell,
        }),
        col(this.$t('getparc.lineDetail.alarms.threshold'), 'threshold', true, false, {
          component: ThresholdTriggers,
        }),
        col(this.$t('col.status'), 'status', true, false, {
          component: StatusCell,
        }),
        col(this.$t('getparc.lineDetail.alarms.trigger'), 'trigger', true, false, {
          component: TriggerCell,
        }),
        col(this.$t('getparc.lineDetail.alarms.scope'), 'scope', false, false),
        col(this.$t('getparc.lineDetail.alarms.observationCycle'), 'alarm', false, false, {
          type: 'ObjectAttribute',
          path: 'observationDelay',
        }),
      ],
      orderBy: {
        key: 'id',
        direction: 'DESC',
      },
      alarms: undefined,
      showValidationModal: false,
      confirmationMessage: this.$t('getparc.actLines.alarmList.confirmationWarning'),
      isLoading: false,
      dueDate: undefined,
      isActive: undefined,
      isTriggered: false,
    };
  },
  watch: {
    page() {
      this.fetchAlarms();
    },
    orderBy() {
      this.page = 1;
      this.fetchAlarms();
    },
    pageLimit() {
      this.page = 1;
      this.fetchAlarms();
    },
  },
  methods: {
    async fetchAlarms() {
      this.alarms = await fetchAlarmsWithInfos(this.content.id);
    },
    changeCellsOrder(orderedCells) {
      const notVisibleCells = this.columns.filter(c => !c.visible);
      this.columns = orderedCells.concat(notVisibleCells);
    },
  },
};
</script>

<style lang="scss" scoped></style>
