<template>
  <TriggerInfo :info="row" />
</template>

<script>
import TriggerInfo from '../TriggerInfo';

export default {
  components: {
    TriggerInfo,
  },
  props: {
    row: Object,
  },
};
</script>

<style lang="scss" scoped></style>
