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
    duplicateFrom: Object,
  },

  data() {
    return {
      max: 500,
      lines: [],
      hasLimits: false,
    };
  },

  mounted() {
    if (this.duplicateFrom) {
      if (this.duplicateFrom && this.duplicateFrom.levelSmsMax) {
        const lastDay = parseInt(
          moment()
            .endOf('month')
            .format('DD')
        );

        this.lines[0] = {
          value: this.duplicateFrom.levelSmsMax,
          limit: lastDay,
          id: 1,
        };
      }
      if (this.duplicateFrom && this.duplicateFrom.levelSms1) {
        this.lines[1] = {
          value: this.duplicateFrom.levelSms1,
          limit:
            this.duplicateFrom.levelSms1 && this.duplicateFrom.dateLevelSms1 == null
              ? 'endOfMonth'
              : this.duplicateFrom.dateLevelSms1,
          id: 2,
        };
      }
      if (this.duplicateFrom && this.duplicateFrom.levelSms2) {
        this.lines[2] = {
          value: this.duplicateFrom.levelSms2,
          limit:
            this.duplicateFrom.levelSms2 && this.duplicateFrom.dateLevelSms2 == null
              ? 'endOfMonth'
              : this.duplicateFrom.dateLevelSms2,
          id: 3,
        };
      }
      this.hasLimits = !!this.lines.length;
    }
  },

  computed: {
    basePercent() {
      if (this.duplicateFrom && this.duplicateFrom.levelSmsMax) {
        return this.duplicateFrom.levelSmsMax;
      }
      return 100;
    },
  },

  methods: {
    getPercentVal(value) {
      if (!this.offerPackage || !this.offerPackage.envelopeValue) return undefined;

      const calculated = Math.round((value * this.offerPackage.envelopeValue) / 100);
      if (!isNaN(calculated)) {
        return `(${calculated})`;
      }
      return undefined;
    },
  },
};
</script>

<style lang="scss" scoped></style>
