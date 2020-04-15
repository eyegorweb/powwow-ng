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
        :size="8"
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
import DataTable from '@/components/DataTable/DataTable';
import ReportsActions from './ReportsActions';
import GetSimOrdersCreatorCell from '@/views/GetSim/GetSimOrders/GetSimOrdersCreatorCell.vue';
import { mapGetters, mapMutations } from 'vuex';
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
      reportFrequencyChoices: [
        {
          id: 'ONCE',
          label: 'Une seule fois',
        },
        {
          id: 'DAILY',
          label: 'Journalier',
        },
        {
          id: 'WEEKLY',
          label: 'Hebdomadaire',
        },
        {
          id: 'MONTHLY',
          label: 'Mensuel',
        },
      ],
      columns: [
        {
          id: 2,
          label: this.$t('common.lastName'),
          orderable: true,
          visible: true,
          name: 'name',
          noHandle: true,
          fixed: true,
          format: {
            type: 'OpenPanel',
            getConfig: row => this.getPanelConfig(row),
          },
        },
        {
          id: 3,
          label: 'Date de création',
          orderable: true,
          visible: true,
          name: 'generationDate',
          exportId: 'generationDate',
          noHandle: true,
          fixed: true,
          format: {
            type: 'Getter',
            getter: row => {
              return row.generationDate;
            },
          },
        },
        {
          id: 4,
          label: 'Partenaire',
          orderable: true,
          visible: true,
          name: 'partner',
          exportId: 'partner',
          noHandle: true,
          fixed: true,
          format: {
            type: 'Getter',
            getter: row => {
              return row.party && row.party.name ? row.party.name : '';
            },
          },
        },
        {
          id: 5,
          label: 'Fréquence',
          orderable: true,
          visible: true,
          name: 'frequency',
          exportId: 'frequency',
          noHandle: true,
          fixed: true,
          format: {
            type: 'Getter',
            getter: row => {
              const foundLabelFrequency = this.reportFrequencyChoices.find(
                r => row.frequency === r.id
              );
              if (foundLabelFrequency) return foundLabelFrequency.label;
              return undefined;
            },
          },
        },
        {
          id: 6,
          label: 'Rapports générés',
          orderable: true,
          visible: true,
          name: 'generatedReports',
          exportId: 'generatedReports',
          noHandle: true,
          fixed: true,
          format: {
            type: 'Getter',
            getter: row => {
              return row.generatedReports;
            },
          },
        },
        {
          id: 7,
          label: 'Créé par',
          orderable: true,
          visible: true,
          name: 'creator',
          exportId: 'creator',
          noHandle: true,
          fixed: true,
          format: {
            component: GetSimOrdersCreatorCell,
          },
        },
        {
          id: 8,
          label: 'Champs',
          orderable: true,
          visible: false,
          name: 'fields',
          exportId: 'fields',
          noHandle: true,
          fixed: true,
          format: {
            type: 'Getter',
            getter: row => {
              return row.fields;
            },
          },
        },

        {
          id: 10,
          label: 'Activé',
          orderable: true,
          visible: false,
          name: 'enableEntity',
          exportId: 'enableEntity',
          noHandle: true,
          fixed: true,
          format: {
            type: 'Getter',
            getter: row => {
              return row.enableEntity && row.enableEntity.disabled ? row.enableEntity.disabled : '';
            },
          },
        },
      ],
      orderBy: {
        key: 'id',
        direction: 'DESC',
      },
      total: undefined,
      rows: [],
    };
  },
  mounted() {
    this.fetchResults();
  },
  computed: {
    ...mapGetters(['userInfos', 'userIsBO', 'userIsPartner']),
    partnerId() {
      if (this.userIsBO) return undefined;
      return this.userInfos && this.userInfos.partners && this.userInfos.partners.length
        ? this.userInfos.partners[0].id
        : null;
    },
  },
  methods: {
    ...mapMutations(['openPanel']),

    getPanelConfig(row) {
      const doReset = () => {
        this.page = 1;
        this.fetchResults();
      };
      return {
        title: this.$t('getreport.create_report'),
        panelId: 'getreport.create_report',
        wide: true,
        width: '50%',
        backdrop: true,
        ignoreClickAway: true,
        payload: row,
        onClosePanel(params) {
          if (params && params.resetSearch) {
            doReset();
          }
        },
      };
    },

    async fetchResults(payload) {
      const { pagination, orderBy } = payload || {
        pagination: { page: 0, limit: 10 },
        orderBy: {
          key: 'id',
          direction: 'DESC',
        },
      };

      const response = await fetchReports(orderBy, pagination, this.partnerId);

      if (response) {
        this.total = response.total;
        this.rows = response.items;
      }
    },

    createReport() {
      const doReset = () => {
        this.page = 1;
        this.fetchResults();
      };
      this.openPanel({
        title: this.$t('getreport.create_report'),
        panelId: 'getreport.create_report',
        wide: true,
        width: '50%',
        backdrop: true,
        ignoreClickAway: true,
        onClosePanel(params) {
          if (params && params.resetSearch) {
            doReset();
          }
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
