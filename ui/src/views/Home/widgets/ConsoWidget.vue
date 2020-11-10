<template>
  <WidgetBloc :widget="widget" @seeMore="onSeeMore">
    <div slot="header">
      <div @click.stop="" class="d-flex offer-select">
        <template v-if="!loadingOffers">
          <span>{{ $t('home.widgets.currentUsage.theOffer') }}</span>
          <UiSelect
            v-if="offers.length"
            class="text-gray"
            v-model="selectedOffer"
            :placeholder="$t('getparc.actCreation.ManageCancellation.choose')"
            :options="offers"
            small
          ></UiSelect>
        </template>
        <template v-else>
          <span>{{ $t('loading') }}</span>
        </template>
      </div>
    </div>
    <ConsoGauges :selected-offer="offerForGauge">
      <div v-if="!singlePartner" class="alert-light">
        {{ $t('chooseAPartner') }}
      </div>
      <div v-else-if="noResults" class="alert-light">
        {{ $t('noResult') }}
      </div>
    </ConsoGauges>
  </WidgetBloc>
</template>

<script>
import WidgetBloc from './WidgetBloc';
import UiSelect from '@/components/ui/UiSelect';
import ConsoGauges from '@/components/widgets/ConsoGauges.vue';
import { fetchOfferWithBilligAccount } from '@/api/offers.js';
import { mapState } from 'vuex';

export default {
  components: {
    WidgetBloc,
    UiSelect,
    ConsoGauges,
  },

  props: {
    widget: Object,
    contextFilters: Array,
  },

  mounted() {
    this.fetchOffers();
  },

  methods: {
    async fetchOffers() {
      if (this.partners && this.partners.length > 1) {
        this.loadingOffers = false;
        return;
      }
      this.loadingOffers = true;
      try {
        const data = await fetchOfferWithBilligAccount(this.partners);
        this.loadingOffers = false;
        if (data) {
          this.offers = data.map(o => ({
            value: o.workflow.id + '_' + o.customerAccount.id,
            label: `${o.workflow.workflowDescription} / ${o.customerAccount.name}`,
            meta: o,
          }));
          if (this.offers && this.offers.length) {
            this.selectedOffer = this.offers[0].value;
          }
        }
      } catch (e) {
        this.loadingOffers = false;
      }
    },

    onSeeMore() {
      this.$router.push({
        name: 'reportsDashboard',
        params: {
          queryFilters: [...this.widgetFilters],
        },
      });
    },

    resetFilters() {
      this.selectedOffer = undefined;
      this.offers = [];
      this.loadingOffers = false;
    },
  },

  computed: {
    ...mapState('userContext', ['contextPartners']),
    ...mapState('getsim', ['defaultAppliedFilters']),

    partners() {
      if (!this.defaultAppliedFilters) return [];

      return this.defaultAppliedFilters
        .filter(f => f.id === 'filters.partners')
        .map(f => f.values)
        .flat();
    },

    singlePartner() {
      return this.partners.length === 1 ? this.partners[0] : undefined;
    },

    offerForGauge() {
      if (this.selectedOffer) {
        const selectedOffer = this.offers.find(o => this.selectedOffer === o.value);
        if (selectedOffer) {
          return {
            customerAccoutId: selectedOffer.meta.customerAccount.id,
            workflowId: selectedOffer.meta.workflow.id,
            meta: selectedOffer.meta,
          };
        }
      }
      return undefined;
    },

    noResults() {
      return !!(this.singlePartner && !this.offers.length);
    },

    widgetFilters() {
      if (!this.offerForGauge) return [];
      const partnerFilter = [
        {
          id: 'filters.partners',
          values: this.singlePartner ? [this.singlePartner] : [],
        },
      ];
      const customerAccountFilter = [
        {
          id: 'filters.billingAccounts',
          values: [
            {
              id: this.offerForGauge.customerAccoutId,
              label: this.offerForGauge.meta.customerAccount.code,
              meta: this.offerForGauge.meta,
            },
          ],
        },
      ];
      const workflowFilter = [
        {
          id: 'filters.offers',
          values: [
            {
              id: this.offerForGauge.workflowId,
              label: this.offerForGauge.meta.workflow.workflowDescription,
              meta: this.offerForGauge.meta,
            },
          ],
        },
      ];
      return [...partnerFilter, ...customerAccountFilter, ...workflowFilter];
    },
  },

  data() {
    return {
      selectedOffer: undefined,
      offers: [],
      loadingOffers: false,
    };
  },

  watch: {
    contextFilters() {
      if (!this.singlePartner) {
        this.resetFilters();
      } else {
        this.fetchOffers();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.offer-select {
  align-items: flex-end;
  span {
    margin-left: 0.4rem;
    font-size: 0.7rem;
    color: $gray;
    font-weight: 400;
    line-height: 1rem;
  }
  select {
    color: $gray;
  }
}
</style>
