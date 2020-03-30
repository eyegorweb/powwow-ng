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
  position: relative;

  .icon-container {
    color: white;
    width: 16px;
    height: 16px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    i {
    }
  }
}
</style>
