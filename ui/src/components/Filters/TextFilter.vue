<template>
  <div>
    <SimpleInputFilter :selected-value="selectedValue" @update:value="$emit('change', $event)" />
  </div>
</template>

<script>
import SimpleInputFilter from '@/components/Filters/SimpleInputFilter';

export default {
  components: {
    SimpleInputFilter,
  },
  props: {
    selectedData: Object,
  },

  computed: {
    selectedValue() {
      return this.$loGet(this.selectedData, 'value');
    },
  },
};
</script>

<style lang="scss" scoped></style>
