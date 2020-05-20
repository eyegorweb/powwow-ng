<template>
  <BillingAccountAutocomplete v-model="selectedBillingAccount" :partners="partnersForFilters" />
</template>

<script>
import BillingAccountAutocomplete from '@/components/CustomComboxes/BillingAccountAutocomplete.vue';

export default {
  components: {
    BillingAccountAutocomplete,
  },
  data() {
    return {
      partnersForFilters: undefined,
      selectedBillingAccount: undefined,
      isReady: false,
    };
  },
  props: {
    selectedData: Object,
    selectedFilters: Array,
  },

  mounted() {
    this.initComponent();
  },

  methods: {
    initComponent() {
      const foundPartner = this.selectedFilters.find(
        p => p.id === 'getadmin.users.filters.partners'
      );
      if (foundPartner) {
        this.partnersForFilters = [foundPartner.data];
      }

      if (this.selectedData) {
        if (foundPartner) {
          const isSelectedDataValid = this.selectedData.data.party.id === foundPartner.data.id;
          if (!isSelectedDataValid) {
            this.selectedBillingAccount = undefined;
          } else {
            this.selectedBillingAccount = this.selectedData.data;
          }
        } else {
          this.selectedBillingAccount = this.selectedData.data;
        }
      }

      setTimeout(() => {
        this.isReady = true;
      });
    },
  },

  watch: {
    selectedBillingAccount(selectedBillingAccount) {
      if (!this.isReady) return;

      if (selectedBillingAccount) {
        if (selectedBillingAccount.id) {
          this.$emit('change', selectedBillingAccount);
        }
      } else {
        this.$emit('change', undefined);
      }
    },
    selectedFilters() {
      this.initComponent();
    },
  },
};
</script>

<style scoped></style>
