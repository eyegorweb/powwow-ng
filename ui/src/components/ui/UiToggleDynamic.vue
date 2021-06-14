<template>
  <div class="pb-3">
    <Toggle
      v-if="toggleValues"
      @update="$emit('input', $event)"
      :values="toggleValues"
      no-default
      class="pl-2"
    />
  </div>
</template>

<script>
import Toggle from '@/components/ui/UiToggle2';

export default {
  components: {
    Toggle,
  },

  props: {
    value: Object,
    options: Array,
  },
  data() {
    return {
      toggleValues: undefined,
    };
  },
  mounted() {
    this.toggleValues = this.options;
    if (this.value) {
      const newToggleValues = this.toggleValues.map((t) => {
        if (t.id === this.value.id) {
          t.default = true;
        }
        return t;
      });
      this.toggleValues = undefined;

      this.$nextTick(() => {
        this.toggleValues = newToggleValues;
      });
    }
  },

  watch: {
    value(selectedData) {
      if (!selectedData) {
        const newToggleValues = this.toggleValues.map((t) => {
          t.default = false;
          return t;
        });
        this.toggleValues = undefined;
        this.$nextTick(() => {
          this.toggleValues = newToggleValues;
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
