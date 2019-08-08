<template>
  <div>
    <UiToggle :label="$t(label)" :editable="editable" v-model="checked" />
  </div>
</template>

<script>
import UiToggle from '@/components/ui/UiToggle';
import { isNormalServiceEnabled } from '@/utils/simServices';

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
    const { checked, editable } = isNormalServiceEnabled(this.catalogOffer, this.code);
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
