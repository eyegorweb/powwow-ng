<template>
  <div>
    <SimpleInputFilter
      :selected-value="selectedFullNameValue"
      @update:value="$emit('change', $event)"
    />
  </div>
</template>

<script>
import SimpleInputFilter from '@/components/Filters/SimpleInputFilter';

export default {
  components: {
    SimpleInputFilter,
  },
  data() {
    return {
      selectedFullNameValue: undefined,
    };
  },
};
</script>

<style lang="scss" scoped></style>
