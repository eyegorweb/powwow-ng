<template>
  <transition name="collapse" @enter="enter" @after-enter="afterEnter" @leave="leave">
    <slot />
  </transition>
</template>

<script>
export default {
  methods: {
    enter(el) {
      // make the element invisible before getting it's size
      el.style.visibility = 'hidden';

      const { width } = getComputedStyle(el);
      el.style.width = width;
      el.style.position = 'absolute';
      el.style.height = 'auto';

      // a second getComputedStyle in case the width changed something
      const { height } = getComputedStyle(el);
      el.style.width = null;
      el.style.position = null;
      el.style.visibility = null;
      el.style.height = 0;

      // we wait one frame to trigger the animation
      // setTimeout seems to work better than requestAnimationFrame
      setTimeout(() => {
        el.style.height = height;
      });
    },

    afterEnter(el) {
      el.style.height = 'auto';
    },

    leave(el) {
      const height = getComputedStyle(el).height;

      el.style.height = height;

      // we wait one frame to trigger the animation
      setTimeout(() => {
        el.style.height = 0;
      });
    },
  },
};
</script>

<style scoped>
.collapse-enter-active,
.collapse-leave-active {
  transition: height 300ms ease-out;
  overflow: hidden;
}

.collapse-enter,
.collapse-leave-to {
  height: 0;
}
</style>
