<template>
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
        <Gauge :key="'smsg' + gaugeVersion" :value="smsValue" :max-value="maxSMS" arc-style="danger"
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
</template>

<script>
import Gauge from '@/components/widgets/Gauge';
import { fetMaxValuesFromOfferPackage } from '@/api/offers.js';
import { fetchCurrentConsumption } from '@/api/linesActions';

import { mapState } from 'vuex';
import { formatBytes } from '@/api/utils';

export default {
  components: {
    Gauge,
  },
  props: {
    selectedOffer: Object,
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
  watch: {
    async selectedOffer(selectedOffer) {
      if (selectedOffer) {
        console.log('selectedOffer >> ', selectedOffer)
        const { maxData, maxVoice, maxSMS } = await fetMaxValuesFromOfferPackage(selectedOffer);

        const values = await fetchCurrentConsumption({
          customerAccoutId: selectedOffer.meta.customerAccount.id,
          workflowId: selectedOffer.meta.workflow.id,
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
