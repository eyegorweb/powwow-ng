<template>
  <div class="carousel-item" :class="[item.color ? item.color : '']">
    <div
      class="card"
      v-tooltip="tooltipMessage"
      :class="{ inactive: isInactive, selected: selected, ['CAROUSEL_ITEM_' + item.id]: true }"
      @click.stop="onClick"
    >
      <div class="card-body">
        <div class="icon-block">
          <span :class="icon" />
        </div>
        <div class="title">{{ $t(title) }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { isFiltersAcceptable } from '@/utils/filters.js';

export default {
  name: 'ActionsCarouselItem',
  props: {
    icon: String,
    title: String,
    subtitle: String,
    item: Object,
    defaultDisabled: Boolean,
  },
  data() {
    return {
      isDisabled: false,
      tooltipMessage: undefined,
    };
  },
  computed: {
    ...mapGetters('actLines', ['currentFilters']),
    ...mapState('actLines', ['actToCreate']),
    selected() {
      if (!this.actToCreate) return false;

      return this.actToCreate.title === this.title;
    },
    isInactive() {
      return this.defaultDisabled || this.isDisabled;
    },
  },
  watch: {
    currentFilters(newCurrentFilters) {
      if (!newCurrentFilters) return;
      if (!this.item.filters) return;

      this.isDisabled = !isFiltersAcceptable(newCurrentFilters, this.item.filters);
    },
    isDisabled(newValue) {
      if (newValue) {
        let message = '';
        let messageTitle = `Les filtres suivants sont obligatoires :`;

        message = this.item.filters.reduce((all, item) => {
          let groupMessage = '';
          let itemMessage = `
    ${this.$t(item.id)}:`;

          if (item.values) {
            groupMessage = item.values.reduce((filterMsg, value) => {
              return (
                filterMsg +
                `
        - ${value.label}`
              );
            }, itemMessage);
          }

          return all + groupMessage;
        }, messageTitle);

        this.tooltipMessage = message;
      } else {
        this.tooltipMessage = undefined;
      }
    },
  },
  methods: {
    onClick() {
      if (this.isInactive) return;

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
    cursor: pointer;

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
      & ::v-deep div {
        color: white;
      }
    }
  }
  .card-body {
    padding: 1rem;
    .title {
      display: table-cell;
      vertical-align: middle;
      font-weight: 500;
      line-height: 1.1875rem;
      color: $dark-gray;
      font-size: 0.8rem;
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

.carousel-item {
  &.blue {
    .card {
      &.selected {
        background: $blue;
      }
    }
  }
  &.orange {
    .card {
      &.selected {
        background: $orange;
      }
    }
  }
}
</style>
