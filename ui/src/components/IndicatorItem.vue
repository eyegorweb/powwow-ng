<template>
  <li class="list-group-item">
    {{ $t(indicator.labelKey) }}
    <div class="float-right">
      <button
        :class="`btn btn-link p-0 ${indicator.color}`"
        :disabled="!indicator.clickable"
        @click.prevent="setCurrentFiltersFn(indicator)"
      >
        <CircleLoader v-if="isLoading" />
        <span v-else>{{ total }}</span>
      </button>
    </div>
  </li>
</template>

<script>
import CircleLoader from '@/components/ui/CircleLoader';

export default {
  props: {
    indicator: Object,
    partners: Object,
    setCurrentFiltersFn: Function,
  },
  data() {
    return {
      isLoading: false,
      total: '-',
    };
  },
  components: {
    CircleLoader,
  },

  async mounted() {
    this.refreshIndicator();
  },

  methods: {
    async refreshIndicator() {
      this.isLoading = true;
      const res = await this.indicator.fetch(this.indicator, this.partners);
      this.total = res.total;
      this.isLoading = false;
    },
  },

  watch: {
    partners() {
      this.refreshIndicator();
    },
  },
};
</script>

<style lang="scss" scoped></style>
