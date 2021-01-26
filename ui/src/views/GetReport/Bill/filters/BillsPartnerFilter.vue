<template>
  <PartnerCombo :value.sync="selectedPartner" />
</template>

<script>
import PartnerCombo from '@/components/CustomComboxes/PartnerCombo.vue';

export default {
  components: {
    PartnerCombo,
  },

  props: {
    selectedData: Object,
    selectedFilters: Array,
  },

  data() {
    return {
      isReady: false,
      selectedPartner: undefined,
    };
  },

  watch: {
    selectedPartner(newValue) {
      this.$emit('change', newValue);
    },
  },

  mounted() {
    setTimeout(() => {
      if (this.selectedData) {
        this.selectedPartner = { ...this.selectedData };
      }
      this.isReady = true;
    });
  },

  methods: {
    onChange(partners) {
      this.$emit('change', partners);
    },
  },
};
</script>

<style scoped></style>
