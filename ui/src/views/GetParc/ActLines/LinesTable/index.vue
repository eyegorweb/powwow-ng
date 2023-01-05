<template>
  <LoaderContainer :is-loading="isLoading">
    <div slot="on-loading">
      <SearchResultSkeleton :columns="columns" />
    </div>
    <div>
      <template v-if="!showInfoMessage">
        <div class="row mb-3">
          <div class="col">
            <h2 class="text-gray font-weight-light" style="font-size: 2rem">
              <slot name="title" v-if="!apiError">
                <template>
                  {{
                    $t('getparc.actLines.total', {
                      total: formattedTotal,
                    })
                  }}
                  <button v-if="formattedTotal === 0" class="btn btn-link" @click="resetSearch">
                    {{ $t('resetFilters') }}
                  </button>
                </template>
              </slot>
              <slot name="title" v-else>
                {{ $t('searchError') }}
              </slot>
            </h2>
          </div>
          <div class="col" v-if="hasResults">
            <ExportButton
              export-all
              :export-fn="getExportFn()"
              :on-error-fn="getExportErrorCallback()"
              :columns="orderedColumns"
              :order-by="orderBy"
              :export-choices="exportChoices"
              :other-export-choices="otherExportChoices"
              :get-export-choice-disabled-message="getExportChoiceDisabledMessage"
              :get-export-type-disabled-message="getExportTypeDisabledMessage"
              :nb-of-lines="total"
            >
              <span slot="title">
                {{ $t('getparc.history.details.EXPORT_LINES', { total: formattedTotal }) }}
              </span>
            </ExportButton>
          </div>
        </div>
        <template v-if="hasResults">
          <DataTable
            storage-id="getparc.lines"
            storage-version="028"
            v-if="columns"
            :columns="columns"
            :rows="rows || []"
            :page.sync="page"
            :page-limit.sync="pageLimit"
            :total="total || 0"
            :order-by.sync="orderBy"
            :show-extra-columns.sync="showExtraCells"
            :size="7"
            @columnOrdered="orderedColumns = $event"
          >
            <template slot="topLeftCorner">
              <SearchByLinesId @searchById="searchById" :init-value="searchByIdValue" />
            </template>
          </DataTable>
        </template>
        <template v-else>
          <div class="alert alert-light">{{ $t('noResult') }}</div>
        </template>
      </template>
      <template v-else>
        <div class="row">
          <div class="col-md-8">
            <template v-if="!actToCreate">
              <h4>{{ $t('getparc.search-lines-by-id') }}</h4>
              <SearchByLinesId @searchById="searchById" :init-value="searchByIdValue" />
            </template>
          </div>
        </div>

        <div class="alert alert-primary text-center mt-2 search-msg" role="alert">
          <div class="ms-container">
            <span>
              {{ $t('getparc.screen-search') }}
            </span>
          </div>
        </div>
      </template>
    </div>
  </LoaderContainer>
</template>

<script>
import { mapGetters, mapActions, mapMutations, mapState } from 'vuex';
import { fetchCustomFields } from '@/api/customFields';
import CheckBoxCell from './CheckBoxCell';
import DataTable from '@/components/DataTable/DataTable';
import LoaderContainer from '@/components/LoaderContainer';
import SearchByLinesId from '@/views/GetParc/ActLines/SearchByLinesId';
// import Title from '../Title';
import IccidCell from './IccidCell';
// import LinkTo from './LinkTo';
import DateStatus from '@/views/GetParc/UnitActionsPage/DateStatus';
import ExportButton from '@/components/ExportButton';
import { formatBackErrors } from '@/utils/errors';
import { getFromLatestLineFromAccessPoint } from '@/utils/line.js';

import { exportSimCardInstances } from '@/api/linesActions';
import { formatLargeNumber } from '@/utils/numbers';
import get from 'lodash.get';
import { setTimeout } from 'timers';
import SearchResultSkeleton from '@/components/ui/skeletons/SearchResultSkeleton';
import { isFiltersAcceptable } from '@/utils/filters.js';
import { isFeatureAvailable } from '@/api/partners';

export default {
  components: {
    DataTable,
    LoaderContainer,
    SearchByLinesId,
    ExportButton,
    SearchResultSkeleton,
  },

  props: {
    creationMode: Boolean,
    actToCreate: Object,
    widgetInitSearchById: undefined,
    queryFiltersFromOrder: undefined,
  },

  computed: {
    ...mapGetters('actLines', ['linesActionsResponse', 'appliedFilters', 'linePage', 'isLoading']),
    ...mapState('actLines', ['limitPerPage', 'apiError']),
    ...mapGetters([
      'userIsBO',
      'userIsPartner',
      'userInfos',
      'userName',
      'singlePartner',
      'havePermission',
      'userIsOperator',
      'userIsByCustomerAccount',
    ]),
    ...mapState({
      isOpen: (state) => state.ui.isPanelOpen,
    }),
    ...mapState({
      nextPage: (state) => state.ui.nextPage,
    }),

    pageLimit: {
      get() {
        return this.limitPerPage;
      },
      set(value) {
        this.setPageLimit(value);
      },
    },

    total() {
      return this.linesActionsResponse ? this.linesActionsResponse.total : 0;
    },
    formattedTotal() {
      return formatLargeNumber(this.total);
    },
    rows() {
      return this.linesActionsResponse ? this.linesActionsResponse.items : [];
    },
    page: {
      get() {
        return this.linePage || 0;
      },
      set(newVal) {
        this.setPage(newVal);
      },
    },
    getPageInfo() {
      return { page: this.page - 1, limit: this.pageLimit };
    },
    /*
    msisdn() {
      return getFromLatestLineFromAccessPoint(this.row.accessPoint, 'msisdn');
    },
    //*/
    hasResults() {
      return !!(this.rows && this.rows.length);
    },

    isServicesEnabled() {
      return !!this.appliedFilters.find((a) => a.id === 'filters.partners');
    },

    exportChoices() {
      const exportChoices = [
        {
          id: 'CLASSIC',
          label: 'exportTable.classic',
          disabled: false,
        },
        {
          id: 'FULL',
          label: 'exportTable.complete',
          disabled: this.userIsByCustomerAccount,
        },
        {
          id: 'CONSUMPTION',
          label: 'exportTable.inProgress',
          disabled: !this.isPartnerSelected,
        },
      ];

      return exportChoices;
    },

    isPartnerSelected() {
      return (
        (this.userIsBO && !!this.appliedFilters.find((f) => f.id === 'filters.partners')) ||
        this.userIsPartner
      );
    },

    otherExportChoices() {
      const otherExportChoices = [];

      if (this.havePermission('getParc', 'export_service') && !this.userIsByCustomerAccount) {
        otherExportChoices.push({
          id: 'SERVICES',
          label: 'exportTable.services',
        });
      }

      if (
        this.havePermission('getParc', 'export_service') &&
        this.hasStreamPDP &&
        !this.userIsByCustomerAccount
      ) {
        otherExportChoices.push({
          id: 'STREAM_SERVICES',
          label: 'exportTable.streamServices',
        });
      }

      if (this.havePermission('getParc', 'export_last_usage')) {
        otherExportChoices.push({
          id: 'LAST_USAGE',
          label: 'exportTable.lastUsage',
        });
      }

      if (
        this.havePermission('getParc', 'export_last_usage') &&
        this.hasStreamPDP &&
        !this.userIsByCustomerAccount
      ) {
        otherExportChoices.push({
          id: 'STREAM_LAST_USAGE',
          label: 'exportTable.streamLastUsage',
        });
      }

      if (this.havePermission('getParc', 'export_bo') && !this.userIsByCustomerAccount) {
        otherExportChoices.push({
          id: 'BACKOFFICE',
          label: 'exportTable.BO',
        });
      }

      return otherExportChoices;
    },

    isUniquePartnerForServicesExport() {
      const partnerFilter = this.appliedFilters.find((a) => a.id === 'filters.partners');
      let mvnoFound = false;
      if (partnerFilter && partnerFilter.values && partnerFilter.values.length) {
        mvnoFound = partnerFilter.values.find((f) => f.partyType === 'MVNO');
        return !mvnoFound && partnerFilter.values.length === 1;
      } else {
        return false;
      }
    },

    isChosenPartnerValidForExport() {
      const partnerFilter = this.appliedFilters.find((a) => a.id === 'filters.partners');

      if (partnerFilter) {
        const partnerNotFound = partnerFilter.values && !partnerFilter.values.length;

        let mvnoFound = false;
        if (partnerFilter.values && partnerFilter.values.length) {
          mvnoFound = partnerFilter.values.find((f) => f.partyType === 'MVNO');
        }

        return !partnerNotFound && !mvnoFound;
      }

      return false;
    },
  },
  methods: {
    ...mapActions('actLines', ['fetchLinesActionsFromApi', 'initFilterForContext']),
    ...mapMutations('actLines', [
      'setPage',
      'applyFilters',
      'forceAppliedFilters',
      'setPageLimit',
      'startSearchingById',
    ]),
    ...mapMutations(['openPanel']),

    enableSearchLines() {
      this.canSearchLines = true;
      if (this.widgetInitSearchById) {
        this.searchById(this.widgetInitSearchById);
      }
      if (this.queryFiltersFromOrder) {
        this.searchById(this.queryFiltersFromOrder);
      }
    },

    resetSearch() {
      this.searchByIdValue = undefined;
      this.showInfoMessage = true;
    },

    searchById(params) {
      if (params) {
        this.searchByIdValue = params.value;
        this.page = 1;
        this.startSearchingById([
          {
            id: params.id,
            value: params.value,
          },
        ]);
      } else {
        this.searchByIdValue = undefined;
        this.applyFilters();
      }
    },
    async initFetchLinesActions() {
      if (!this.canSearchLines) return;

      if (this.showInfoMessage) this.showInfoMessage = false;

      this.applyFilters();

      this.fetchLinesActionsFromApi({
        orderBy: this.orderBy,
        pageInfo: this.getPageInfo,
        appliedFilters: this.appliedFilters,
      });
    },

    async fetchLinesActions() {
      if (!this.canSearchLines) return;

      if (this.showInfoMessage) this.showInfoMessage = false;

      this.fetchLinesActionsFromApi({
        orderBy: this.orderBy,
        pageInfo: this.getPageInfo,
        appliedFilters: this.appliedFilters,
      });
    },
    async fetchPartyFeatures() {
      this.hasStreamPDP = await isFeatureAvailable('STREAM_PDP');
    },
    getExportErrorCallback() {
      return (errors) => {
        const formattedErrors = formatBackErrors(errors);
        if (formattedErrors) {
          const haveSimStatusError = formattedErrors[0].errorKeys.find(
            (e) => e === 'simStatus.Required'
          );
          if (haveSimStatusError) {
            return this.$t('needActiveLines');
          }
          const haveExportEmptyError = formattedErrors[0].errorKeys.find(
            (e) => e === 'export.EXPORT_EMPTY'
          );
          if (haveExportEmptyError) {
            return this.$t('exportEmpty');
          }
          const haveIDPartnerError = formattedErrors[0].errorKeys.find(
            (e) => e === 'idParty.Required'
          );
          if (haveIDPartnerError) {
            return `${this.$t('getparc.actCreation.report.errors.partyId.idParty')}`;
          }
          const havePartnerNotAllowed = formattedErrors[0].errorKeys.find(
            (e) => e === 'idParty.NotAllowed'
          );
          if (havePartnerNotAllowed) {
            return `${this.$t('getparc.actCreation.report.errors.partyId.notAllowed')}`;
          }

          return this.$t('exportError');
        }
      };
    },

    getExportTypeDisabledMessage(option) {
      let message = '';
      if (!this.isPartnerSelected && option === 'exportTable.inProgress') {
        message = this.$t('getreport.errors.partnerRequired');
      }
      return message;
    },

    getExportChoiceDisabledMessage(option) {
      let errorMessages = [];
      if (option === 'exportTable.services' || option === 'exportTable.streamServices') {
        const haveStatusFilter = this.appliedFilters.find(
          (a) => a.id === 'filters.lines.SIMCardStatus'
        );
        const isStatusFilterOk =
          haveStatusFilter &&
          isFiltersAcceptable(this.appliedFilters, [
            {
              id: 'filters.lines.SIMCardStatus',
              values: [
                {
                  id: 'ACTIVATED',
                },
                { id: 'SUSPENDED' },
              ],
            },
          ]);

        if (!this.isChosenPartnerValidForExport || !this.isUniquePartnerForServicesExport) {
          errorMessages.push(`- ${this.$t('getparc.actCreation.rechargeLV.partnerExportError')}`);
        }

        if (!isStatusFilterOk) {
          errorMessages.push(`- ${this.$t('getparc.actCreation.rechargeLV.simStatusError')}`);
        }

        if (errorMessages.length) {
          return errorMessages.join(`\n`);
        }
      } else if (option === 'exportTable.inProgress') {
        if (!this.isChosenPartnerValidForExport) {
          return `- ${this.$t('getparc.actCreation.rechargeLV.partnerExportError')}`;
        }
      }

      return false;
    },

    getExportFn() {
      return async (
        columns,
        orderBy,
        exportFormat,
        asyncExportRequest,
        exportAll,
        forceAsyncExport,
        exportChoice
      ) => {
        return exportSimCardInstances(
          columns,
          orderBy,
          exportFormat,
          this.appliedFilters,
          asyncExportRequest,
          exportAll,
          exportChoice
        );
      };
    },
  },
  watch: {
    rows(items) {
      this.$emit('noResults', items.length === 0);
    },
    linePage() {
      this.fetchLinesActions();
    },
    orderBy() {
      this.page = 1;

      this.fetchLinesActions();
    },
    pageLimit() {
      this.page = 1;

      this.fetchLinesActions();
    },
    appliedFilters() {
      this.page = 1;

      this.fetchLinesActions();
    },
  },
  async mounted() {
    if (this.userIsPartner) {
      const partnerId = this.singlePartner.id;
      const customFields = await fetchCustomFields(partnerId);
      const partnerCustomFieldsColumns = customFields.customFields.map((c) => {
        return {
          id: c.id,
          label: c.label,
          name: 'accessPoint',
          orderable: false,
          visible: false,
          // exportId: 'ORDER_STATUS',
          format: {
            type: 'ObjectAttribute',
            path: 'customFields.' + c.codeInOrder,
          },
        };
      });
      this.columns = [...this.commonColumns, ...partnerCustomFieldsColumns];
    } else {
      this.columns = [...this.commonColumns, ...this.defaultCustomFieldsColumns];
    }
    if (this.havePermission('getVision', 'read')) {
      this.columns = [...this.columns, ...this.columnsGetVision];
    }

    if (this.rows.length > 0) {
      this.showInfoMessage = false;
      this.enableSearchLines();
    } else {
      setTimeout(() => {
        this.enableSearchLines();
      });
    }
    await this.fetchPartyFeatures();
  },
  data() {
    return {
      canSearchLines: false,
      showInfoMessage: true,
      searchByIdValue: undefined,
      columns: undefined,
      hasStreamPDP: false,
      orderedColumns: undefined,
      commonColumns: [
        {
          id: 99,
          label: '',
          name: 'partner',
          orderable: false,
          visible: true,
          noHandle: true,
          notConfigurable: true,
          format: {
            component: CheckBoxCell,
          },
          visibleWhen: () => {
            return this.creationMode;
          },
        },
        {
          id: 2,
          label: this.$t('getparc.actDetail.col.iccid'),
          orderable: true,
          visible: true,
          name: 'iccid',
          exportId: 'LINE_ICCID',
          noHandle: true,
          fixed: true,
          format: {
            component: IccidCell,
          },
        },
        {
          id: 1,
          label: this.$t('col.partner'),
          orderable: true,
          sortingName: 'partyName',
          visible: true,
          name: 'party',
          exportId: 'PARTY_ID',
          format: {
            type: 'ObjectAttribute',
            path: 'name',
          },
        },
        {
          id: 3,
          label: this.$t('getparc.actDetail.col.msisdn'),
          exportId: 'LINE_MSISDN',
          name: 'accessPoint',
          format: {
            type: 'Getter',
            getter: (row) => {
              return getFromLatestLineFromAccessPoint(row.accessPoint, 'msisdn');
            },
          },
          orderable: false,
          sortingName: 'msisdn',
          visible: true,
        },
        {
          id: 4,
          label: this.$t('getparc.actDetail.col.imsi'),
          name: 'accessPoint',
          exportId: 'LINE_IMSI',
          format: {
            type: 'Getter',
            getter: (row) => {
              return getFromLatestLineFromAccessPoint(row.accessPoint, 'imsi');
            },
          },
          orderable: false,
          sortingName: 'imsi',
          visible: true,
        },
        {
          id: 5,
          label: this.$t('getparc.actLines.col.lineStatus'),
          orderable: true,
          sortingName: 'simStatus',
          visible: true,
          name: 'statusTranslated',
          exportId: 'LINE_SIM_STATUS',
        },
        {
          id: 6,
          label: this.$t('filters.lines.statusDate'),
          name: 'accessPoint',
          orderable: true,
          sortingName: 'statusDate',
          visible: true,
          exportId: 'LINE_COMMERCIAL_DATE',
          format: {
            component: DateStatus,
          },
        },
        {
          id: 7,
          label: this.$t('col.offer'),
          name: 'accessPoint',
          exportId: 'LINE_OFFER',
          format: {
            type: 'Getter',
            getter: (row) => {
              if (get(row, 'party.partyType') === 'MULTI_CUSTOMER') {
                return get(row, 'workflow.workflowDescription');
              }
              return get(row, 'accessPoint.offer.marketingOffer.description');
            },
          },
          orderable: false,
          visible: false,
        },
        {
          id: 10,
          label: this.$t('getparc.actLines.col.msisdnA'),
          name: 'accessPoint',
          format: {
            type: 'Getter',
            getter: (row) => {
              return getFromLatestLineFromAccessPoint(row.accessPoint, 'msisdnA');
            },
          },
          exportId: 'LINE_AMSISDN',
          orderable: false,
          visible: false,
        },
        {
          id: 11,
          label: this.$t('getparc.actLines.col.manufacturer'),
          name: 'deviceInstance',
          exportId: 'LINE_MANUFACTURER',
          format: {
            type: 'ObjectAttribute',
            path: 'manufacturer',
          },
          orderable: true,
          sortingName: 'manufacturer',
          visible: false,
        },
        {
          id: 12,
          label: this.$t('getparc.actLines.col.deviceReference'),
          name: 'deviceInstance',
          exportId: 'LINE_DEVICE_REFERENCE',
          format: {
            type: 'ObjectAttribute',
            path: 'deviceReference',
          },
          orderable: true,
          sortingName: 'deviceReference',
          visible: false,
        },

        {
          id: 21,
          label: this.$t('col.commercialStatus'),
          name: 'accessPoint',
          visible: false,
          exportId: 'LINE_COMMERCIAL_STATUS',
          format: {
            type: 'ObjectAttribute',
            path: 'commercialStatusTranslated',
          },
        },
        {
          id: 22,
          label: this.$t('col.activation_date'),
          name: 'accessPoint',
          visible: false,
          exportId: 'LINE_ACTIVATION_DATE',
          format: {
            type: 'ObjectAttribute',
            path: 'activationDate',
          },
        },
        {
          id: 23,
          label: this.$t('col.billingAccount'),
          name: 'accessPoint',
          visible: false,
          exportId: 'BILLING_ACCOUNT',
          format: {
            type: 'Getter',
            getter: (row) => {
              return (
                get(row, 'accessPoint.offerGroup.customerAccount.code', '') +
                ' - ' +
                get(row, 'accessPoint.offerGroup.customerAccount.name', '')
              );
            },
          },
        },
        {
          id: 24,
          label: this.$t('filters.lines.community'),
          name: 'accessPoint',
          exportId: 'yorkCommunity',
          format: {
            type: 'Getter',
            getter: (row) => {
              return get(row, 'accessPoint.lines[0].yorkCommunity', '-');
            },
          },
          orderable: false,
          visible: false,
        },
      ],
      columnsGetVision: [
        {
          id: 8,
          label: this.$t('getparc.actLines.col.lastPLMN'),
          name: 'lastCountry',
          orderable: false,
          visible: false,
        },
      ],
      defaultCustomFieldsColumns: [
        {
          id: 15,
          label: this.$t('col.customFields', { num: 1 }),
          name: 'accessPoint',
          visible: false,
          exportId: 'LINE_CUSTOM_FIELD1',
          format: {
            type: 'ObjectAttribute',
            path: 'customFields.custom1',
          },
        },
        {
          id: 16,
          label: this.$t('col.customFields', { num: 2 }),
          name: 'accessPoint',
          visible: false,
          exportId: 'LINE_CUSTOM_FIELD2',
          format: {
            type: 'ObjectAttribute',
            path: 'customFields.custom2',
          },
        },
        {
          id: 17,
          label: this.$t('col.customFields', { num: 3 }),
          name: 'accessPoint',
          visible: false,
          exportId: 'LINE_CUSTOM_FIELD3',
          format: {
            type: 'ObjectAttribute',
            path: 'customFields.custom3',
          },
        },
        {
          id: 18,
          label: this.$t('col.customFields', { num: 4 }),
          name: 'accessPoint',
          visible: false,
          exportId: 'LINE_CUSTOM_FIELD4',
          format: {
            type: 'ObjectAttribute',
            path: 'customFields.custom4',
          },
        },
        {
          id: 19,
          label: this.$t('col.customFields', { num: 5 }),
          name: 'accessPoint',
          visible: false,
          exportId: 'LINE_CUSTOM_FIELD5',
          format: {
            type: 'ObjectAttribute',
            path: 'customFields.custom5',
          },
        },
        {
          id: 20,
          label: this.$t('col.customFields', { num: 6 }),
          name: 'accessPoint',
          visible: false,
          exportId: 'LINE_CUSTOM_FIELD6',
          format: {
            type: 'ObjectAttribute',
            path: 'customFields.custom6',
          },
        },
      ],
      orderBy: {
        key: 'id',
        direction: 'DESC',
      },
      showExtraCells: false,
    };
  },
};
</script>

<style lang="scss" scoped>
.step-title {
  text-transform: uppercase;
  color: $primary;
  span {
    font-size: 1rem;
  }

  h4 {
    position: relative;
    font-size: 1rem;
  }

  h4 span.text {
    background-color: $light-gray;
    color: $secondary;
    font-weight: 640;
    font-size: 1rem;
    padding-left: 10px;
    padding-right: 10px;
  }

  h4:after {
    content: '';
    position: absolute;
    bottom: 0.5rem;
    left: 0;
    right: 0;
    height: 0.5em;
    border-top: 1px solid $medium-gray;
    z-index: -1;
  }
}

.search-msg {
  height: 10rem;
  display: flex;
  flex-wrap: wrap;
  align-content: center;

  .ms-container {
    width: 100%;
    font-size: 1.5rem;
  }
}
</style>
