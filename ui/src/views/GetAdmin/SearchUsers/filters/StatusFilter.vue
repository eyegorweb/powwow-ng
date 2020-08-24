<template>
  <div class="pb-3">
    <Toggle
      v-if="toggleValues"
      @update="$emit('change', $event)"
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
    selectedData: Object,
  },
  mounted() {
    if (this.selectedData && this.selectedData.id) {
      const newToggleValues = this.toggleValues.map(t => {
        if (t.id === this.selectedData.id) {
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
    selectedData(selectedData) {
      if (!selectedData) {
        const newToggleValues = this.toggleValues.map(t => {
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

  data() {
    return {
      toggleValues: [
        {
          id: 1,
          label: 'col.active',
          value: false,
        },
        {
          id: 2,
          label: 'col.notActive',
          value: true,
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped></style>
