<template>
  <PartnerCombo
    :value.sync="selectedPartner"
    :party-types="['MULTI_CUSTOMER', 'CUSTOMER']"
    :disabled="!!partnerGroup"
    offline
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
    };
  },

  mounted() {
    setTimeout(() => {
      this.isReady = true;
    });
  },

  computed: {
    partnerGroup() {
      const partnerGroup = this.selectedFilters.find(
        f => f.id === 'getadmin.users.filters.partnerGroup'
      );
      return partnerGroup && partnerGroup.data.value;
    },
    selectedPartner: {
      get() {
        if (!this.selectedData) return;

        return this.selectedData.data;
      },
      set(selectedPartner) {
        if (!this.isReady) return;

        this.$emit('change', selectedPartner);
      },
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
