<template>
  <CreateOrderStepContainer @done="done" @prev="prev" :can-go-to-next-step="!!canGoToNextStep()">
    <div class="servicesStep">
      <div class="activationChoice">
        <h3 class="font-weight-light text-center mt-4 mb-4">{{ $t('orders.choose-services') }}</h3>
        <div class="toggles-container">
          <UiToggle
            :label="$t('col.preActivationAsked')"
            v-model="preActivation"
            :editable="!activation"
          />
          <UiToggle :label="$t('col.activationAsked')" v-model="activation" />
        </div>
      </div>
      <LoaderContainer :is-loading="isLoadingOffers">
        <template v-if="activation && offers && offers.length">
          <div class="offerChoice">
            <OffersChoice
              v-model="selectedOffer"
              :offers="offers"
              :partner-id="partnerId"
              :is-rcard="isrcard"
            />
          </div>
          <div class="servicesChoice" v-if="selectedOffer">
            <h2 class="title text-center">{{ $t('orders.personalize-services') }}</h2>
            <ServicesBlock
              v-if="selectedOffer"
              :key="selectedOffer.label"
              :services="offerServices"
              :data-params-needed="isDataParamsError"
              vertical
              @datachange="onServiceChange"
            />
          </div>
        </template>
      </LoaderContainer>
    </div>
  </CreateOrderStepContainer>
</template>

<script>
import CreateOrderStepContainer from '@/views/GetSim/CreateOrder/CreateOrderStepContainer.vue';

import UiToggle from '@/components/ui/UiToggle';
import LoaderContainer from '@/components/LoaderContainer';
import { fetchOrderState } from '@/api/partners';
import { fetchOffers } from '@/api/offers';
import { getMarketingOfferServices } from '@/components/Services/utils.js';

import OffersChoice from '@/views/GetSim/CreateOrder/Services/OffersChoice.vue';
import ServicesBlock from '@/components/Services/ServicesBlock.vue';

export default {
  components: {
    CreateOrderStepContainer,
    UiToggle,
    LoaderContainer,
    OffersChoice,
    ServicesBlock,
  },

  props: {
    synthesis: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      offerServices: undefined,
      chosenServices: undefined,
      selectedOffer: null,
      activation: false,
      preActivationValue: false,
      partnerId: undefined,
      offers: [],
      isLoadingOffers: false,
      servicesChoice: undefined,
      isDataParamsError: false,
    };
  },
  computed: {
    isrcard() {
      const rCardValues = ['BACKUP', 'FULL_BACKUP'];
      const currentCategory = this.$loGet(this.synthesis, 'stepProduct.simCard.family');
      const inrCardValues = rCardValues.indexOf(currentCategory) !== -1;
      return inrCardValues;
    },
    preActivation: {
      get() {
        return this.activation || this.preActivationValue;
      },
      set(newValue) {
        this.preActivationValue = newValue;
      },
    },
  },

  async mounted() {
    this.partnerId = this.$loGet(this.synthesis, 'stepClient.partner.id');
    // this.activation = get(this.synthesis, 'services.selection.activation', false);
    // this.preActivation = get(this.synthesis, 'services.selection.preActivation', false);

    await this.initToggles();
    await this.initOffers();
  },

  watch: {
    selectedOffer(newOffer, oldOffer) {
      if (newOffer && oldOffer && newOffer.id !== oldOffer.id) {
        this.chosenServices = undefined;
      }
      this.offerServices = this.getOfferServices(this.selectedOffer);
    },
  },

  methods: {
    canGoToNextStep() {
      this.isDataParamsError =
        this.servicesChoice &&
        this.servicesChoice.dataService &&
        this.servicesChoice.dataService.checked &&
        this.servicesChoice.dataService.parameters &&
        this.servicesChoice.dataService.parameters.filter((p) => p.selected).length === 0;

      if (this.activation) {
        if (!this.selectedOffer) {
          return false;
        } else {
          return !this.isDataParamsError;
        }
      }
      return true;
    },
    getOfferServices(selectedOffer) {
      const offerServices = getMarketingOfferServices(selectedOffer.initialOffer);

      if (this.chosenServices) {
        return offerServices.map((os) => this.chosenServices.find((s) => s.code === os.code));
      }

      return offerServices;
    },
    onServiceChange(services) {
      this.servicesChoice = services;
    },

    async initToggles() {
      const stateOrder = await fetchOrderState(this.partnerId);
      this.activation = stateOrder.orderActivationMandatory;
      this.preActivation = stateOrder.orderPreactivationMandatory;
    },
    async initOffers() {
      const billingAccountCode = this.$loGet(this.synthesis, 'stepClient.billingAccount.data.code');

      this.isLoadingOffers = true;
      const data = await fetchOffers('', [{ id: this.partnerId }], {
        page: 0,
        limit: 99,
        disabledOffer: true,
        customerAccountCode: billingAccountCode,
      });
      this.isLoadingOffers = false;

      this.offers = data.map((o) => {
        return {
          ...o,
          label: o.workflowDescription,
          value: o.code,
        };
      });
    },
    getSynthesis() {
      return {
        serviceStep: {
          preActivation: this.preActivation,
          activation: this.activation,
          selectedOffer: this.selectedOffer,
          servicesChoice: this.servicesChoice,
        },
      };
    },
    done() {
      if (this.canGoToNextStep) {
        this.$emit('done', this.getSynthesis());
      }
    },
    prev() {
      this.$emit('prev', this.getSynthesis());
    },
  },
};
</script>

<style lang="scss" scoped>
.toggles-container {
  flex-grow: 1;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;

  .toggle {
    flex: 1 100%;
    flex-grow: 1;
    padding-right: 5px;
  }
}

.title {
  background-color: transparent;
  color: $dark-gray;
  font-weight: 300;
  font-size: 2rem;
  margin: 1rem 0 1rem;
  padding: 0;
  text-align: center;
}

.form-offers {
  color: $dark-gray;

  &.disabled {
    color: $gray-680;
  }
}

select {
  height: 56px;
}

.select-container {
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  flex-grow: 1;

  p {
    color: $dark-gray;
    font-size: 14px;
    margin: 0;
  }

  select {
    align-self: flex-end;
    background: none;
    background-color: transparent;
    font-size: 14px;
    max-height: 50px;
    max-width: 180px;
    overflow-y: auto;
  }
}
</style>
