<template>
  <div>
    <Thresholds :alarm="row.alarm" />
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
