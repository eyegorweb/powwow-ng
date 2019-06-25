<template>
  <div :class="`alert alert-${msgInfo.level} ${destroyingClassName}`" role="alert">
    {{ msgInfo.message }}
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  props: {
    msgInfo: Object,
  },
  data() {
    return {
      destroyingMessage: false,
    };
  },
  mounted() {
    setTimeout(() => (this.destroyingMessage = true), 4000);
  },
  methods: {
    ...mapMutations(['clearMessage']),
  },
  computed: {
    destroyingClassName() {
      return this.destroyingMessage ? 'destroying' : '';
    },
  },

  watch: {
    destroyingMessage(newValue) {
      if (newValue) {
        setTimeout(() => this.$emit('remove', this.msgInfo.id), 3000);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.alert {
  transform: translateY(20px);
  animation: slide-down 0.4s ease;
  visibility: visible;
  opacity: 1;
  transition: opacity 2s linear;
}

.destroying {
  visibility: hidden;
  opacity: 0;
  transition: visibility 0s 0.4s, opacity 0.4s linear;
}
@keyframes slide-down {
  0% {
    opacity: 0;
    transform: translateY(0);
  }
  100% {
    opacity: 1;
    transform: translateY(20px);
  }
}
</style>
