<template>
  <div>
    <UiCheckbox
      :checked="false"
      :value="$t('filters.actionValues.PREACTIVATED')"
      v-model="linePreActivated"
    >
      {{ $t('filters.actionValues.PREACTIVATED') }}
    </UiCheckbox>
    <UiCheckbox
      :checked="false"
      :value="$t('filters.actionValues.ACTIVATED')"
      v-model="lineActivated"
    >
      {{ $t('filters.actionValues.ACTIVATED') }}
    </UiCheckbox>
  </div>
</template>

<script>
import UiCheckbox from '@/components/ui/Checkbox';

export default {
  components: {
    UiCheckbox,
  },
  props: {
    selectedData: Object,
  },

  computed: {
    linePreActivated: {
      get() {
        if (!this.selectedData) {
          return false;
        }
        return this.selectedData.values.find((v) => v.id === 'filters.actionValues.PREACTIVATED');
      },
      set(newValue) {
        const values = [];
        if (this.lineActivated) {
          values.push(this.lineActivated);
        }
        if (newValue) {
          values.push({
            id: 'filters.actionValues.PREACTIVATED',
            label: this.$t('filters.actionValues.PREACTIVATED'),
            value: true,
          });
        }
        this.$emit('change', values);
      },
    },
    lineActivated: {
      get() {
        if (!this.selectedData) {
          return false;
        }
        return this.selectedData.values.find((v) => v.id === 'filters.actionValues.ACTIVATED');
      },
      set(newValue) {
        const values = [];
        if (this.linePreActivated) {
          values.push(this.linePreActivated);
        }
        if (newValue) {
          values.push({
            id: 'filters.actionValues.ACTIVATED',
            label: this.$t('filters.actionValues.ACTIVATED'),
            value: true,
          });
        }
        this.$emit('change', values);
      },
    },
  },
};
</script>

<style lang="scss" scoped></style>
