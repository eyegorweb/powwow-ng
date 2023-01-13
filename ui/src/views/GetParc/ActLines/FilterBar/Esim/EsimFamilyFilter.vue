<template>
  <UiSelect class="text-gray" v-model="val" :options="options" block />
</template>

<script>
import UiSelect from '@/components/ui/UiSelect';
import { simCardFamilies } from '@/api/esim.js';

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
      options: [],
    };
  },
  async mounted() {
    let response = await simCardFamilies();
    response.forEach((e) => {
      this.options.push({
        label: e.label,
        value: e.simCardFamily,
      });
    });
  },
};
</script>

<style lang="scss" scoped></style>
