<template>
  <ul class="list-group bg-white">
    <li v-for="indicator in indicators" :key="indicator.labelKey" class="list-group-item">
      {{ $t(indicator.labelKey) }}
      <div class="float-right">
        <button
          :class="`btn btn-link p-0 ${indicator.color}`"
          :disabled="!indicator.clickable"
          @click.prevent="setCurrentFiltersFn(indicator)"
        >
          <CircleLoader v-if="isIndicatorsLoading" />
          <span v-else>{{ indicator.total }}</span>
        </button>
      </div>
    </li>
  </ul>
</template>

<script>
import CircleLoader from '@/components/ui/CircleLoader';

export default {
  components: {
    CircleLoader,
  },
  props: {
    meta: Array,
    fetchFn: Function,
    setCurrentFiltersFn: Function,
  },

  data() {
    return {
      indicators: [],
      isIndicatorsLoading: false,
    };
  },

  async mounted() {
    this.indicators = this.meta;
    this.refreshIndicators();
  },

  methods: {
    async refreshIndicators() {
      const indicatorsWithDefaultFetch = this.meta.filter(m => !m.fetch);
      this.isIndicatorsLoading = true;
      const response = await this.fetchFn(indicatorsWithDefaultFetch);
      if (response) {
        this.indicators = this.meta.map(i => {
          const indicator = { ...i };
          if (response[i.name]) {
            indicator.total = response[i.name].total;
          } else {
            indicator.total = 0;
          }
          return indicator;
        });
      }
      const indicatorsWithFetch = this.meta.filter(m => m.fetch);
      for (const i of indicatorsWithFetch) {
        const res = await i.fetch(i);
        this.indicators = this.indicators.map(bindedIndicator => {
          if (bindedIndicator.name === i.name) {
            bindedIndicator.total = res.total;
          }
          return bindedIndicator;
        });
      }
      this.isIndicatorsLoading = false;
    },
  },
};
</script>

<style lang="scss" scoped></style>
