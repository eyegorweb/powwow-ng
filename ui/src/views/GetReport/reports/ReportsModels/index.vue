<template>
  <div class="mt-4">
    <div class="row mb-4">
      <div class="col-md-9">
        <h4>
          <b>GetReport</b>
          - {{ $t('getreport.pageTitle') }}
          <Tooltip direction="right">{{ $t('getreport.reports_tooltip') }}</Tooltip>
        </h4>
      </div>
      <div class="col-md-3">
        <UiButton variant="secondary" block class="float-right" @click="createReport()">
          <i class="select-icon ic-Amplifier-Icon" />
          {{ $t('getreport.create_report') }}
        </UiButton>
      </div>
    </div>
    <div class="mt-4 mb-4">
      <DataTable
        :columns="columns"
        :rows="rows || []"
        :page.sync="page"
        :page-limit.sync="pageLimit"
        :total="total || 0"
        :order-by.sync="orderBy"
        :show-extra-columns.sync="showExtraCells"
        :size="7"
      >
        <template slot="actions" slot-scope="{ row }">
          <ReportsActions :report="row" />
        </template>
      </DataTable>
    </div>
  </div>
</template>

<script>
import Tooltip from '@/components/ui/Tooltip';
import UiButton from '@/components/ui/Button';
import { mapMutations } from 'vuex';

import DataTable from '@/components/DataTable/DataTable';
import ReportsActions from './ReportsActions';
import { fetchReports } from '@/api/reports.js';

export default {
  components: {
    Tooltip,
    UiButton,
    DataTable,
    ReportsActions,
  },

  data() {
    return {
      page: 1,
      pageLimit: 10,
      showExtraCells: false,
      columns: [
        {
          id: 2,
          label: this.$t('col.id'),
          orderable: true,
          visible: true,
          name: 'name',
          exportId: 'ID',
          noHandle: true,
          fixed: true,
          format: {
            type: 'Getter',
            getter: row => {
              return row.name;
            },
          },
        },
      ],
      orderBy: {
        key: 'id',
        direction: 'DESC',
      },

      total: 10,
      rows: [],
      partnerID: 2,
    };
  },
  mounted() {
    this.fetchResults();
  },
  methods: {
    ...mapMutations(['openPanel']),

    async fetchResults() {
      const data = await fetchReports(
        this.orderBy,
        { page: this.page - 1, limit: this.pageLimit },
        this.partnerID
      );

      this.total = data.total;
      this.rows = data.data;
    },

    createReport() {
      this.openPanel({
        title: this.$t('getreport.create_report'),
        panelId: 'getreport.create_report',
        wide: true,
        width: '50%',
        backdrop: true,
        ignoreClickAway: true,
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
