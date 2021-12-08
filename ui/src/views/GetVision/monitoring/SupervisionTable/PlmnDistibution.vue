<template>
  <div v-if="show">
    <span v-for="(formatted, index) in formattedData" :key="'plmn_' + index">
      {{ Math.round(formatted.percentage) }}% ({{ formatted.accessPointNumber }} lignes) sur le PLMN
      {{ formatted.plmn }} - {{ formatted.operator }} /
    </span>
  </div>
</template>

<script>
import { lineDistributionByPlmn } from '@/api/supervision.js';

export default {
  data() {
    return {
      formattedData: [],
    };
  },
  async mounted() {
    this.formattedData = await this.getPlmnDistribution();
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
  },
};
</script>

<style lang="scss" scoped></style>
