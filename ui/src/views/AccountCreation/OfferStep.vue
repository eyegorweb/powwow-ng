<template>
  <div class="step-container">
    <div class="offerContainer">
      <div class="row">
        <div class="col-4" v-for="offer in offers" :key="offer.id">
          <OfferCard
            :offer="offer"
            :is-active="offer === currentOffer"
            @select:offer="getCurrentOffer"
          />
        </div>
      </div>
    </div>
    <BottomBar @next="gotoNext" @prev="gotoPrev" :can-prev="true" :can-next="canNext" />
  </div>
</template>

<script>
import BottomBar from './BottomBar.vue';
import OfferCard from './OfferCard.vue';
import { fetchWorkflows } from '@/api/digital.js';

export default {
  components: {
    BottomBar,
    OfferCard,
  },
  props: {
    synthesis: Object,
  },
  async mounted() {
    this.offers = await fetchWorkflows();
    if (!this.synthesis) {
      this.$router.push({ name: 'createAccount.partner' });
    }
  },
  data() {
    return {
      currentOffer: undefined,
      offers: [],
    };
  },
  computed: {
    canNext() {
      return !!this.currentOffer;
    },
  },
  methods: {
    gotoPrev() {
      this.$router.push({
        name: 'createAccount.partner',
      });
    },
    gotoNext() {
      this.$router.push({
        name: 'createAccount.simChoice',
        params: { step: { offerStep: this.currentOffer } },
      });
    },
    getCurrentOffer(selectedOffer) {
      this.currentOffer = selectedOffer.selectedOffer;
    },
  },
};
</script>

<style lang="scss" scoped>
.offerContainer {
  width: 80%;
  margin: 0 auto;
  .row {
    justify-content: space-between;
  }
}
</style>
