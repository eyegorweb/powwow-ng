<template>
  <div v-if="show">
    <span v-for="(lineByPlmn, index) in linesByPlmn" :key="'plmn_' + index">
      {{ formatData(lineByPlmn, index) }}
    </span>
  </div>
</template>

<script>
import { lineDistributionByPlmn } from '@/api/supervision.js';

export default {
  data() {
    return {
      linesByPlmn: [],
    };
  },
  async mounted() {
    if (this.show) this.linesByPlmn = await this.getPlmnDistribution();
  },
  props: {
    filtersForExport: Object,
    show: Boolean,
  },
  methods: {
    async getPlmnDistribution() {
      const data = await lineDistributionByPlmn({
        filter: this.filtersForExport,
      });
      return data;
    },
    formatData(lineByPlmnValue, index) {
      let value = '';
      if (lineByPlmnValue) {
        const pluralOrSingularLine = lineByPlmnValue.accessPointNumber > 1 ? ' lignes' : ' ligne';
        if (index !== 0) {
          value += ' / ';
        }
        value +=
          Math.round(lineByPlmnValue.percentage) +
          '% (' +
          lineByPlmnValue.accessPointNumber +
          pluralOrSingularLine +
          ') sur le PLMN ' +
          lineByPlmnValue.plmn +
          ' - ' +
          lineByPlmnValue.operator;
      }
      return value;
    },
  },
};
</script>

<style lang="scss" scoped></style>
