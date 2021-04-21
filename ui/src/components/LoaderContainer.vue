<template>
  <div class="position-relative" :class="{ isLoading: isLoading }">
    <!-- min-height pour gérer le positionnement du loader lorsqu'aucune commande n'est retournée -->
    <slot v-if="isLoading" name="on-loading">
      <img class="loader" src="@/assets/spinner.svg" />
      <div :class="{ 'is-loading': isLoading }">
        <span>{{ $t(loadingKey) }}</span>
      </div>
    </slot>
    <slot v-else />
  </div>
</template>

<script>
export default {
  props: {
    isLoading: Boolean,
    loadingKey: {
      type: String,
      default: 'searching',
    },
  },
};
</script>

<style lang="scss" scoped>
.isLoading {
  min-height: 20vh;
  z-index: 0;
}
.loader {
  z-index: 1;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%);
}
.is-loading {
  position: relative;
  pointer-events: none;
  opacity: 0.5;

  ::v-deep .table-blue thead {
    background-color: $gray;
  }

  ::v-deep .pagination {
    .page-item:not(.disabled) {
      .page-link {
        color: $gray;
      }
    }
  }

  ::v-deep a {
    color: $gray;
  }

  ::v-deep button {
    color: $gray;
  }
}
</style>
