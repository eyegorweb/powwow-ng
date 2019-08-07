<template>
  <div>
    <UiToggle :label="$t(label)" :editable="editable" v-model="checked" />
  </div>
</template>

<script>
import UiToggle from '@/components/ui/UiToggle';
import { getServiceData } from '@/utils/simServices';

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
      checked: false,
    };
  },

  mounted() {
    const data = this.getData();
    console.log(data);
    if (data) {
      this.editable = data.partyAccess || false;
      this.checked = !data.activatedByDefault;

      // Need to deal with instance part
    }
  },

  watch: {
    checked(newVal) {
      this.$emit('change', newVal);
    },
  },

  methods: {
    getData() {
      return getServiceData(this.catalogOffer, this.code);
    },
  },
};
</script>

<style lang="scss" scoped></style>
