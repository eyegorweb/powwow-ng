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
      max: undefined,
      unit: undefined,
      lines: [],
      hasLimits: false,
    };
  },

  computed: {
    basePercent() {
      if (this.duplicateFrom && this.duplicateFrom.levelDataMax) {
        return this.duplicateFrom.levelDataMax;
      }
      return 100;
    },
  },

  mounted() {
    if (this.duplicateFrom) {
      if (this.duplicateFrom && this.duplicateFrom.levelDataMax) {
        const lastDay = parseInt(
          moment()
            .endOf('month')
            .format('DD')
        );
        this.lines[0] = {
          value: this.duplicateFrom.levelDataMax,
          limit: lastDay,
          id: 1,
        };
      }
      if (this.duplicateFrom && this.duplicateFrom.levelData1) {
        this.lines[1] = {
          value: this.duplicateFrom.levelData1,
          limit:
            this.duplicateFrom.dateLevelData1 == null && this.duplicateFrom.levelData1
              ? 'endOfMonth'
              : this.duplicateFrom.dateLevelData1,
          id: 2,
        };
      }
      if (this.duplicateFrom && this.duplicateFrom.levelData2) {
        this.lines[2] = {
          value: this.duplicateFrom.levelData2,
          limit:
            this.duplicateFrom.levelData2 && this.duplicateFrom.dateLevelData2 == null
              ? 'endOfMonth'
              : this.duplicateFrom.dateLevelData2,
          id: 3,
        };
      }
      this.hasLimits = !!this.lines.length;
    }
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
