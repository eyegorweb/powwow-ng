<template>
  <div>
    <SimpleInputFilter @update:value="$emit('change', $event)" />
  </div>
</template>

<script>
// To REFACTO
import SimpleInputFilter from '@/components/Filters/SimpleInputFilter';

export default {
  components: {
    SimpleInputFilter,
  },
};
</script>

<style lang="scss" scoped></style>
