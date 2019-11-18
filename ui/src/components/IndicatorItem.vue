<template>
  <li class="list-group-item">
    {{ $t(indicator.labelKey) }}
    <div class="float-right">
      <button
        :class="`btn btn-link p-0 ${indicator.color || classColor}`"
        :disabled="!indicator.clickable"
        @click.prevent="onClick ? onClick(indicator) : () => {}"
      >
        <CircleLoader v-if="isLoading" />
        <span v-if="!isLoading">{{ total }}</span>
      </button>
    </div>
  </li>
</template>

<script>
import CircleLoader from '@/components/ui/CircleLoader';
import { mapGetters } from 'vuex';

export default {
  props: {
    indicator: Object,
    onClick: {
      type: Function,
      required: false,
    },
    precalculated: Boolean,
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
    this.loadValue();
  },

  computed: {
    ...mapGetters('userContext', ['contextFilters']),
  },

  methods: {
    async loadValue() {
      if (this.precalculated) {
        this.setPrecalculatedValue();
      } else {
        this.refreshIndicator();
      }
    },
    async setPrecalculatedValue() {
      if (this.indicator.precalculatedValue) {
        this.total = this.indicator.precalculatedValue.numberValue;
      } else {
        this.total = 0;
      }
      if (this.total === 0 && this.indicator.hideZeroValue) {
        this.$emit('removeme', this.indicator);
      }
    },
    async refreshIndicator() {
      this.isLoading = true;
      try {
        const res = await this.indicator.fetch(this.indicator, this.contextFilters);
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
      if (!this.precalculated) {
        this.refreshIndicator();
      }
    },
    contextFilters() {
      if (!this.precalculated) {
        this.refreshIndicator();
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
