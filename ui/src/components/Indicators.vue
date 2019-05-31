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
          {{ indicator.total }}
        </button>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    meta: Array,
    fetchFn: Function,
    setCurrentFiltersFn: Function,
  },

  data() {
    return {
      indicators: [],
    };
  },

  async mounted() {
    const indicatorsWithDefaultFetch = this.meta.filter(m => !m.fetch);
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
  },
};
</script>

<style lang="scss" scoped></style>
