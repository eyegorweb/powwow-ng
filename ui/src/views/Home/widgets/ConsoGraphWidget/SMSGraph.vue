<template>
  <BaseGraph :load-data-fn="loadDataFn" :usage="usage" />
</template>

<script>
import BaseGraph from './BaseGraph';

import { supervisionSmsGraph } from '@/api/supervision';
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
        const data = await supervisionSmsGraph(partners);
        if (data.errors) {
          return;
        }
        return data.responses.map((d) => ({
          date: formatDateToUTC(d.date),
          out: d.numberOfSentSMS,
          in: d.numberOfReceivedSMS,
        }));
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
