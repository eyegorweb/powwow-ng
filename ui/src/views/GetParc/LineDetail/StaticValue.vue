<template>
  <div class="mt-2">
    <label class="label">{{ label }}</label>
    <div>
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    label: String,
  },
};
</script>

<style lang="scss" scoped>
.label {
  font-size: 0.9rem !important;
  color: #7d7d7d;
}
</style>
