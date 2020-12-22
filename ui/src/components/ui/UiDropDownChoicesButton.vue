<template>
  <UiDropdownButton :menu-style="menuStyle">
    <UiButton
      slot="trigger"
      slot-scope="{ staticClass, toggle }"
      variant="outline-primary"
      :class="staticClass"
      @click.prevent="toggle"
    >
      <slot />
    </UiButton>

    <div slot-scope="{ hide }" class="dropdown-menu show">
      <a
        class="dropdown-item"
        v-for="opt in options"
        :key="opt"
        @click.stop="
          () => {
            hide();
            $emit('click', opt);
          }
        "
        >{{ $t(opt) }}
      </a>
    </div>
  </UiDropdownButton>
</template>

<script>
import UiDropdownButton from '@/components/ui/UiDropdownButton';
import UiButton from '@/components/ui/Button';

export default {
  components: {
    UiDropdownButton,
    UiButton,
  },
  props: {
    options: Array, // String[]
    menuStyle: {
      type: Object,
    },
  },
};
</script>

<style lang="scss" scoped>
.dropdown-item:hover {
  cursor: pointer;
}
</style>
