<template>
  <div>
    <div class="row mb-3 mt-3">
      <div class="col-md-8">
        <h2 class="text-gray font-weight-light" style="font-size: 2rem">
          {{ $t('getvsion.table.total', { total: total }) }}
        </h2>
      </div>
      <div class="col-md-4">
        <UiButton variant="secondary" block class="float-right" @click="createAlarm()">
          <i class="select-icon ic-Amplifier-Icon" />
          {{ $t('getvsion.table.create-alarm') }}
        </UiButton>
      </div>
    </div>
    <DataTable
      :columns="columns"
      :rows="rows || []"
      :page.sync="page"
      :page-limit.sync="pageLimit"
      :total="total || 0"
      :order-by.sync="orderBy"
      :show-extra-columns.sync="showExtraCells"
      :size="7"
    ></DataTable>
  </div>
</template>

<script>
import DataTable from '@/components/DataTable/DataTable';
import UiButton from '@/components/ui/Button';
import { col } from '@/components/DataTable/utils';
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';

import AlarmNameCell from './AlarmNameCell.vue';
import ThresholdCell from './ThresholdCell.vue';
import TargetedLinesCell from './TargetedLinesCell.vue';
import TriggeredEventsCell from './TriggeredEventsCell.vue';

export default {
  components: {
    DataTable,
    UiButton,
  },
  data() {
    return {
      showExtraCells: false,
      columns: [
        col(this.$t('col.id'), 'id', true, true),
        col(this.$t('getparc.lineDetail.alarms.name'), 'name', true, false, {
          component: AlarmNameCell,
        }),
        col(this.$t('getvsion.table.thresholds'), 'thresholds', true, false, {
          component: ThresholdCell,
        }),
        col(this.$t('getvsion.table.targetedLines'), 'targetedLines', true, false, {
          component: TargetedLinesCell,
        }),
        col(this.$t('getvsion.table.triggers '), 'triggers', true, false, {
          component: TriggeredEventsCell,
        }),
      ],
      pageLimit: 20,
      orderBy: {
        key: 'id',
        direction: 'DESC',
      },
    };
  },
  computed: {
    ...mapState('alarms', ['searchResponse', 'searchPage']),
    ...mapGetters('alarms', ['appliedFilters', 'isLoading']),
    page: {
      get() {
        return this.searchPage || 0;
      },
      set(newVal) {
        this.setPage(newVal);
      },
    },
    getPageInfo() {
      return { page: this.page - 1, limit: this.pageLimit };
    },
    total() {
      return this.searchResponse ? this.searchResponse.total : 0;
    },
    rows() {
      return this.searchResponse ? this.searchResponse.items : [];
    },
  },
  watch: {
    searchPage() {
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
    appliedFilters() {
      this.fetchAlarms();
    },
  },
  mounted() {
    this.fetchAlarms();
  },
  methods: {
    ...mapActions('alarms', ['fetchAlarmsFromApi']),
    ...mapMutations('alarms', ['setPage', 'setCurrentFilters', 'applyFilters']),
    createAlarm() {},
    fetchAlarms() {
      this.fetchAlarmsFromApi({
        orderBy: this.orderBy,
        pageInfo: this.getPageInfo,
        appliedFilters: this.appliedFilters,
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
