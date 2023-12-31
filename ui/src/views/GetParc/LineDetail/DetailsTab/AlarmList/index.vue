<template>
  <div>
    <div class="row mb-3 mt-3">
      <div class="col-md-8">
        <h4 class="text-primary text-uppercase">{{ $t('getparc.actLines.alarmList.title') }}</h4>
      </div>
      <div class="col-md-4" v-if="!userIsByCustomerAccount">
        <UiButton variant="secondary" block class="float-right" @click="createAlarm()">
          <i class="select-icon ic-Amplifier-Icon" />
          {{ $t('getvsion.table.create-alarm') }}
        </UiButton>
      </div>
    </div>
    <div v-if="hasNoActiveLines" class="noActiveLine">
      <span>
        {{ $t('noActiveLine') }}
      </span>
    </div>
    <div class="bg-white p-4 rounded" v-if="!hasNoActiveLines">
      <LoaderContainer :is-loading="isLoading">
        <div slot="on-loading">
          <TableSkeleton :columns="columns" :size="5" paginated />
        </div>
        <DataTable
          :columns.sync="columns"
          :rows="rows || []"
          :order-by.sync="orderBy"
          @change-order="changeCellsOrder"
          @colEvent="openAlarmPanel"
          :page.sync="page"
          :page-limit.sync="pageLimit"
          :total="total || 0"
          :size="5"
          :show-extra-columns.sync="showExtraCells"
        >
          <template v-if="!userIsByCustomerAccount" slot="actions" slot-scope="{ row }">
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
import { fetchAlarmsWithInfos, searchAlarmById } from '@/api/alarms';
import { formatBackErrors } from '@/utils/errors';

import UiButton from '@/components/ui/Button';

import LoaderContainer from '@/components/LoaderContainer';
import TableSkeleton from '@/components/ui/skeletons/TableSkeleton';

import { mapMutations, mapState, mapGetters } from 'vuex';

export default {
  components: {
    DataTable,
    ActionsCell,
    LoaderContainer,
    TableSkeleton,
    UiButton,
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
      total: 0,
      columns: [
        col(1, this.$t('col.id'), 'id', true, false, {
          component: IdCell,
        }),
        col(2, this.$t('getparc.lineDetail.alarms.name'), 'name', true, false, {
          component: TypeCell,
        }),
        col(3, this.$t('getparc.lineDetail.alarms.threshold'), 'threshold', true, false, {
          component: ThresholdTriggers,
        }),
        col(4, this.$t('col.status'), 'status', true, false, {
          component: StatusCell,
        }),
        col(5, this.$t('getparc.lineDetail.alarms.trigger'), 'trigger', true, false, {
          component: TriggerCell,
        }),
        col(6, this.$t('getparc.lineDetail.alarms.scope'), 'scope', false, false),
        col(7, this.$t('getparc.lineDetail.alarms.observationCycle'), 'alarm', false, false, {
          type: 'ObjectAttribute',
          path: 'observationDelay',
        }),
      ],
      orderBy: {
        key: 'id',
        direction: 'DESC',
      },
      rows: [],
      showValidationModal: false,
      confirmationMessage: this.$t('getparc.actLines.alarmList.confirmationWarning'),
      isLoading: false,
      dueDate: undefined,
      isActive: undefined,
      isTriggered: false,
      hasNoActiveLines: false,
    };
  },
  computed: {
    ...mapState('actLines', ['limitPerPage']),
    ...mapGetters(['userIsByCustomerAccount']),
    pageLimit: {
      get() {
        return this.limitPerPage;
      },
      set(value) {
        this.setPageLimit(value);
      },
    },
    getPageInfo() {
      return { page: this.page - 1, limit: this.pageLimit };
    },
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
    ...mapMutations('actLines', ['setPageLimit']),

    createAlarm() {
      const doReset = () => {
        this.page = 1;
        this.fetchAlarms();
      };
      this.openPanel({
        title: this.$t('getvsion.table.create-alarm'),
        panelId: 'getvsion.table.create-alarm',
        wide: true,
        backdrop: true,
        ignoreClickAway: true,
        payload: {
          partner: this.content.party,
        },
        onClosePanel(params) {
          if (params && params.resetSearch) {
            doReset();
          }
        },
      });
    },

    async fetchAlarms() {
      this.isLoading = true;
      const response = await fetchAlarmsWithInfos(this.content.id, this.getPageInfo);

      if (response.errors && response.errors.length) {
        let errorMessage = '';
        const formatted = formatBackErrors(response.errors)
          .map((e) => e.errors)
          .flat();
        formatted.forEach((e) => {
          errorMessage = `${e.key}: ${e.value}`;
        });
        this.hasNoActiveLines = errorMessage.includes('SIMCARDINSTANCES_D_SIMCARDS_MUST_BE_ACTIVE');
      } else {
        this.rows = response.items;
        this.total = response.total;
      }
      this.isLoading = false;
    },
    changeCellsOrder(orderedCells) {
      const notVisibleCells = this.columns.filter((c) => !c.visible);
      this.columns = orderedCells.concat(notVisibleCells);
    },
    openAlarmPanel(payload) {
      if (payload.action === 'openTriggerHistory') {
        this.openTriggerHistory(payload);
      }

      if (payload.action === 'openAlarmModificationPanel') {
        this.openAlarmModificationPanel(payload);
      }
    },

    async openAlarmModificationPanel(payload) {
      const alarmData = await searchAlarmById(payload.row.alarm.id);
      const doReset = async () => {
        this.page = 1;
        this.fetchAlarms();
      };
      this.openPanel({
        title: this.$t('getvsion.detail-panel.change-alarm'),
        panelId: 'getvsion.table.create-alarm',
        payload: { duplicateFrom: { ...alarmData, toModify: true } },
        wide: true,
        backdrop: true,
        ignoreClickAway: true,
        onClosePanel(params) {
          if (params && params.resetSearch) {
            doReset();
          }
        },
      });
    },

    openTriggerHistory(payload) {
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

<style lang="scss" scoped>
.noActiveLine {
  text-align: center;
  font-size: 30px;
  margin-top: 60px;
  font-weight: 600;
  color: #ffb900;
}
</style>
