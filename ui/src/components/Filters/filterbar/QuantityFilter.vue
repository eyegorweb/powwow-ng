<template>
  <InputRange
    type="number"
    :from="selectedData ? selectedData.from : ''"
    :to="selectedData ? selectedData.to : ''"
    @change="$emit('change', $event)"
  />
</template>

<script>
import InputRange from '@/components/ui/InputRange';

export default {
  components: {
    InputRange,
  },
  props: {
    selectedData: Object,
  },
};
</script>

<style lang="scss" scoped></style>
