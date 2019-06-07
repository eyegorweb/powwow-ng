<template>
  <div class="carousel-item">
    <div class="card" :class="{ inactive: isDisabled, selected: selected }" @click="onClick">
      <div class="card-body">
        <div class="row">
          <div class="icon-block">
            <span :class="icon" />
          </div>
          <div class="title">{{ $t(title) }}</div>
        </div>
        <div class="subrow">
          <div class="subtitle">{{ subtitle }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import differenceWith from 'lodash.differencewith';

export default {
  name: 'ActionsCarouselItem',
  props: {
    icon: String,
    title: String,
    subtitle: String,
    selected: Boolean,
    item: Object,
  },
  data() {
    return {
      isDisabled: false,
    };
  },
  computed: {
    ...mapGetters('actLines', ['currentFilters']),
  },
  watch: {
    currentFilters(newCurrentFilters) {
      if (!newCurrentFilters) return;
      if (!this.item.filters) return;

      let isEnabled = true;

      for (let i = 0, max = this.item.filters.length; i < max; i++) {
        const itemFilter = this.item.filters[i];
        const concernedFilter = newCurrentFilters.find(it => itemFilter.id === it.id);
        if (concernedFilter && concernedFilter.values && concernedFilter.values.length) {
          const diff = differenceWith(
            concernedFilter.values,
            itemFilter.values,
            (a, b) => a.id === b.id
          );
          if (diff.length === 0) {
            isEnabled = isEnabled && true;
          } else {
            isEnabled = false;
          }
        }
      }

      this.isDisabled = !isEnabled;
    },
  },
  methods: {
    onClick() {
      if (this.isDisabled) return;

      this.$emit('click');
    },
  },
};
</script>

<style lang="scss" scoped>
.carousel-item {
  padding-right: 0.3125rem;
  .card {
    border: none;
    box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.2);
    margin: 0.5rem;

    &.inactive {
      background: $medium-gray;
      color: $gray-680;

      .card-body .title {
        color: $gray-680;
      }
    }

    &.selected {
      background: $secondary;
      color: white;
      & /deep/ div {
        color: white;
      }
    }
  }
  .card-body {
    padding: 1.25rem 1rem 0.5rem;
    .title {
      display: table-cell;
      vertical-align: middle;
      font-weight: 600;
      line-height: 1.1875rem;
      color: $dark-gray;
    }
    .subtitle {
      font-size: 0.75rem;
      color: $gray-680;
      line-height: 20px;
    }
    > .row {
      display: table;
      table-layout: fixed;
      height: 2.6rem;
      font-size: 0.875rem;
    }
    .subrow {
      text-align: center;
    }
  }
  .icon-block {
    font-size: 1.3rem;
    display: table-cell;
    vertical-align: middle;
    padding: 0 0.5rem;
  }
}
</style>
