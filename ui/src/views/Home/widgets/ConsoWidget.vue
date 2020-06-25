<template>
  <WidgetBloc :widget="widget">
    <div slot="header">
      <div @click.stop="" class="d-flex offer-select">
        <template v-if="!loadingOffers">
          <span>Pour l'offre</span>
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
      <h4>Veuillez choisir une offre</h4>
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
  async mounted() {
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
      }
    } catch (e) {
      this.loadingOffers = false;
    }
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
    offerForGauge() {
      if (this.selectedOffer) {
        const selectedOffer = this.offers.find(o => this.selectedOffer === o.value);
        return {
          customerAccoutId: selectedOffer.meta.customerAccount.id,
          workflowId: selectedOffer.meta.workflow.id,
        };
      }
      return undefined;
    },
  },

  data() {
    return {
      selectedOffer: undefined,
      offers: [],
      loadingOffers: false,
    };
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
