<template>
  <div>
    <PartnerTypeCombo @input="$emit('change', $event)" no-empty-option />
  </div>
</template>

<script>
import PartnerTypeCombo from '@/components/CustomComboxes/PartnerTypeCombo.vue';

export default {
  components: {
    PartnerTypeCombo,
  },
};
</script>

<style lang="scss" scoped></style>
