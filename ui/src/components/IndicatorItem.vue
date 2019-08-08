<template>
  <li class="list-group-item">
    {{ $t(indicator.labelKey) }}
    <div class="float-right">
      <button
        :class="`btn btn-link p-0 ${indicator.color || classColor}`"
        :disabled="!indicator.clickable"
        @click.prevent="onClick(indicator)"
      >
        <CircleLoader v-if="isLoading" />
        <span v-if="!isLoading">{{ total }}</span>
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
    onClick: Function,
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
      try {
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
      } catch (e) {
        console.error(e);
        this.isLoading = false;
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
