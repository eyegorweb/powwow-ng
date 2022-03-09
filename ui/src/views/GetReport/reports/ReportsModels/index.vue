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
      <TableWithFilter
        @applyFilters="applyFilters"
        :columns="columns"
        :filters="filters"
        :rows="rows"
        :page.sync="page"
        :is-loading="isLoading"
        :page-limit.sync="pageLimit"
        :total="total"
        :order-by.sync="orderBy"
        :show-extra-columns.sync="showExtraCells"
        :size="6"
      >
        <template slot="actions" slot-scope="{ row }">
          <ReportsActions
            :report="row"
            @actionIsDone="applyFilters()"
            :panel-config="getPanelConfig(row)"
          />
        </template>
      </TableWithFilter>
    </div>
  </div>
</template>

<script>
import Tooltip from '@/components/ui/Tooltip';
import UiButton from '@/components/ui/Button';
import ReportsActions from './ReportsActions';
import GeneratedReportsCell from './GeneratedReportsCell';
import FieldsReportCell from './FieldsReportCell';
import GetSimOrdersCreatorCell from '@/views/GetSim/GetSimOrders/GetSimOrdersCreatorCell.vue';
import { mapGetters, mapMutations } from 'vuex';
import { fetchReports } from '@/api/reports.js';
import TableWithFilter from '@/components/Filters/TableWithFilter';

// Filtres du tableau
import PartnerFilter from '../filters/PartnerFilter';
import UsersFilter from '@/components/Filters/filterbar/UsersFilter';

export default {
  components: {
    Tooltip,
    UiButton,
    TableWithFilter,
    ReportsActions,
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
          label: this.$t('report.creationDate'),
          orderable: true,
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
          label: this.$t('report.partenaire'),
          orderable: true,
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
          label: this.$t('report.frequency'),
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
          label: this.$t('report.generatedReports'),
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
          label: this.$t('report.creator'),
          orderable: true,
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
          label: this.$t('report.fields'),
          orderable: true,
          visible: false,
          name: 'fields',
          exportId: 'fields',
          noHandle: true,
          format: {
            component: FieldsReportCell,
          },
          // format: {
          //   type: 'Getter',
          //   getter: (row) => {
          //     return row.fields;
          //   },
          // },
        },

        {
          id: 10,
          label: this.$t('report.generationStatus'),
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
      filters: [
        {
          title: 'filters.partner',
          component: PartnerFilter,
          onChange(chosenValue) {
            return {
              id: 'filters.partner',
              value: chosenValue.label,
              data: chosenValue,
            };
          },
        },
        {
          title: 'filters.reportOwner',
          component: UsersFilter,
          onChange(chosenValue) {
            if (chosenValue) {
              return {
                id: 'filters.reportOwner',
                value: chosenValue.label,
                data: chosenValue,
              };
            }
          },
        },
      ],
      currentAppliedFilters: [],
      orderBy: {
        key: 'id',
        direction: 'DESC',
      },
      total: undefined,
      rows: [],
    };
  },
  mounted() {
    this.applyFilters();
  },
  computed: {
    ...mapGetters(['userInfos', 'userIsBO', 'userIsPartner']),
    partnerId() {
      if (this.userIsBO) return undefined;
      return this.userInfos && this.userInfos.partners && this.userInfos.partners.length
        ? this.userInfos.partners[0].id
        : null;
    },
    pageInfo() {
      return {
        page: this.page - 1,
        limit: this.pageLimit,
      };
    },
  },
  methods: {
    ...mapMutations(['openPanel']),
    async applyFilters(payload) {
      let { pagination, filters } = payload || {
        pagination: { page: 0, limit: 20 },
        filters: [],
      };

      if (this.appliedFilters && this.appliedFilters.length) {
        filters = [...filters, ...this.appliedFilters];
      }

      let reportName;
      let partner;
      if (filters) {
        filters.forEach((e) => {
          e.id === 'filters.reportOwner' ? (reportName = e.data.label) : undefined;
          e.id === 'filters.partner' ? (partner = e.data.id) : undefined;
        });
      }

      let data;
      this.isLoading = true;
      if (filters.length > 0) {
        data = await fetchReports(this.orderBy, pagination, partner, reportName);
      } else {
        data = await fetchReports(this.orderBy, this.pageInfo);
      }

      this.isLoading = false;

      this.total = data.total;
      this.rows = data.items;

      this.currentAppliedFilters = filters;
    },
    getPanelConfig(row) {
      const doReset = () => {
        this.page = 1;
        this.applyFilters();
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

    createReport() {
      const doReset = () => {
        this.page = 1;
        this.applyFilters();
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
      this.applyFilters();
    },
    pageLimit() {
      this.page = 1;
      this.applyFilters();
    },
    page() {
      this.applyFilters();
    },
  },
};
</script>

<style lang="scss" scoped></style>
