<template>
  <div>
    <template v-if="$shouldShowMocks">
      <TableWithFilter
        v-if="columns"
        :filters="filters"
        :columns="columns"
        :rows="rows"
        :total="total"
        :order-by.sync="orderBy"
        :is-table-loading="isLoading"
        :show-reset="!!searchByIdValue"
        @applyFilters="applyFilters"
        @currentFiltersChange="currentFilters = $event"
      >
        <div slot="title">
          {{ $t('getsim.reservasions.tableTitle', { total: formattedTotal }) }}
        </div>
        <div slot="before-filters">
          <Indicators v-if="indicators" :meta="indicators" disable-click precalculated />
          <br />
        </div>

        <div slot="topLeft">
          <SearchByLinesId @searchById="searchById" :init-value="searchByIdValue" />
        </div>
      </TableWithFilter>
    </template>
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
import DateRangeFilter from '@/components/Filters/filterbar/DateRangeFilter.vue';
import SearchByLinesId from '@/components/SearchById';
import Indicators from '@/components/Indicators';

import UsersFilter from '@/components/Filters/filterbar/UsersFilter.vue';
import StatusCell from './StatusCell.vue';
import ActionFilter from './ActionFilter.vue';

import { fetchEsimReservations } from '@/api/orders.js';
import { formatDateForGql, prepareEndDateForBackend } from '@/api/utils.js';
import { mapGetters } from 'vuex';
import { fetchCustomFields } from '@/api/customFields';
import { formatLargeNumber } from '@/utils/numbers';

export default {
  components: {
    TableWithFilter,
    SearchByLinesId,
    Indicators,
  },
  data() {
    return {
      columns: undefined,
      filters: undefined,
      rows: [],
      total: 0,
      orderBy: {
        key: 'statusDate',
        direction: 'ASC',
      },
      isLoading: false,
      searchByIdValue: undefined,
      currentAppliedFilters: [],
      currentFilters: undefined,
      indicators: undefined,
    };
  },

  async mounted() {
    this.initFilters();
    this.initIndicators();
    await this.initColumns();

    this.applyFilters();
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
        if (filter.id === 'getsim.reservasions.filters.reservationDate') {
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
        if (filter.id === 'getsim.reservasions.filters.creator') {
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
    async applyFilters(payload) {
      const { pagination, filters } = payload || {
        pagination: { page: 0, limit: 20 },
        filters: [],
      };

      this.isLoading = true;
      const data = await fetchEsimReservations(this.formatForApi(filters), pagination);
      this.isLoading = false;

      this.rows = data.items;
      this.total = data.total;
      this.currentAppliedFilters = filters;
    },
    initIndicators() {
      this.indicators = [
        {
          name: 'reservationInProgress',
          labelKey: 'getsim.reservasions.indicators.reservationInProgress',
          color: 'text-success',
          clickable: true,
          total: '-',
          filters: [],
          fetchKey: 'SIM_NOT_PREACTIVATED',
        },
        {
          name: 'terminatedReservation',
          labelKey: 'getsim.reservasions.indicators.terminatedReservation',
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
          title: 'getsim.reservasions.filters.reservationDate',
          component: DateRangeFilter,
          onChange(chosenValue) {
            return {
              id: 'getsim.reservasions.filters.reservationDate',
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
            return { partners: this.currentPartners };
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
          title: 'getsim.reservasions.filters.creator',
          component: UsersFilter,
          onChange(chosenValue) {
            if (chosenValue) {
              return {
                id: 'getsim.reservasions.filters.creator',
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
          label: this.$t('getsim.reservasions.columns.id'),
          name: 'id',
          exportId: 'id',
          orderable: true,
          visible: true,
          noHandle: true,
        },
        //
        {
          id: 2,
          label: this.$t('getsim.reservasions.filters.reservationDate'),
          name: 'esimReservationDate',
          exportId: 'esimReservationDate',
          orderable: true,
          visible: true,
        },
        {
          id: 3,
          label: this.$t('col.externalId'),
          name: 'missing',
          orderable: true,
          visible: true,
        },
        {
          id: 4,
          label: this.$t('col.massActionIds'),
          name: 'massActionId',
          orderable: true,
          visible: true,
        },
        {
          id: 5,
          label: this.$t('getsim.reservasions.columns.reservationStatus'),
          name: 'status',
          orderable: true,
          visible: true,
          format: {
            component: StatusCell,
          },
        },
        {
          id: 6,
          label: this.$t('common.quantity'),
          name: 'quantity',
          orderable: true,
          visible: true,
        },
        {
          id: 7,
          label: this.$t('getadmin.users.filters.typeSIMCard'),
          name: 'quantity',
          orderable: true,
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
          name: 'quantity',
          orderable: true,
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
          label: this.$t('getsim.reservasions.filters.creator'),
          name: 'creator',
          orderable: true,
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
          name: 'partner',
          orderable: true,
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
          name: 'billingAccount',
          orderable: true,
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
          name: 'preActivationAsked',
          orderable: true,
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
            name: 'customFields',
            orderable: false,
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
  },
};
</script>

<style lang="scss" scoped>
</style>
