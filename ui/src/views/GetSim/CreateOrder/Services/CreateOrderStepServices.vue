<template>
  <CreateOrderStepContainer @done="done" @prev="prev" :can-go-to-next-step="canGoNext()">
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
              @change="onServiceChange"
            />
          </div>
        </template>
      </LoaderContainer>
    </div>
  </CreateOrderStepContainer>
</template>

<script>
import UiToggle from '@/components/ui/UiToggle';
import OffersChoice from './OffersChoice';
import ServicesBlock from '@/components/Services/ServicesBlock.vue';
import LoaderContainer from '@/components/LoaderContainer';

import get from 'lodash.get';
import { fetchOffersForPartnerId } from '@/api/offers';

import CreateOrderStepContainer from '../CreateOrderStepContainer';

import { getMarketingOfferServices } from '@/components/Services/utils.js';

export default {
  name: 'CreateOrderStepServices',
  components: {
    UiToggle,
    OffersChoice,
    ServicesBlock,
    CreateOrderStepContainer,
    LoaderContainer,
  },
  props: {
    synthesis: {
      type: Object,
      required: true,
    },
  },

  watch: {
    selectedOffer(newOffer, oldOffer) {
      if (newOffer && oldOffer && newOffer.id !== oldOffer.id) {
        this.chosenServices = undefined;
      }
      this.offerServices = this.getOfferServices(this.selectedOffer);
    },
  },

  computed: {
    isrcard() {
      const rCardValues = ['RCARD', 'RCARD_INTER_MERE', 'RCARD_INTER_FILLE'];
      const currentCategory = get(this.synthesis, 'product.selection.product.simCard.category');
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
    this.partnerId = get(this.synthesis, 'billingAccount.selection.partner.id');
    this.activation = get(this.synthesis, 'services.selection.activation', false);
    this.preActivation = get(this.synthesis, 'services.selection.preActivation', false);

    this.isLoadingOffers = true;
    const offers = await fetchOffersForPartnerId(this.partnerId);
    this.isLoadingOffers = false;
    this.offers = offers.map(o => {
      return {
        ...o,
        label: o.workflowDescription,
        value: o.code,
      };
    });

    const selectedOffer = this.offers.find(
      o => o.initialOffer.code === get(this.synthesis, 'services.value.offerCode')
    );

    const previouslyChosenServices = get(this.synthesis, 'services.value.servicesChoice');
    if (previouslyChosenServices) {
      this.chosenServices = [
        ...previouslyChosenServices.services,
        previouslyChosenServices.dataService,
      ];
    }

    if (selectedOffer) {
      this.selectedOffer = selectedOffer;
      this.offerServices = this.getOfferServices(selectedOffer);
    }
  },
  methods: {
    getOfferServices(selectedOffer) {
      const offerServices = getMarketingOfferServices(selectedOffer.initialOffer);

      if (this.chosenServices) {
        return offerServices.map(os => this.chosenServices.find(s => s.code === os.code));
      }

      return offerServices;
    },
    canGoNext() {
      this.isDataParamsError =
        this.servicesChoice &&
        this.servicesChoice.dataService &&
        this.servicesChoice.dataService.checked &&
        this.servicesChoice.dataService.parameters &&
        this.servicesChoice.dataService.parameters.filter(p => p.selected).length === 0;

      if (this.activation) {
        if (!this.selectedOffer) {
          return false;
        } else {
          return !this.isDataParamsError;
        }
      }
      return true;
    },
    done() {
      if (this.canGoNext()) {
        this.$emit('done', this.assembleSynthesis());
      }
    },
    prev() {
      this.$emit('prev', this.assembleSynthesis());
    },

    onServiceChange(services) {
      this.servicesChoice = services;
    },

    assembleSynthesis() {
      let offerCode = '';

      if (this.selectedOffer) {
        offerCode = this.selectedOffer.initialOffer.description;
      }
      return {
        services: {
          label: 'common.services',
          value: {
            id: 'common.services',
            content: [
              `Offre:  ${this.activation ? offerCode : ''}`,
              `Activation: ${this.activation ? 'Oui' : 'Non'}`,
              `Préactivation: ${this.preActivation ? 'Oui' : 'Non'}`,
            ],
            offerCode,
            activation: this.activation,
            preActivation: this.preActivation,
            selectedOffer: this.selectedOffer,
            servicesChoice: this.servicesChoice,
          },
          selection: {
            activation: !!this.activation,
            preActivation: !!this.preActivation,
          },
        },
      };
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
