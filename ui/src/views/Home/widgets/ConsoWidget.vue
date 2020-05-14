<template>
  <WidgetBloc :widget="widget" mocked>
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
    <ConsoGauges :selectedOffer="offerForGauge" />
    <div class="conso-container">
      <div v-if="selectedOffer" class="row">
        <div class="col-md-4">
          <Gauge
            :key="'datag' + gaugeVersion"
            :value="dataValue"
            :max-value="maxData"
            :format-value-fn="getDataFormat()"
            >DATA</Gauge
          >
        </div>
        <div class="col-md-4">
          <Gauge
            :key="'smsg' + gaugeVersion"
            :value="smsValue"
            :max-value="maxSMS"
            arc-style="danger"
            >SMS</Gauge
          >
        </div>
        <div class="col-md-4" style="align-self: flex-end; flex-grow: 1;">
          <Gauge
            :key="'voiceg' + gaugeVersion"
            time-max-value
            :value="voiceValue"
            :max-value="maxVoice"
            font-size="1.5rem"
            :format-value-fn="getTimeFormatFn()"
            >VOIX</Gauge
          >
        </div>
      </div>
      <div v-else>
        <h4>Veuillez choisir une offre</h4>
      </div>
    </div>
  </WidgetBloc>
</template>

<script>
import WidgetBloc from './WidgetBloc';
import Gauge from '@/components/widgets/Gauge';
import UiSelect from '@/components/ui/UiSelect';
import ConsoGauges from '@/components/widgets/ConsoGauges.vue'
import { fetchOfferWithBilligAccount, fetMaxValuesFromOfferPackage } from '@/api/offers.js';
import { fetchCurrentConsumption } from '@/api/linesActions';

import { mapState } from 'vuex';
import { formatBytes } from '@/api/utils';

export default {
  components: {
    WidgetBloc,
    Gauge,
    UiSelect,
    ConsoGauges
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
  methods: {
    getDataFormat() {
      return (valueToShow, originalValue) => {
        if (isNaN(valueToShow)) {
          return originalValue;
        }
        return formatBytes(valueToShow);
      };
    },
    getTimeFormatFn() {
      return (valueToShow, originalValue) => {
        if (isNaN(valueToShow)) {
          return originalValue;
        }
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
        return this.offers.find(o => this.selectedOffer === o.value);
      }
      return undefined;
    }
  },

  data() {
    return {
      selectedOffer: undefined,
      offers: [],
      loadingOffers: false,

      gaugeVersion: 0,

      dataValue: undefined,
      maxData: undefined,

      voiceValue: undefined,
      maxVoice: undefined,

      smsValue: undefined,
      maxSMS: undefined,
    };
  },
  watch: {
    async selectedOffer(newValue) {
      const selectedOffer = this.offers.find(o => newValue === o.value);
      if (selectedOffer) {
        const { maxData, maxVoice, maxSMS } = await fetMaxValuesFromOfferPackage(selectedOffer);

        const values = await fetchCurrentConsumption({
          customerAccoutId: 2,
          workflowId: 10,
        });

        if (maxData) {
          this.maxData = '' + maxData;
        }
        if (maxVoice) {
          this.maxVoice = '' + maxVoice;
        }
        if (maxSMS) {
          this.maxSMS = '' + maxSMS;
        }

        this.dataValue = values.dataTotal;
        this.smsValue = values.smsTotal;
        this.voiceValue = values.voiceTotal;
        this.gaugeVersion += 1;
      }
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
