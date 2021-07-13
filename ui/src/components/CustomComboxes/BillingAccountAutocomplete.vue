<template>
  <div>
    <UiApiAutocomplete
      v-if="canSeeAutoComplete"
      :api-method="fetchBillingAccounts"
      v-model="selectedBillingAccount"
      :disabled="disabled"
      :error="error"
      scroll-for-next
      display-results-while-empty
    />
  </div>
</template>

<script>
import UiApiAutocomplete from '@/components/ui/UiApiAutocomplete';
import { fetchBillingAccounts } from '@/api/billingAccounts';

export default {
  components: {
    UiApiAutocomplete,
  },

  props: {
    value: Object,
    selectedPartner: Object,
    disabled: Boolean,
    error: String,
    preselectFirstOnlyWhenOneItem: Boolean,
  },

  data() {
    return {
      selectedBillingAccount: undefined,
      canSeeAutoComplete: true,
      canChooseWhenOneItem: true,
    };
  },

  mounted() {
    this.selectedBillingAccount = this.value;
  },

  watch: {
    selectedPartner(value, previous) {
      if (value && value.id) {
        if (!previous || !previous.id || (previous && previous.id && previous.id !== value.id)) {
          this.canChooseWhenOneItem = true;
          this.resetComponent();
        }
      } else if (!value || (value && !value.label)) {
        this.resetComponent();
      }
    },
    selectedBillingAccount(newValue) {
      if ((newValue && newValue.id) || newValue === undefined) {
        this.$emit('input', newValue);
      }
    },
  },

  methods: {
    resetComponent() {
      this.selectedBillingAccount = undefined;
      this.canSeeAutoComplete = false;
      this.$nextTick(() => {
        this.canSeeAutoComplete = true;
      });
    },
    async fetchBillingAccounts(q, page = 0) {
      const partners = [];
      if (this.selectedPartner) {
        partners.push(this.selectedPartner);
      }

      const data = await fetchBillingAccounts(q, partners, { page, limit: 10 });

      const formatted = data.map((ba) => ({
        id: ba.id,
        label: `${ba.code} - ${ba.name}`,
        data: ba,
        partnerId: ba.party.id,
        partner: ba.party,
        code: ba.code,
      }));

      if (
        (q === undefined || q === '') &&
        page === 0 &&
        formatted.length === 1 &&
        this.canChooseWhenOneItem &&
        this.preselectFirstOnlyWhenOneItem
      ) {
        this.selectedBillingAccount = formatted[0];
        this.canChooseWhenOneItem = false;
      }

      return formatted;
    },
  },
};
</script>

<style lang="scss" scoped></style>
