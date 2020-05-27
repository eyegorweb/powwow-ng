<template>
  <div class="mb-3">
    <Indicators v-if="currentIndicators" :meta="currentIndicators" :on-click="onIndicatorClick" />
  </div>
</template>

<script>
import Indicators from '@/components/Indicators';
import { globalActifParc } from '@/api/supervisionIndicators.js';

export default {
  components: {
    Indicators,
  },
  props: {
    usage: String,
  },
  data() {
    return {
      allUsageIndicators: [
        {
          name: 'globalActif',
          labelKey: 'getvsion.indicators.globalActif',
          color: 'text-success',
          clickable: true,
          total: '-',
          fetch: async indicator => {
            const result = await globalActifParc();
            return { total: 99 };
          },
        },
        {
          name: 'lineWithoutTraffic',
          labelKey: 'getvsion.indicators.lineWithoutTraffic',
          color: 'text-success',
          clickable: true,
          total: '-',
          fetch: async indicator => {
            return { total: 99 };
          },
        },
        {
          name: 'linesWIthoutTraffic30Days',
          labelKey: 'getvsion.indicators.linesWIthoutTraffic30Days',
          color: 'text-success',
          clickable: true,
          total: '-',
          fetch: async indicator => {
            return { total: 99 };
          },
        },
        {
          name: 'linesNonLocalizedTraffic',
          labelKey: 'getvsion.indicators.linesNonLocalizedTraffic',
          color: 'text-success',
          clickable: true,
          total: '-',
          fetch: async indicator => {
            return { total: 99 };
          },
        },
      ],
    };
  },

  methods: {
    onIndicatorClick(indicator) {
      console.log('INDOCATOR >>', indicator);
    },
  },

  computed: {
    currentIndicators() {
      if (this.usage === 'allUsages') {
        return this.allUsageIndicators;
      }

      return undefined;
    },
  },
};
</script>

<style lang="scss" scoped></style>
