<template>
  <OverConsoGenericForm
    :get-percent-val-fn="getPercentVal"
    :active.sync="active_"
    @change="$emit('change', $event)"
    :duplicate-from="duplicateFrom"
    :base-threshold="basePercent"
    :prefilled-lines="lines"
    :has-limits="hasLimits"
  />
</template>

<script>
import OverConsoGenericForm from './OverConsoGenericForm';
import { propWithSync } from '@/mixins';
import moment from 'moment';

export default {
  components: {
    OverConsoGenericForm,
  },
  mixins: [propWithSync('active')],
  props: {
    offerPackage: Object,
    duplicateFrom: Object,
  },

  data() {
    return {
      lines: [],
      hasLimits: false,
    };
  },

  mounted() {
    if (this.duplicateFrom) {
      if (this.duplicateFrom && this.duplicateFrom.levelVoiceMax) {
        const lastDay = parseInt(
          moment()
            .endOf('month')
            .format('DD')
        );

        this.lines[0] = {
          value: this.duplicateFrom.levelVoiceMax,
          limit: lastDay,
          id: 1,
        };
      }
      if (this.duplicateFrom && this.duplicateFrom.levelVoice1) {
        this.lines[1] = {
          value: this.duplicateFrom.levelVoice1,
          limit:
            this.duplicateFrom.levelVoice1 && this.duplicateFrom.dateLevelVoice1 == null
              ? 'endOfMonth'
              : this.duplicateFrom.dateLevelVoice1,
          id: 2,
        };
      }
      if (this.duplicateFrom && this.duplicateFrom.levelVoice2) {
        this.lines[2] = {
          value: this.duplicateFrom.levelVoice2,
          limit:
            this.duplicateFrom.levelVoice2 && this.duplicateFrom.dateLevelVoice2 == null
              ? 'endOfMonth'
              : this.duplicateFrom.dateLevelVoice2,
          id: 3,
        };
      }
      this.hasLimits = !!this.lines.length;
    }
  },

  computed: {
    basePercent() {
      if (this.duplicateFrom && this.duplicateFrom.levelVoiceMax) {
        return this.duplicateFrom.levelVoiceMax;
      }
      return 100;
    },
  },

  methods: {
    getPercentVal(value) {
      if (!this.offerPackage || !this.offerPackage.envelopeValue) return undefined;

      const calculated = Math.round((value * this.offerPackage.envelopeValue) / 100);
      if (!isNaN(calculated)) {
        return `(${calculated} ${this.offerPackage.unit})`;
      }
      return undefined;
    },
  },
};
</script>

<style lang="scss" scoped></style>
