<template>
  <div :class="`col-${size}`">
    <div class="bg-white p-3 mt-4">
      <h4>
        {{ $t(title) }}
        <template v-if="warning">
          <i class="ic-Alert-Icon text-warning" v-tooltip="{ content: tooltipMsg }"></i>
        </template>
      </h4>
      <template v-if="canShow">
        <slot />
      </template>
      <template v-else class="text-center error-txt">
        <slot name="onHide" />
      </template>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    size: {
      type: Number,
      default: 1,
    },
    canShow: Boolean,
    title: {
      type: String,
      default: 'TODO',
    },
    warning: Boolean,
    tooltipMsg: String,
  },
};
</script>

<style lang="scss" scoped>
.error-txt {
  font-size: 1.1rem;
}

.size-3 {
  width: 100%;
}

.size-2 {
  width: 65%;
}

.size-1 {
  width: 30%;
}

h3 {
  text-transform: uppercase;
}
</style>
