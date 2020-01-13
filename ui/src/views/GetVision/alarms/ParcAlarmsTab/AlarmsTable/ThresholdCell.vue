<template>
  <div>
    <Thresholds :alarm="row" />
  </div>
</template>

<script>
import Thresholds from '@/components/Thresholds';

export default {
  props: {
    row: Object,
  },
  components: {
    Thresholds,
  },
};
</script>
