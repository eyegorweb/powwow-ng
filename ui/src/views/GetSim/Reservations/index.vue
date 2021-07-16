<template>
  <div>
    <div class="row mb-0">
      <div class="col-md-9"></div>
      <div class="col-md-3">
        <permission domain="getSim" action="create">
          <UiButton
            variant="accent"
            block
            class="float-right"
            @click="openCreateReservationPanel()"
          >
            {{ $t('getsim.reservations.createReservation') }}
          </UiButton>
        </permission>
      </div>
    </div>
    <TableWithFilter
      :storage-version="'001'"
      :storage-id="'getSim.reservations'"
      v-if="columns"
      :filters="filters"
      :columns="columns"
      :rows="rows"
      :total="total"
      :order-by.sync="orderBy"
      :is-table-loading="isLoading"
      :show-reset="!!searchByIdValue"
      @applyFilters="applyFilters"
      @columnOrdered="orderedColumns = $event"
      @currentFiltersChange="currentFilters = $event"
    >
      <div slot="title">
        {{ $t('getsim.reservations.tableTitle', { total: $formatLargeNumber(total) }) }}
      </div>

      <div slot="topRight">
        <ExportButton
          :export-fn="getExportFn()"
          :columns="orderedColumns"
          :order-by="orderBy"
          export-all
        >
          <span slot="title">{{
            $t('getsim.reservations.export', { total: $formatLargeNumber(total) })
          }}</span>
        </ExportButton>
      </div>

      <div slot="before-filters">
        <Indicators v-if="indicators" :meta="indicators" disable-click precalculated />
        <br />
      </div>

      <div slot="topLeft">
        <SearchByLinesId @searchById="searchById" :init-value="searchByIdValue" />
      </div>
    </TableWithFilter>
  </div>
</template>

<script>
import TableWithFilter from '@/components/Filters/TableWithFilter';
import PartnerFilter from '@/components/Filters/filterbar/PartnerFilter';
import BillingAccountFilter from '@/components/Filters/filterbar/BillingAccountFilter';
import SimcardTypeFilter from '@/components/Filters/filterbar/SimcardTypeFilter.vue';
import OffersFilter from '@/components/Filters/filterbar/OffersFilter';
import CustomFieldsFilter from '@/components/Filters/filterbar/CustomFieldsFilter.vue';
import QuantityFilter from '@/components/Filters/filterbar/QuantityFilter.vue';
import GetSimReservationIdCell from './GetSimReservationIdCell';
import DateRangeFilter from '@/components/Filters/filterbar/DateRangeFilter.vue';
import SearchByLinesId from '@/components/SearchById';
import Indicators from '@/components/Indicators';
import UiButton from '@/components/ui/Button';
import ExportButton from '@/components/ExportButton';

import UsersFilter from '@/components/Filters/filterbar/UsersFilter.vue';
import StatusCell from './StatusCell.vue';
import ActionFilter from './ActionFilter.vue';

import { fetchEsimReservations, exportEsimReservations } from '@/api/esim.js';
import { formatDateForGql, prepareEndDateForBackend } from '@/api/utils.js';
import { mapGetters, mapMutations } from 'vuex';
import { fetchCustomFields } from '@/api/customFields';
import { formatLargeNumber } from '@/utils/numbers';

export default {
  components: {
    TableWithFilter,
    ExportButton,
    SearchByLinesId,
    Indicators,
    UiButton,
  },
  data() {
    return {
      columns: undefined,
      filters: undefined,
      rows: [],
      total: 0,
      orderBy: {
        key: 'id',
        direction: 'ASC',
      },
      isLoading: false,
      searchByIdValue: undefined,
      currentAppliedFilters: [],
      currentFilters: undefined,
      indicators: undefined,
      lastPayload: undefined,
      orderedColumns: undefined,
    };
  },

  async mounted() {
    this.initFilters();
    this.initIndicators();
    await this.initColumns();

    this.applyFilters();
  },

  watch: {
    currentFilters(newValue, oldValue) {
      if (oldValue && oldValue.length && newValue && !newValue.length) {
        this.applyFilters();
      }
    },
  },

  computed: {
    ...mapGetters(['userIsPartner', 'singlePartner', 'userName']),
    formattedTotal() {
      return formatLargeNumber(this.total);
    },
    selectedPartnerIds() {
      return this.currentPartners.map((p) => p.id);
    },
    currentPartners() {
      if (!this.currentFilters) return [];

      const foundFilter = this.currentFilters.find((f) => f.id === 'filters.partners');
      if (foundFilter && foundFilter.values && foundFilter.values.length) {
        return foundFilter.values;
      }

      return [];
    },
  },

  methods: {
    ...mapMutations(['openPanel']),
    searchById(params) {
      this.searchByIdValue = params.value;
      this.applyFilters({
        filters: [params],
        pagination: { page: 0, limit: 1 },
      });
    },
    formatForApi(filters) {
      return filters.reduce((formatted, filter) => {
        if (filter.id === 'filters.iccid') {
          formatted.iccid = {
            startsWith: filter.value.trim(),
          };
        }
        if (filter.id === 'filters.imsi') {
          formatted.imsi = {
            startsWith: filter.value.trim(),
          };
        }
        if (filter.id === 'filters.msisdn') {
          formatted.msisdn = {
            startsWith: filter.value.trim(),
          };
        }
        if (filter.id === 'filters.imei') {
          formatted.imei = {
            startsWith: filter.value.trim(),
          };
        }
        if (filter.id === 'filters.partners') {
          formatted.partyId = {
            in: filter.values.map((v) => v.id),
          };
        }
        if (filter.id === 'common.billingAccount') {
          formatted.customerAccountId = {
            in: filter.values.map((v) => v.id),
          };
        }
        if (filter.id === 'getsim.reservations.filters.reservationDate') {
          if (filter.startDate) {
            const formattedStartDate = `${formatDateForGql(filter.startDate)}`;
            if (filter.endDate) {
              formatted.esimReservationDate = {
                between: {
                  startDate: formattedStartDate,
                  endDate: prepareEndDateForBackend(filter.endDate, filter),
                },
              };
            } else {
              formatted.esimReservationDate = {
                goe: formattedStartDate,
              };
            }
          }
        }
        if (filter.id === 'filters.lines.typeSIMCard') {
          formatted.simCardTypeId = {
            in: filter.values.map((v) => v.data.simCard.id),
          };
        }
        if (filter.id === 'filters.offers') {
          formatted.workflowCode = {
            in: filter.values.map((v) => v.productCode),
          };
        }
        if (filter.id === 'filters.quantity') {
          if (filter.from && !filter.to) {
            formatted.quantity = {
              goe: filter.from,
            };
          }
          if (!filter.from && filter.to) {
            formatted.quantity = {
              loe: filter.to,
            };
          }
          if (filter.from && filter.to) {
            formatted.quantity = {
              goe: filter.from,
              loe: filter.to,
            };
          }
        }
        if (filter.id === 'getsim.reservations.filters.creator') {
          formatted.creatorId = {
            eq: filter.data.id,
          };
        }
        if (filter.id === 'filters.lines.customFileds') {
          filter.values.forEach((v) => {
            if (
              ['custom1', 'custom2', 'custom3', 'custom4', 'custom5', 'custom6'].find(
                (customField) => v.id === customField
              )
            ) {
              formatted[v.id] = {
                eq: v.value.trim(),
              };
            }
          });
        }

        if (filter.id === 'filters.action') {
          const preactivationAsked = !!filter.values.find(
            (v) => v.id === 'filters.actionValues.PREACTIVATED'
          );
          const activationAsked = !!filter.values.find(
            (v) => v.id === 'filters.actionValues.ACTIVATED'
          );

          if (preactivationAsked) {
            formatted.preactivationAsked = {
              eq: true,
            };
          }

          if (activationAsked) {
            formatted.activationAsked = {
              eq: true,
            };
          }
        }

        return formatted;
      }, {});
    },

    getExportFn() {
      return async (columnsParam, orderBy, exportFormat) => {
        return await exportEsimReservations(
          columnsParam,
          this.orderBy,
          exportFormat,
          this.currentAppliedFilters
        );
      };
    },
    async applyFilters(payload) {
      this.lastPayload = payload;

      const { pagination, filters } = payload || {
        pagination: { page: 0, limit: 20 },
        filters: [],
      };

      let sorting;

      if (payload && payload.orderBy) {
        sorting = {};
        sorting[payload.orderBy.key] = payload.orderBy.direction;
      }

      this.isLoading = true;
      const data = await fetchEsimReservations(this.formatForApi(filters), pagination, sorting);
      this.isLoading = false;

      this.rows = data.items;
      this.total = data.total;
      this.currentAppliedFilters = filters;
    },
    initIndicators() {
      this.indicators = [
        {
          name: 'reservationInProgress',
          labelKey: 'getsim.reservations.indicators.reservationInProgress',
          color: 'text-success',
          clickable: true,
          total: '-',
          filters: [],
          fetchKey: 'RESERVATION_IN_PROCESS',
        },
        {
          name: 'terminatedReservation',
          labelKey: 'getsim.reservations.indicators.terminatedReservation',
          color: 'text-success',
          clickable: true,
          total: '-',
          filters: [],
          fetchKey: 'RESERVATION_TERMINATED',
        },
      ];
    },
    initFilters() {
      this.filters = [
        {
          title: 'filters.partners',
          component: PartnerFilter,
          onChange(chosenValues) {
            return {
              id: 'filters.partners',
              values: chosenValues,
            };
          },
        },
        {
          title: 'common.billingAccount',
          component: BillingAccountFilter,
          getPageContext: () => {
            return { partners: this.currentPartners };
          },
          onChange(chosenValues) {
            return {
              id: 'common.billingAccount',
              values: chosenValues,
              data: chosenValues,
            };
          },
        },

        // TODO: Statut de la réservation

        {
          title: 'getsim.reservations.filters.reservationDate',
          component: DateRangeFilter,
          onChange(chosenValue) {
            return {
              id: 'getsim.reservations.filters.reservationDate',
              startDate: chosenValue.startDate,
              endDate: chosenValue.endDate,
              data: chosenValue,
            };
          },
        },

        {
          title: 'filters.lines.typeSIMCard',
          component: SimcardTypeFilter,
          getPageContext: () => {
            return { partners: this.currentPartners, category: 'ESIM' };
          },
          onChange(chosenValues) {
            return {
              id: 'filters.lines.typeSIMCard',
              values: chosenValues,
              data: chosenValues,
            };
          },
        },
        {
          title: 'filters.offers',
          component: OffersFilter,
          onChange(chosenValues) {
            return {
              id: 'filters.offers',
              values: chosenValues,
              data: chosenValues,
            };
          },
          getPageContext: () => {
            return { partners: this.currentPartners };
          },
        },

        {
          title: 'filters.quantity',
          component: QuantityFilter,
          onChange({ from, to }) {
            return {
              id: 'filters.quantity',
              value: `${from} → ${to}`,
              from,
              to,
            };
          },
        },

        {
          title: 'filters.lines.customFileds',
          component: CustomFieldsFilter,
          onChange(chosenValues) {
            return {
              id: 'filters.lines.customFileds',
              values: chosenValues,
              data: chosenValues,
            };
          },
          getPageContext: () => {
            return { partners: this.currentPartners };
          },
        },

        {
          title: 'getsim.reservations.filters.creator',
          component: UsersFilter,
          onChange(chosenValue) {
            if (chosenValue) {
              return {
                id: 'getsim.reservations.filters.creator',
                value: chosenValue.label,
                data: chosenValue,
              };
            }
          },
        },

        {
          title: 'filters.action',
          component: ActionFilter,
          onChange(chosenValues) {
            return {
              id: 'filters.action',
              values: chosenValues,
            };
          },
        },
      ];
    },
    async initColumns() {
      const defaultCustomFieldsColumns = [
        {
          id: 15,
          label: this.$t('col.customFields', { num: 1 }),
          orderable: false,
          name: 'customFields',
          visible: false,
          exportId: 'ORDER_CUSTOMFIELD_1',
          format: {
            type: 'ObjectAttribute',
            path: 'customFields.custom1',
          },
        },
        {
          id: 16,
          label: this.$t('col.customFields', { num: 2 }),
          orderable: false,
          name: 'customFields',
          visible: false,
          exportId: 'ORDER_CUSTOMFIELD_2',
          format: {
            type: 'ObjectAttribute',
            path: 'customFields.custom2',
          },
        },
        {
          id: 17,
          label: this.$t('col.customFields', { num: 3 }),
          orderable: false,
          name: 'customFields',
          visible: false,
          exportId: 'ORDER_CUSTOMFIELD_3',
          format: {
            type: 'ObjectAttribute',
            path: 'customFields.custom3',
          },
        },
        {
          id: 18,
          label: this.$t('col.customFields', { num: 4 }),
          orderable: false,
          name: 'customFields',
          visible: false,
          exportId: 'ORDER_CUSTOMFIELD_4',
          format: {
            type: 'ObjectAttribute',
            path: 'customFields.custom4',
          },
        },
        {
          id: 19,
          label: this.$t('col.customFields', { num: 5 }),
          orderable: false,
          name: 'customFields',
          visible: false,
          exportId: 'ORDER_CUSTOMFIELD_5',
          format: {
            type: 'ObjectAttribute',
            path: 'customFields.custom5',
          },
        },
        {
          id: 20,
          label: this.$t('col.customFields', { num: 6 }),
          orderable: false,
          name: 'customFields',
          visible: false,
          exportId: 'ORDER_CUSTOMFIELD_6',
          format: {
            type: 'ObjectAttribute',
            path: 'customFields.custom6',
          },
        },
      ];
      const commonColumns = [
        {
          id: 1,
          label: this.$t('getsim.reservations.columns.id'),
          orderable: true,
          name: 'id',
          exportId: 'id',
          visible: true,
          noHandle: true,
          format: {
            component: GetSimReservationIdCell,
          },
        },
        //
        {
          id: 2,
          label: this.$t('getsim.reservations.filters.reservationDate'),
          orderable: false,
          name: 'esimReservationDate',
          exportId: 'esimReservationDate',
          visible: true,
        },
        {
          id: 3,
          label: this.$t('col.externalId'),
          orderable: false,
          name: 'missing',
          visible: true,
        },
        {
          id: 4,
          label: this.$t('col.massActionIds'),
          orderable: false,
          name: 'massActionId',
          visible: true,
        },
        {
          id: 5,
          label: this.$t('getsim.reservations.columns.reservationStatus'),
          orderable: false,
          name: 'status',
          visible: true,
          format: {
            component: StatusCell,
          },
        },
        {
          id: 6,
          label: this.$t('common.quantity'),
          orderable: false,
          name: 'quantity',
          visible: true,
        },
        {
          id: 7,
          label: this.$t('getadmin.users.filters.typeSIMCard'),
          orderable: false,
          name: 'quantity',
          visible: false,
          format: {
            type: 'Getter',
            getter: (row) => {
              return this.$loGet(row, 'simCardType.description');
            },
          },
        },
        {
          id: 8,
          label: this.$t('alarms.alarmScope.OFFER'),
          orderable: false,
          name: 'quantity',
          visible: false,
          format: {
            type: 'Getter',
            getter: (row) => {
              return this.$loGet(row, 'esimReservedMarketingOffer.description');
            },
          },
        },
        {
          id: 9,
          label: this.$t('getsim.reservations.filters.creator'),
          orderable: false,
          name: 'creator',
          visible: false,
          format: {
            type: 'Getter',
            getter: (row) => {
              return `${this.$loGet(row, 'auditable.creator.name.firstName')} ${this.$loGet(
                row,
                'auditable.creator.name.lastName'
              )}`;
            },
          },
        },
        {
          id: 10,
          label: this.$t('getparc.actLines.details.partners'),
          orderable: false,
          name: 'partner',
          visible: false,
          format: {
            type: 'Getter',
            getter: (row) => {
              return this.$loGet(row, 'party.name');
            },
          },
        },
        {
          id: 11,
          label: this.$t('common.billingAccount'),
          orderable: false,
          name: 'billingAccount',
          visible: false,
          format: {
            type: 'Getter',
            getter: (row) => {
              return this.$loGet(row, 'customerAccount.code');
            },
          },
        },
        {
          id: 12,
          label: this.$t('col.preActivationAsked'),
          orderable: false,
          name: 'preActivationAsked',
          visible: false,
          exportId: 'ORDER_PREACTIVATIONASKED',
          format: {
            type: 'Boolean',
          },
        },
      ];
      if (this.userIsPartner) {
        const partnerId = this.$loGet(this.singlePartner, 'id');
        const customFields = await fetchCustomFields(partnerId);
        const partnerCustomFieldsColumns = customFields.customFields.map((c) => {
          return {
            id: c.id,
            label: c.label,
            orderable: false,
            name: 'customFields',
            visible: false,
            format: {
              type: 'ObjectAttribute',
              path: c.codeInOrder,
            },
          };
        });
        this.columns = [...commonColumns, ...partnerCustomFieldsColumns];
      } else {
        this.columns = [...commonColumns, ...defaultCustomFieldsColumns];
      }
    },

    openCreateReservationPanel() {
      const doReset = () => {
        this.applyFilters(this.lastPayload);
      };
      this.openPanel({
        title: this.$t('getsim.reservations.createReservation'),
        panelId: 'getsim.reservations.createReservation',
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
  },
};
</script>

<style lang="scss" scoped></style>
