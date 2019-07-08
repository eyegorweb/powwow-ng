<template>
  <div class="mt-4">
    <div class="row mb-5">
      <div class="col-md-9">
        <h4>
          <b>GetSim</b>
          - {{ $t('getsim.manage-orders') }}
          <Tooltip direction="right">
            {{ $t('getsim.tooltip-text') }}
          </Tooltip>
        </h4>
      </div>
      <div class="col-md-3">
        <UiButton
          variant="accent"
          block
          class="float-right"
          @click="
            openPanel({
              title: $t('getsim.order-sim'),
              panelId: 'getsim.order-sim',
              wide: true,
              backdrop: true,
            })
          "
          >{{ $t('getsim.order-sim') }}</UiButton
        >
      </div>
    </div>
    <div class="row">
      <div class="col-md-3">
        <Indicators
          :key="indicatorsVersion"
          :meta="indicators"
          :set-current-filters-fn="setCurrentFiltersForIndicator"
          :partners="partnersForIndicators"
        />
        <br />
        <GetSimFilters />
      </div>
      <div class="col-md-9">
        <GetSimOrders :key="$i18n.locale" :is-panel-open="isPanelOpen" />
      </div>
    </div>
  </div>
</template>

<script>
import UiButton from '@/components/ui/Button';
import Tooltip from '@/components/ui/Tooltip';
import GetSimOrders from './GetSimOrders';
import GetSimFilters from './FilterBar/GetSimFilters';
import Indicators from '@/components/Indicators';
import { fetchSingleIndicator } from '@/api/orders';
import { fetchAverageProcessingTime } from '@/api/indicators';
import { mapMutations, mapState, mapActions, mapGetters } from 'vuex';
import moment from 'moment';

const dateFormat = 'DD-MM-YYYY';

export default {
  name: 'GetSim',

  components: {
    UiButton,
    Tooltip,
    GetSimOrders,
    GetSimFilters,
    Indicators,
  },
  data() {
    return {
      indicators: [
        {
          name: 'toBeConfirmed',
          labelKey: 'indicators.getsim.ordersToBeConfirmed',
          color: 'text-danger',
          clickable: true,
          total: '-',
          filters: [
            {
              id: 'filters.orderStatus',
              values: [{ id: 'NOT_VALIDATED', label: this.$t('col.statuses.NOT_VALIDATED') }],
            },
            {
              id: 'filters.orderDate',
              startDate: moment()
                .subtract(6, 'month')
                .format(dateFormat),
              endDate: moment().format(dateFormat),
            },
          ],
          fetch: async (indicator, partners) => {
            return await fetchSingleIndicator(indicator.filters, partners);
          },
        },
        {
          name: 'ordersInProgress',
          labelKey: 'indicators.getsim.ordersInProgress',
          color: 'text-success',
          clickable: true,
          total: '-',
          filters: [
            {
              id: 'filters.orderStatus',
              values: [
                { id: 'TO_BE_CONFIRMED', label: this.$t('col.statuses.TO_BE_CONFIRMED') },
                {
                  id: 'TO_BE_CONFIRMED_BY_BO',
                  label: this.$t('col.statuses.TO_BE_CONFIRMED_BY_BO'),
                },
                {
                  id: 'CONFIRMATION_IN_PROGRESS',
                  label: this.$t('col.statuses.CONFIRMATION_IN_PROGRESS'),
                },
                { id: 'CONFIRMED', label: this.$t('col.statuses.CONFIRMED') },
              ],
            },
            {
              id: 'filters.orderDate',
              startDate: moment()
                .subtract(6, 'month')
                .format(dateFormat),
              endDate: moment().format(dateFormat),
            },
          ],
          fetch: async (indicator, partners) => {
            return await fetchSingleIndicator(indicator.filters, partners);
          },
        },
        {
          name: 'ordersNotConfirmed',
          labelKey: 'indicators.getsim.ordersNotConfirmed',
          color: 'text-warning',
          clickable: true,
          total: '-',
          filters: [
            {
              id: 'filters.orderStatus',
              values: [
                {
                  id: 'TO_BE_CONFIRMED',
                  label: this.$t('col.statuses.TO_BE_CONFIRMED'),
                },
                {
                  id: 'TO_BE_CONFIRMED_BY_BO',
                  label: this.$t('col.statuses.TO_BE_CONFIRMED_BY_BO'),
                },
                {
                  id: 'CONFIRMATION_IN_PROGRESS',
                  label: this.$t('col.statuses.CONFIRMATION_IN_PROGRESS'),
                },
              ],
            },
            {
              id: 'filters.orderDate',
              startDate: moment()
                .subtract(4, 'hours')
                .format('DD-MM-YYYY HH:mm:ss'),
              endDate: moment().format('DD-MM-YYYY HH:mm:ss'),
              sameDay: true,
            },
          ],
          fetch: async (indicator, partners) => {
            return await fetchSingleIndicator(indicator.filters, partners);
          },
          hideZeroValue: true,
        },
        {
          name: 'ordersFailed',
          labelKey: 'indicators.getsim.ordersFailed',
          color: 'text-warning',
          clickable: true,
          total: '-',
          filters: [
            {
              id: 'filters.orderStatus',
              values: [{ id: 'CONFIRMED', label: this.$t('col.statuses.CONFIRMED') }],
            },
            {
              id: 'filters.orderDate',
              startDate: moment()
                .subtract(6, 'month')
                .format(dateFormat),
              endDate: moment()
                .subtract(48, 'hours')
                .format('DD-MM-YYYY HH:mm:ss'),
            },
          ],
          fetch: async (indicator, partners) => {
            return await fetchSingleIndicator(indicator.filters, partners);
          },
          hideZeroValue: true,
        },
        {
          name: 'orderToBeConfirmedByBO',
          labelKey: 'indicators.getsim.orderToBeConfirmedByBO',
          color: 'text-danger',
          clickable: true,
          total: '-',
          filters: [
            {
              id: 'filters.orderStatus',
              values: [
                {
                  id: 'TO_BE_CONFIRMED_BY_BO',
                  label: this.$t('col.statuses.TO_BE_CONFIRMED_BY_BO'),
                },
              ],
            },
          ],
          fetch: async (indicator, partners) => {
            return await fetchSingleIndicator(indicator.filters, partners);
          },
          hideZeroValue: true,
        },

        {
          name: 'averageProcessingTime',
          labelKey: 'indicators.getsim.averageProcessingTime',
          color: '',
          clickable: false,
          total: '-',
          filters: [],
          fetch: async () => {
            let contextPartnersFilter = {};
            let contextPartnerTypesFilter = {};

            if (this.contextPartnersTypes && this.contextPartnersTypes.length) {
              contextPartnerTypesFilter = {
                id: 'filters.partnerTypes',
                values: this.contextPartnersTypes,
              };
            }
            if (this.contextPartners && this.contextPartners.length) {
              contextPartnersFilter = {
                id: 'filters.partners',
                values: this.contextPartners,
              };
            }

            if (this.defaultAppliedFilters && this.defaultAppliedFilters.length) {
              contextPartnersFilter = this.defaultAppliedFilters;
            }
            const filterTAverageProcessingTime = [
              { ...contextPartnersFilter },
              { ...contextPartnerTypesFilter },
            ];
            const total = await fetchAverageProcessingTime(filterTAverageProcessingTime);
            let color = '';
            if (total < 5) {
              color = 'text-success';
            } else if (total >= 5) {
              color = 'text-warning';
            }
            return { total, color };
          },
        },
      ],
    };
  },

  methods: {
    ...mapActions('getsim', ['initFilterForContext']),
    ...mapMutations(['openPanel']),
    ...mapMutations('getsim', ['clearAllFilters', 'setCurrentFilters', 'applyFilters']),

    setCurrentFiltersForIndicator(indicator) {
      this.setCurrentFilters([...indicator.filters]);
      this.applyFilters();
    },
  },
  computed: {
    ...mapState('userContext', ['contextPartnersTypes', 'contextPartners']),
    ...mapState('getsim', ['defaultAppliedFilters', 'indicatorsVersion']),
    ...mapState({
      isPanelOpen: state => state.ui.isPanelOpen,
    }),
    ...mapGetters('getsim', ['appliedFilters']),
    partnersForIndicators() {
      if (this.defaultAppliedFilters && this.defaultAppliedFilters.length) {
        return this.defaultAppliedFilters.find(f => f.id === 'filters.partners');
      }

      return null;
    },
  },
  mounted() {
    this.initFilterForContext();
  },
  watch: {
    contextPartnersTypes() {
      this.initFilterForContext();
    },
    contextPartners() {
      this.initFilterForContext();
    },
  },
};
</script>
