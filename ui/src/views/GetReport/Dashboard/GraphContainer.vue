<template>
  <div class="bg-white p-3 m-1" :class="`size-${size}`">
    <div v-if="canShow">
      <slot />
    </div>
    <div v-else class="text-center error-txt">
      <slot name="onHide" />
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
</style>
