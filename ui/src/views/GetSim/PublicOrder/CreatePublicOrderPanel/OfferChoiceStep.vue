<template>
  <CreateOrderStepContainer
    wide
    no-previous-button
    @done="done"
    :can-go-to-next-step="!!canGoToNextStep"
  >
    <div class="step-container">
      <div class="offerContainer">
        <div class="row">
          <div class="col-4" v-for="offer in offers" :key="offer.id">
            <OfferCard
              :offer="offer"
              :is-active="
                offer === currentOffer ||
                  (synthesis && synthesis.offerStep ? offer.code === currentOffer.code : false)
              "
              @select:offer="getCurrentOffer"
            />
          </div>
        </div>
      </div>
    </div>
  </CreateOrderStepContainer>
</template>

<script>
import CreateOrderStepContainer from '@/views/GetSim/CreateOrder/CreateOrderStepContainer.vue';
import OfferCard from '@/views/AccountCreation/OfferCard.vue';
import { fetchWorkflows } from '@/api/digital.js';

export default {
  components: {
    CreateOrderStepContainer,
    OfferCard,
  },
  props: {
    synthesis: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      currentOffer: undefined,
      offers: [],
    };
  },
  computed: {
    canGoToNextStep() {
      return !!this.currentOffer;
    },
  },
  async mounted() {
    this.offers = await fetchWorkflows();
    this.preFill();
  },
  methods: {
    preFill() {
      if (!this.synthesis) return false;
      if (this.synthesis && this.synthesis.offerStep) {
        return this.offers.map((o) => {
          if (o.code === this.synthesis.offerStep.code) {
            this.currentOffer = this.synthesis.offerStep;
          }
        });
      }
    },
    getSynthesis() {
      return {
        offerStep: this.currentOffer,
      };
    },
    getCurrentOffer(selectedOffer) {
      this.currentOffer = selectedOffer.selectedOffer;
    },
    done() {
      this.$emit('done', {
        offerStep: this.currentOffer,
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
