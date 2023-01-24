<template>
  <div class="cmp-offers-part">
    <UiApiAutocomplete
      v-if="showCombo"
      :api-method="searchOffers"
      v-model="selectedLocalValue"
      :error="errors"
      display-results-while-empty
      scroll-for-next
      :disabled="disabled"
      search-type="contain"
    />
  </div>
</template>

<script>
import { fetchOffers } from '@/api/offers';
import UiApiAutocomplete from '@/components/ui/UiApiAutocomplete';
import { mapState } from 'vuex';

export default {
  components: {
    UiApiAutocomplete,
  },
  props: {
    partner: Object,
    chosenBillingAccount: {
      type: Object,
      required: false,
    },
    billingAccountMandatory: Boolean,
    errors: {
      type: Object,
      required: false,
    },
    disabled: Boolean,
    allOffers: Boolean,
    haveLvOffers: Boolean,
    keepSelectedValue: {
      type: Boolean,
      required: false,
      default: false,
    },
    hasPrerequisiteValue: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      // selectedOffer: undefined,
      selectedLocalValue: undefined,
      showCombo: true,
      prerequisiteOffer: null,
    };
  },
  mounted() {
    this.prerequisiteOffer =
      this.actCreationPrerequisites &&
      this.actCreationPrerequisites.offer &&
      this.actCreationPrerequisites.offer.id
        ? this.actCreationPrerequisites.offer.id
        : '';
  },
  methods: {
    async searchOffers(q, page = 0) {
      // TODO à valider avec @jpquere
      // if (this.billingAccountMandatory && !this.chosenBillingAccount) return;

      if (this.partner) {
        if (this.partner.id) {
          const queryParams = {
            page,
            limit: 10,
            partnerType: this.contextPartnersType,
          };
          if (this.chosenBillingAccount) {
            queryParams.customerAccountCode = this.chosenBillingAccount.code;
          }
          if (!this.allOffers) {
            queryParams.disabledOffer = true;
          }

          queryParams.haveLvOffers = !!this.haveLvOffers;
          if (this.hasPrerequisiteValue && this.prerequisiteOffer) {
            queryParams.notEqualsOfferCode = this.prerequisiteOffer;
          }

          const data = await fetchOffers(q, [this.partner], queryParams);
          if (data) {
            let dataToUse = data;
            return dataToUse.map((o) => ({
              id: o.code,
              label: o.workflowDescription,
              data: o,
            }));
          }
        } else if (this.partner.label && this.partner.label.length) {
          return [];
        }
      } else {
        return [];
      }

      return [];
    },

    recreateCombo() {
      this.showCombo = false;
      setTimeout(() => {
        this.showCombo = true;
      });
    },
  },
  watch: {
    partner() {
      this.recreateCombo();
    },
    chosenBillingAccount(newValue) {
      if (this.billingAccountMandatory) {
        if (!newValue) {
          this.selectedLocalValue = undefined;
        }

        this.recreateCombo();
      }
    },
    selectedLocalValue(value) {
      if (!value) {
        this.$emit('update:offer', undefined);
        return;
      }
      if (value && value.label === '') {
        this.$emit('update:offer', undefined);
        return;
      }
      if (value && !value.label) {
        this.$emit('reset:offer', undefined);
        return;
      }
      if (value && value.id) {
        this.$emit('update:offer', value);
      }
    },
  },

  computed: {
    ...mapState('userContext', ['contextPartnersType', 'contextPartners']),
    ...mapState('actLines', ['actCreationPrerequisites']),
  },
};
</script>

<style lang="scss" scoped></style>
