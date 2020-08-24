<template>
  <UiApiAutocomplete :items="localItems" v-model="selectedValue" display-results-while-empty />
</template>

<script>
import UiApiAutocomplete from '@/components/ui/UiApiAutocomplete';

export default {
  components: {
    UiApiAutocomplete,
  },
  data() {
    return {
      localItems: [
        {
          id: 1,
          label: 'Catalogue 1',
        },
      ],
    };
  },

  computed: {
    selectedValue: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },
  },
};
</script>

<style lang="scss" scoped></style>
