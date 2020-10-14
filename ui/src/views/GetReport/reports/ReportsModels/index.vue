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
      <LoaderContainer :is-loading="isLoading">
        <div slot="on-loading">
          <TableSkeleton :columns="columns" :size="3" />
        </div>
        <DataTable
          :columns="columns"
          :rows="rows || []"
          :page.sync="page"
          :page-limit.sync="pageLimit"
          :total="total || 0"
          :order-by.sync="orderBy"
          :show-extra-columns.sync="showExtraCells"
          :size="6"
        >
          <template slot="actions" slot-scope="{ row }">
            <ReportsActions
              :report="row"
              @actionIsDone="fetchResults()"
              :panel-config="getPanelConfig(row)"
            />
          </template>
        </DataTable>
      </LoaderContainer>
    </div>
  </div>
</template>

<script>
import Tooltip from '@/components/ui/Tooltip';
import UiButton from '@/components/ui/Button';
import DataTable from '@/components/DataTable/DataTable';
import ReportsActions from './ReportsActions';
import GeneratedReportsCell from './GeneratedReportsCell';
import GetSimOrdersCreatorCell from '@/views/GetSim/GetSimOrders/GetSimOrdersCreatorCell.vue';
import { mapGetters, mapMutations } from 'vuex';
import { fetchReports } from '@/api/reports.js';
import TableSkeleton from '@/components/ui/skeletons/TableSkeleton';
import LoaderContainer from '@/components/LoaderContainer';

export default {
  components: {
    Tooltip,
    UiButton,
    DataTable,
    ReportsActions,
    TableSkeleton,
    LoaderContainer,
  },
  data() {
    return {
      page: 1,
      pageLimit: 10,
      showExtraCells: false,
      isLoading: true,
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
          format: {
            type: 'OpenPanel',
            getConfig: (row) => this.getPanelConfig(row),
          },
        },
        {
          id: 3,
          label: 'Date de création',
          orderable: false,
          visible: true,
          name: 'generationDate',
          exportId: 'generationDate',
          noHandle: true,
          format: {
            type: 'Getter',
            getter: (row) => {
              return row.generationDate;
            },
          },
        },
        {
          id: 4,
          label: 'Partenaire',
          orderable: false,
          visible: true,
          name: 'partner',
          exportId: 'partner',
          noHandle: true,
          format: {
            type: 'Getter',
            getter: (row) => {
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
          format: {
            type: 'Getter',
            getter: (row) => {
              const foundLabelFrequency = this.reportFrequencyChoices.find(
                (r) => row.frequency === r.id
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
          format: {
            component: GeneratedReportsCell,
          },
        },
        {
          id: 7,
          label: 'Créé par',
          orderable: false,
          visible: true,
          name: 'creator',
          exportId: 'creator',
          noHandle: true,
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
          format: {
            type: 'Getter',
            getter: (row) => {
              return row.fields;
            },
          },
        },

        {
          id: 10,
          label: 'Statut',
          orderable: false,
          visible: false,
          name: 'generationStatus',
          exportId: 'generationStatus',
          noHandle: true,
          format: {
            type: 'Getter',
            getter: (row) => {
              return this.$t('getreport.report_statut.' + row.generationStatus);
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
        pagination: { page: 0, limit: this.pageLimit },
        orderBy: this.orderBy,
      };

      this.isLoading = true;
      const response = await fetchReports(orderBy, pagination, this.partnerId);
      this.isLoading = false;

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
  watch: {
    orderBy() {
      this.page = 1;
      this.fetchResults();
    },
    pageLimit() {
      this.page = 1;
      this.fetchResults();
    },
  },
};
</script>

<style lang="scss" scoped></style>
