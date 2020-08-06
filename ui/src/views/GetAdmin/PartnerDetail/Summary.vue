<template>
  <div>
    <MultiCustomerSummary v-if="partnerType === 'MULTI_CUSTOMER'" :party-detail="partyDetail" />
    <NormalSummary v-else :party-detail="partyDetail" />
  </div>
</template>

<script>
import { fetchPartyDetail } from '@/api/partners.js';
import NormalSummary from './Summaries/NormalSummary';
import MultiCustomerSummary from './Summaries/MultiCustomerSummary';

export default {
  components: {
    NormalSummary,
    MultiCustomerSummary,
  },

  props: {
    partnerType: String,
    partnerId: String,
  },

  data() {
    return {
      partyDetail: undefined,
    };
  },

  async mounted() {
    this.partyDetail = await fetchPartyDetail(this.partnerId);
  },
};
</script>

<style lang="scss" scoped></style>
