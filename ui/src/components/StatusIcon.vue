<template>
  <div class="status-icon" :style="{ background: color }">
    <div class="icon-container">
      <i :class="icon"></i>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    icon: String,
    color: String,
  },
};
</script>

<style lang="scss" scoped>
@import '@/theme/scss/mixins/_circle.scss';

.status-icon {
  @include circle;
  width: 2rem;
  height: 2rem;
  display: flex;
  justify-content: center;
  font-size: 1rem;

  .icon-container {
    color: white;
    align-self: center;
  }
}
</style>
