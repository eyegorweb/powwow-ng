<template>
  <div>
    <SimpleInputFilter
      :selected-value="selectedEmailValue"
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
      selectedEmailValue: undefined,
    };
  },
};
</script>

<style lang="scss" scoped></style>
