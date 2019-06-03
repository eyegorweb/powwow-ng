<template>
  <div class="position-relative" :class="{ isLoading: isLoading }">
    <!-- min-height pour gérer le positionnement du loader lorsqu'aucune commande n'est retournée -->
    <img class="loader" v-if="isLoading" src="@/assets/spinner.svg" />
    <div :class="{ 'is-loading': isLoading }">
      <slot v-if="!isLoading" />
      <span v-else>{{ $t('searching') }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isLoading: Boolean,
  },
};
</script>

<style lang="scss" scoped>
.isLoading {
  min-height: 20vh;
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

  /deep/ .table-blue thead {
    background-color: $gray;
  }

  /deep/ .pagination {
    .page-item:not(.disabled) {
      .page-link {
        color: $gray;
      }
    }
  }

  /deep/ a {
    color: $gray;
  }

  /deep/ button {
    color: $gray;
  }
}
</style>
