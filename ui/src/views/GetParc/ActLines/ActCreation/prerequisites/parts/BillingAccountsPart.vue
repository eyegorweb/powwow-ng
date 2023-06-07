<template>
  <div class="billing-account-prereq">
    <BillingAccountAutocomplete
      v-model="selectedBillingAccount"
      :selected-partner="partner"
      :disabled="disabled"
      @reset="reset"
      preselect-first-only-when-one-item
    />
  </div>
</template>

<script>
import BillingAccountAutocomplete from '@/components/CustomComboxes/BillingAccountAutocomplete.vue';

export default {
  components: {
    BillingAccountAutocomplete,
  },
  props: {
    partner: Object,
    preselectBillingAccount: Object,
    errors: {
      type: Object,
      required: false,
    },
    disabled: Boolean,
  },
  data() {
    return {
      selectedBillingAccount: undefined,
    };
  },
  async mounted() {
    if (this.preselectBillingAccount) {
      this.selectedBillingAccount = { ...this.preselectBillingAccount };
    }
  },
  methods: {
    reset() {
      this.$emit('reset', undefined);
    },
  },
  watch: {
    selectedBillingAccount(newValue) {
      if (newValue && newValue.code) {
        this.$emit('set:billingAccount', newValue);
      } else {
        this.$emit('set:billingAccount', undefined);
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
