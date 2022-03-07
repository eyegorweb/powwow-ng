<template>
  <PartnerCombo
    :value.sync="selectedPartner"
    :party-types="['MULTI_CUSTOMER', 'CUSTOMER']"
    :disabled="!!partnerGroup"
  />
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

  computed: {
    partnerGroup() {
      const partnerGroup = this.selectedFilters.find(
        (f) => f.id === 'getadmin.users.filters.partnerGroup'
      );
      return partnerGroup && partnerGroup.data.value;
    },
  },

  methods: {
    onChange(partners) {
      this.$emit('change', partners);
    },
  },
};
</script>

<style scoped></style>
