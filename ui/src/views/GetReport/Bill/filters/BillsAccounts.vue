<template>
  <BillingAccountAutocomplete
    v-model="selectedBillingAccount"
    :partners="partnersForFilters"
    :disabled="!partner"
  />
</template>

<script>
import BillingAccountAutocomplete from '@/components/CustomComboxes/BillingAccountAutocomplete.vue';

export default {
  components: {
    BillingAccountAutocomplete,
  },
  data() {
    return {
      isReady: false,
    };
  },
  props: {
    selectedData: Object,
    selectedFilters: Array,
  },
  mounted() {
    setTimeout(() => {
      this.isReady = true;
    });
  },

  computed: {
    partnersForFilters() {
      if (this.partner) {
        return [this.partner.data];
      }

      return undefined;
    },
    selectedBillingAccount: {
      get() {
        if (!this.selectedData) return;
        if (!this.partner) return;

        const isSelectedDataValid = this.selectedData.data.party.id === this.partner.data.id;
        if (isSelectedDataValid) {
          return this.selectedData.data;
        }

        return undefined;
      },
      set(selectedBillingAccount) {
        if (!this.isReady) return;

        this.$emit('change', selectedBillingAccount);
      },
    },
    partner() {
      return this.selectedFilters.find(f => f.id === 'getadmin.users.filters.partners');
    },
  },
};
</script>

<style scoped></style>
