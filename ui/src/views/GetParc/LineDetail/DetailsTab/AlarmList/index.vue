<template>
  <div>
    <h4 class="text-primary text-uppercase">{{ $t('getparc.actLines.alarmList.title') }}</h4>
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
        <ActionsCell :row="row" />
      </template>
    </DataTable>
  </div>
</template>

<script>
import DataTable from '@/components/DataTable/DataTable';
import ThresholdTriggers from './ThresholdTriggers';
import IdCell from './IdCell';
import StatusCell from './StatusCell';
import TriggerCell from './TriggerCell';
import ActionsCell from './ActionsCell';
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
        {
          id: 1,
          label: 'ID',
          name: 'id',
          orderable: false,
          visible: true,
          format: {
            component: IdCell,
          },
        },
        {
          id: 2,
          label: this.$t('getparc.lineDetail.alarms.name'),
          name: 'id',
          orderable: false,
          visible: true,
        },
        {
          id: 3,
          label: this.$t('getparc.lineDetail.alarms.threshold'),
          name: 'id',
          orderable: false,
          visible: true,
          format: {
            component: ThresholdTriggers,
          },
        },
        {
          id: 4,
          label: this.$t('col.status'),
          name: 'id',
          orderable: false,
          visible: true,
          format: {
            component: StatusCell,
          },
        },
        {
          id: 5,
          label: this.$t('getparc.lineDetail.alarms.trigger'),
          name: 'id',
          orderable: false,
          visible: true,
          format: {
            component: TriggerCell,
          },
        },
        {
          id: 6,
          label: this.$t('getparc.lineDetail.alarms.scope'),
          name: 'id',
          orderable: false,
          visible: false,
        },
        {
          id: 7,
          label: this.$t('getparc.lineDetail.alarms.observationCycle'),
          name: 'alarm',
          orderable: false,
          visible: false,
          format: {
            type: 'ObjectAttribute',
            path: 'observationDelay',
          },
        },
      ],
      orderBy: {
        key: 'id',
        direction: 'DESC',
      },

      alarms: undefined,
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
      this.alarms = await fetchAlarmsWithInfos(this.content.party.id);
    },
    changeCellsOrder(orderedCells) {
      const notVisibleCells = this.columns.filter(c => !c.visible);
      this.columns = orderedCells.concat(notVisibleCells);
    },
  },
};
</script>

<style lang="scss" scoped></style>
