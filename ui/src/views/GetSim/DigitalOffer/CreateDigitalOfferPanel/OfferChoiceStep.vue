<template>
  <CreateOrderStepContainer
    wide
    no-previous-button
    @done="done"
    :can-go-to-next-step="!!canGoToNextStep"
  >
    <div class="step-container">
      <div class="offerContainer">
        <div class="row" :class="cardCSSStyleCenter">
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
import { mapGetters } from 'vuex';

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
    ...mapGetters(['userInfos']),
    canGoToNextStep() {
      return !!this.currentOffer;
    },
    cardCSSStyleCenter() {
      let nbCardOffers = this.offers.length;
      if (nbCardOffers === 3) {
        return '';
      } else if (nbCardOffers === 2) {
        return 'justify-content-center';
      }
      return 'justify-content-center';
    },
  },
  async mounted() {
    if (!this.synthesis) return false;
    this.offers = await fetchWorkflows(this.userInfos.partners[0].siret);
    this.preFill();
  },
  methods: {
    preFill() {
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

<style lang="scss" scoped>
@media only screen and (max-width: 700px) {
  .col-4 {
    max-width: 100%;
  }

  .offerContainer {
    .row {
      justify-content: center;
    }
  }
}
</style>
