<template>
  <div class="mb-2">
    <Indicators :meta="indicators" :on-click="onClick" />
  </div>
</template>

<script>
import Indicators from '@/components/Indicators';

export default {
  components: {
    Indicators,
  },
  data() {
    return {
      indicators: [
        {
          name: 'triggered_current_month_ongoing',
          labelKey: 'getvsion.indicators.triggered_current_month_ongoing',
          color: 'text-danger',
          clickable: false,
          total: '-',
          filters: [],
          fetch: async (indicator, contextFilters) => {
            console.log('Fetch indicator > ', indicator, contextFilters);
            return 0;
          },
        },
        {
          name: 'triggered_last_month',
          labelKey: 'getvsion.indicators.triggered_last_month',
          color: 'text-danger',
          clickable: false,
          total: '-',
          filters: [],
          fetch: async (indicator, contextFilters) => {
            console.log('Fetch indicator > ', indicator, contextFilters);
            return 0;
          },
        },
      ],
    };
  },
  methods: {
    onClick(indicator) {
      console.log(indicator);
    },
  },
};
</script>

<style lang="scss" scoped></style>
