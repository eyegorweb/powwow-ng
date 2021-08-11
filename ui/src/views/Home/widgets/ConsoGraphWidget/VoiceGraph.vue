<template>
  <BaseGraph :load-data-fn="loadDataFn" :usage="usage" />
</template>

<script>
import BaseGraph from './BaseGraph';

import { supervisionVoiceGraph } from '@/api/supervision';
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
        const data = await supervisionVoiceGraph(partners);
        if (data.errors) {
          return;
        }

        return data.responses.map((d) => ({
          date: formatDateToUTC(d.date),
          out: d.volumeOut,
          in: d.volumeIn,
        }));
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
