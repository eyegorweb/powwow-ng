<template>
  <div class="conso-container">
    <div v-if="selectedOffer" class="row">
      <div class="col-md-4">
        <Gauge
          :key="'datag' + gaugeVersion"
          :value="dataValue"
          :max-value="maxData"
          font-size="1.25rem"
          :format-value-fn="getDataFormat()"
          >{{ $t('services.DATA') }}</Gauge
        >
      </div>
      <div class="col-md-4">
        <Gauge
          :key="'smsg' + gaugeVersion"
          :value="smsValue"
          :max-value="maxSMS"
          font-size="1.25rem"
          >{{ $t('services.SMS') }}</Gauge
        >
      </div>
      <div class="col-md-4" style="align-self: flex-end; flex-grow: 1;">
        <Gauge
          :key="'voiceg' + gaugeVersion"
          time-max-value
          :value="voiceValue"
          :max-value="maxVoice"
          font-size="1.25rem"
          :format-value-fn="getTimeFormatFn()"
          >{{ $t('services.VOICE') }}</Gauge
        >
      </div>
    </div>
    <div v-else>
      <slot />
    </div>
  </div>
</template>

<script>
import Gauge from '@/components/widgets/Gauge';
import { fetMaxValuesFromOfferPackage } from '@/api/offers.js';
import { fetchCurrentConsumption } from '@/api/linesActions';

import { formatBytes, formattedValueFromSeconds } from '@/api/utils';

export default {
  components: {
    Gauge,
  },
  props: {
    selectedOffer: Object,
  },

  data() {
    return {
      gaugeVersion: 0,
      dataValue: undefined,
      maxData: undefined,
      voiceValue: undefined,
      maxVoice: undefined,
      smsValue: undefined,
      maxSMS: undefined,
    };
  },

  mounted() {
    this.fetchData();
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
        return formattedValueFromSeconds(valueToShow);
      };
    },
    async fetchData() {
      if (this.selectedOffer) {
        const { maxData, maxVoice, maxSMS } = await fetMaxValuesFromOfferPackage(
          this.selectedOffer
        );

        const values = await fetchCurrentConsumption({
          customerAccoutId: this.selectedOffer.customerAccoutId,
          workflowId: this.selectedOffer.workflowId,
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

        // En mode compteur (notion d'infini '∞')
        // si la valeur est nulle (0), alors on met la jauge à 0
        // sinon si on a une valeur supérieure à 0, alros on met la jauge à 50
        this.dataValue = values.dataTotal;
        this.smsValue = values.smsTotal;
        this.voiceValue = values.voiceTotal;
        this.gaugeVersion += 1;
      }
    },
  },

  watch: {
    selectedOffer() {
      this.fetchData();
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
</style>
