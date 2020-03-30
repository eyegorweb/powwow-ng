<template>
  <div>
    <h4 class="text-primary text-uppercase">{{ $t('getparc.actLines.alarmList.title') }}</h4>
    <div class="bg-white p-4 rounded">
      <LoaderContainer :is-loading="isLoading">
        <div slot="on-loading">
          <TableSkeleton :columns="columns" :size="5" paginated />
        </div>
        <DataTable
          :columns.sync="columns"
          :rows="alarms || []"
          :order-by.sync="orderBy"
          @change-order="changeCellsOrder"
          @colEvent="openAlarmPanel"
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
      </LoaderContainer>
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

import LoaderContainer from '@/components/LoaderContainer';
import TableSkeleton from '@/components/ui/skeletons/TableSkeleton';

import { mapMutations } from 'vuex';

export default {
  components: {
    DataTable,
    ActionsCell,
    LoaderContainer,
    TableSkeleton,
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
    ...mapMutations(['openPanel']),

    async fetchAlarms() {
      this.isLoading = true;
      this.alarms = await fetchAlarmsWithInfos(this.content.id);
      this.isLoading = false;
    },
    changeCellsOrder(orderedCells) {
      const notVisibleCells = this.columns.filter(c => !c.visible);
      this.columns = orderedCells.concat(notVisibleCells);
    },
    openAlarmPanel(payload) {
      if (payload.action !== 'openAlarmPanel') return;
      const title = 'getparc.lineDetail.alarms.trigger-history';
      const openTrigger = () => {
        this.openPanel({
          title: this.$t(title),
          panelId: title,
          wide: false,
          backdrop: false,
          payload: {
            alarm: payload.row.alarm,
            sim: this.content,
          },
        });
      };

      /**
       * On veux attendre que le panel existant soit fermé avant de réouvrir un nouveau panel
       */
      if (this.isOpen) {
        setTimeout(openTrigger, 500);
      } else {
        openTrigger();
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
