<template>
  <div v-if="show" class="mb-3">
    <template v-if="!!errorMessage">
      <span class="alert alert-warning" role="alert">{{ errorMessage }}</span>
    </template>
    <template v-else>
      <span v-for="(lineByPlmn, index) in linesByPlmn" :key="'plmn_' + index">
        {{ formatData(lineByPlmn, index) }}
      </span>
    </template>
  </div>
</template>

<script>
import { lineDistributionByPlmn } from '@/api/supervision.js';
import { formatBackErrors } from '@/utils/errors';

export default {
  data() {
    return {
      linesByPlmn: [],
      errorMessage: undefined,
    };
  },
  async mounted() {
    if (this.show) {
      this.linesByPlmn = await this.getPlmnDistribution();
      if (this.linesByPlmn && this.linesByPlmn.errors) {
        const formatted = formatBackErrors(this.linesByPlmn.errors)
          .map((e) => e.errors)
          .flat();
        formatted.forEach((e) => {
          if (e.key === 'locationType') {
            this.errorMessage = `${e.key}.${e.value}`;
          } else {
            this.errorMessage = this.$t('genericErrorMessage');
          }
        });
      }
    }
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
