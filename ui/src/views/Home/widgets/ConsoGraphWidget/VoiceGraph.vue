<template>
  <BaseGraph :load-data-fn="loadDataFn" />
</template>

<script>
import BaseGraph from './BaseGraph';

import { supervisionVoiceGraph } from '@/api/supervision';
import { formatDateToUTC } from '@/utils/date';

export default {
  components: {
    BaseGraph,
  },

  methods: {
    async loadDataFn(partners) {
      if (partners && partners.length) {
        const response = await supervisionVoiceGraph(partners);

        return response.map(d => ({
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
