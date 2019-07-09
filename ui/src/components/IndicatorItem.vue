<template>
  <li class="list-group-item">
    {{ $t(indicator.labelKey) }}
    <div class="float-right">
      <button
        :class="`btn btn-link p-0 ${indicator.color || classColor}`"
        :disabled="!indicator.clickable"
      >
        <CircleLoader v-if="isLoading" />
        <span>{{ total }}</span>
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
      classColor: '',
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
      if (res) {
        this.total = res.total;
        if (res.color) {
          this.classColor = res.color;
        }
      }

      this.isLoading = false;
      if (this.total === 0 && this.indicator.hideZeroValue) {
        this.$emit('removeme', this.indicator);
      }
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
