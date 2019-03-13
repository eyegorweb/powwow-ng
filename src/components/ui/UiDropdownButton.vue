<template>
  <div class="position-relative">
    <slot name="trigger" static-class="dropdown-toggle" :is-open="isOpen" :toggle="toggle">
      <UiButton
        variant="outline-gray"
        class="dropdown-toggle"
        :class="isOpen && 'text-secondary'"
        @click.stop="toggle"
      >
        <slot name="button" />
      </UiButton>
    </slot>

    <transition name="fade">
      <div
        class="dropdown-menu shadow rounded-1 border-0 show pt-0 pb-0"
        v-if="isOpen"
        v-clickaway="hide"
      >
        <slot :hide="hide" />
      </div>
    </transition>

    <slot name="append" />
  </div>
</template>

<script>
import { clickaway } from '@/directives/clickaway';
import UiButton from '@/components/ui/Button';

export default {
  data() {
    return {
      isOpen: false,
    };
  },

  methods: {
    toggle() {
      this.isOpen = !this.isOpen;
    },
    hide() {
      this.isOpen = false;
    },
  },

  directives: { clickaway },
  components: { UiButton },
};
</script>

<style scoped></style>
