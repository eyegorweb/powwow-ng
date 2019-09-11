<template>
  <WidgetBloc :widget="widget" mocked>
    <div slot="header">
      <div class="d-flex offer-select">
        <span>Pour l'offre</span>
        <UiSelect
          v-if="offers.length"
          class="text-gray"
          v-model="selectedOffer"
          :placeholder="$t('getparc.actCreation.ManageCancellation.choose')"
          :options="offers"
          small
        ></UiSelect>
      </div>
    </div>
    <div class="conso-container">
      <div class="row">
        <div class="col-md-4">
          <Gauge :value="50" title="25Mo" subtitle="18/11/2018" right-corner="∞" />
        </div>
        <div class="col-md-4">
          <Gauge
            :value="100"
            title="50"
            subtitle="18/11/2018"
            arc-style="danger"
            right-corner="40"
          />
        </div>
        <div class="col-md-4" style="align-self: flex-end; flex-grow: 1;">
          <Gauge :value="49" title="110" subtitle="18/11/2018" right-corner="120" />
        </div>
      </div>
    </div>
  </WidgetBloc>
</template>

<script>
import WidgetBloc from './WidgetBloc';
import Gauge from '@/components/widgets/Gauge';
import UiSelect from '@/components/ui/UiSelect';
import { fetchOffers } from '@/api/offers';

export default {
  components: {
    WidgetBloc,
    Gauge,
    UiSelect,
  },
  props: {
    widget: Object,
  },
  async mounted() {
    const data = await fetchOffers('', [], { page: 0, limit: 99 });
    if (data) {
      this.offers = data.map(o => ({
        id: o.code,
        label: o.workflowDescription,
        value: o.code,
      }));
    }
  },

  data() {
    return {
      selectedOffer: undefined,
      offers: [],
    };
  },
  watch: {
    selectedOffer(newValue) {
      console.log(newValue);
    },
  },
};
</script>

<style lang="scss" scoped>
.conso-container {
  display: flex;
  height: 100%;

  .row {
    align-self: flex-end;
    width: 100%;
  }
}

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
