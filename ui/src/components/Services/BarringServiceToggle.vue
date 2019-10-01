<template>
  <div>
    <UiToggle :label="$t(label)" :editable="editable" v-model="checked" />
  </div>
</template>

<script>
import UiToggle from '@/components/ui/UiToggle';
import { isBarrinServiceEnabled } from '@/utils/simServices';
/**
 * Si un code barring est positioné alors le service concerné est désacivé.
 */

export default {
  components: {
    UiToggle,
  },

  props: {
    label: String,
    code: String,
    catalogOffer: Object,
    instanceOffer: Object,
  },

  data() {
    return {
      editable: false,
      checked: true,
    };
  },

  mounted() {
    const { checked, editable } = isBarrinServiceEnabled(this.catalogOffer, this.code);
    this.checked = checked;
    this.editable = editable;
  },

  watch: {
    checked(newVal) {
      this.$emit('change', newVal);
    },
  },
};
</script>

<style lang="scss" scoped></style>
