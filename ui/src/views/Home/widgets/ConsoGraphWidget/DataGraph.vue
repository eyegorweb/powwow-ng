<template>
  <BaseGraph :load-data-fn="loadDataFn" :usage="usage" />
</template>

<script>
import BaseGraph from './BaseGraph';

import { supervisionDataGraph } from '@/api/supervision';
import { formatDateToUTC } from '@/utils/date';

export default {
  components: {
    BaseGraph,
  },

  props: {
    usage: String,
  },

  methods: {
    async loadDataFn(partners) {
      if (partners && partners.length) {
        const response = await supervisionDataGraph(partners);
        if (response.errors) {
          return;
        }
        return response.responses.map((d) => ({
          date: formatDateToUTC(d.date),
          out: d.upload,
          in: d.download,
        }));
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
