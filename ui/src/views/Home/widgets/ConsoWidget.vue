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
          <Gauge :value="35" max-value="∞" unit="Mo" subtitle="18/11/2018" />
        </div>
        <div class="col-md-4">
          <Gauge :value="120" max-value="200" subtitle="18/11/2018" arc-style="danger" />
        </div>
        <div class="col-md-4" style="align-self: flex-end; flex-grow: 1;">
          <Gauge
            time-max-value
            :value="35"
            max-value="65"
            :format-value-fn="getTimeFormatFn()"
            subtitle="18/11/2018"
          />
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
    contextFilters: Array,
  },
  async mounted() {
    const data = await fetchOffers('', [...this.contextFilters], { page: 0, limit: 99 });
    if (data) {
      this.offers = data.map(o => ({
        id: o.code,
        label: o.workflowDescription,
        value: o.code,
      }));
    }
  },
  methods: {
    getTimeFormatFn() {
      return valueToShow => {
        let sec_num = parseInt(valueToShow, 10);
        let hours = Math.floor(sec_num / 3600);
        let minutes = Math.floor((sec_num - hours * 3600) / 60);
        let seconds = sec_num - hours * 3600 - minutes * 60;

        if (hours < 10) {
          hours = '0' + hours;
        }
        if (minutes < 10) {
          minutes = '0' + minutes;
        }
        if (seconds < 10) {
          seconds = '0' + seconds;
        }
        return hours + ':' + minutes + ':' + seconds;
      };
    },
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
