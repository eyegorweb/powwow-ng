<template>
  <UiSelect class="text-gray" v-model="val" :options="options" block />
</template>

<script>
import UiSelect from '@/components/ui/UiSelect';

export default {
  components: {
    UiSelect,
  },
  props: {
    selectedValue: {
      type: String,
    },
  },
  computed: {
    val: {
      get() {
        const found = this.options.find((o) => o.label === this.selectedValue);
        if (found) {
          return found.value;
        }

        return undefined;
      },
      set(value) {
        this.$emit(
          'update:value',
          this.options.find((o) => o.value === value)
        );
      },
    },
  },
  data() {
    return {
      options: [
        {
          label: '',
          value: 'none',
        },
        {
          label: this.$t('common.YES'),
          value: true,
        },
        {
          label: this.$t('common.NO'),
          value: false,
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped></style>
