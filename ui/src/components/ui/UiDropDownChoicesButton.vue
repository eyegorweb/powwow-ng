<template>
  <UiDropdownButton :menu-style="menuStyle">
    <UiButton
      slot="trigger"
      slot-scope="{ staticClass, toggle }"
      variant="outline-primary"
      :class="`${staticClass} ${isActive ? 'active' : ''}`"
      @click.prevent="toggle"
      :style="buttonStyle"
    >
      <slot />
    </UiButton>

    <div slot-scope="{ hide }" class="dropdown-menu show">
      <div
        v-for="opt in options"
        :key="opt"
        v-tooltip="getExportChoiceDisabledMessage ? getExportChoiceDisabledMessage(opt) : undefined"
      >
        <a
          class="dropdown-item"
          :class="{
            disabled: getExportChoiceDisabledMessage
              ? !!getExportChoiceDisabledMessage(opt)
              : false,
          }"
          @click.stop="
            () => {
              hide();
              $emit('click', opt);
            }
          "
        >
          {{ $t(opt) }}
        </a>
      </div>
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
    buttonStyle: Object,
    isActive: Boolean,
    getExportChoiceDisabledMessage: {
      type: Function,
      required: false,
    },
  },
};
</script>

<style lang="scss" scoped>
.dropdown-item:hover {
  cursor: pointer;
}
</style>
