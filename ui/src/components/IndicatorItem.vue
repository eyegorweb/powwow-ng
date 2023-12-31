<template>
  <li class="list-group-item">
    {{ $t(indicator.labelKey) }}
    <div class="float-right">
      <button
        :class="`btn btn-link p-0 ${formattedColor || classColor}`"
        :disabled="disableClick || !indicator.clickable"
        @click.prevent="onClick ? onClick(indicator, total) : () => {}"
      >
        <CircleLoader v-if="isLoading" />
        <span v-if="!isLoading">{{ formattedTotal }}</span>
      </button>
    </div>
  </li>
</template>

<script>
import CircleLoader from '@/components/ui/CircleLoader';
import { mapGetters } from 'vuex';
import { formatLargeNumber } from '@/utils/numbers';

export default {
  props: {
    indicator: Object,
    onClick: {
      type: Function,
      required: false,
    },
    canRefresh: {
      type: Boolean,
      default: true,
    },
    precalculated: Boolean,
    disableClick: Boolean,
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
    formattedTotal() {
      let value = this.total;
      if (typeof value === 'number') {
        value = formatLargeNumber(value);
      }

      if (this.indicator.getValueWithUnit) {
        return this.indicator.getValueWithUnit(value);
      }

      return value;
    },
    unit() {
      if (this.indicator.getUnit) {
        return this.indicator.getUnit(this.total);
      }

      return '';
    },
    formattedColor() {
      if (!this.indicator.color) {
        if (this.total === 0) {
          return 'text-success';
        } else {
          return 'text-warning';
        }
      }
      return this.indicator.color;
    },
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
      if (!this.canRefresh) return;
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
    contextFilters() {
      if (!this.precalculated) {
        this.refreshIndicator();
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
