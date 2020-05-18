<template>
  <BaseGraph :load-data-fn="loadDataFn" unit="Go" />
</template>

<script>
import BaseGraph from './BaseGraph';

import { supervisionDataGraph } from '@/api/supervision';
import { formatDateToUTC } from '@/utils/date';

export default {
  components: {
    BaseGraph,
  },

  methods: {
    async loadDataFn(partners) {
      if (partners && partners.length) {
        const response = await supervisionDataGraph(partners);
        const formatData = v => Math.floor(v / Math.pow(1024, 3)); // octet => Go

        if (response) {
          return response.map(d => ({
            date: formatDateToUTC(d.date),
            out: formatData(d.upload),
            in: formatData(d.download),
          }));
        } else {
          console.log('Erreur API ', response);
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
