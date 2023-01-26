<template>
  <CreateOrderStepContainer @done="done" @prev="prev" :can-go-to-next-step="canGoNext()">
    <div class="servicesStep">
      <div class="activationChoice">
        <h3 class="font-weight-light text-center mt-4 mb-4">{{ $t('orders.choose-services') }}</h3>
        <div class="toggles-container">
          <UiToggle
            :label="$t('col.preActivationAsked')"
            v-model="preActivation"
            :editable="canEditPreactivation"
            :no-click="activation"
          />
          <UiToggle
            :label="$t('col.activationAsked')"
            v-model="activation"
            disabled
            :editable="canEditActivation"
          />
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
              :offer="selectedOffer"
              :data-params-needed="isDataParamsError"
              :initial-services="initialServices"
              vertical
              @servicechange="onServiceChange"
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
import CreateOrderStepContainer from '../CreateOrderStepContainer';
import LoaderContainer from '@/components/LoaderContainer';

import { fetchOrderState } from '@/api/partners';
import { fetchOffers } from '@/api/offers';
import { getMarketingOfferServices } from '@/components/Services/utils.js';
import { mapGetters, mapMutations } from 'vuex';

import cloneDeep from 'lodash.clonedeep';

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
    selectedOffer(selectedOffer) {
      if (selectedOffer && selectedOffer.initialOffer) {
        this.chosenServices = undefined;
        this.offerServices = this.getOfferServices(selectedOffer);
        this.initialServices = cloneDeep(this.offerServices);
      }
    },
  },

  computed: {
    ...mapGetters(['userIsBO']),

    canEditPreactivation() {
      if (this.orderPreactivationMandatory) return false;

      return !this.activation;
    },
    canEditActivation() {
      if (this.orderActivationMandatory) return false;
      return true;
    },
    isrcard() {
      const rCardValues = ['BACKUP', 'FULL_BACKUP'];
      const currentCategory = this.$loGet(
        this.synthesis,
        'product.selection.product.simCard.family'
      );
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
    changedServices() {
      if (!this.offerServices) return [];
      return this.offerServices.filter((s) => {
        const initialService = this.initialServices.find((os) => os.code === s.code);
        return initialService.checked !== s.checked;
      });
    },
    // Services activés automatiquement
    listAutoServiceMandatory() {
      if (!this.changedServices) return [];
      return this.changedServices
        .filter((s) => s.checked && !s.isClicked)
        .map((s) => s.labelService);
    },
    // Services désactivés automatiquement
    listAutoServiceIncompatible() {
      if (!this.changedServices) return [];
      return this.changedServices
        .filter((s) => !s.checked && !s.isClicked)
        .map((s) => s.labelService);
    },
    warningMessage() {
      let list = '',
        newLine = '';
      let message = '';
      if (this.listAutoServiceMandatory.length > 0) {
        list += `${this.$t(
          'services.listAutoServiceMandatory'
        )}: ${this.listAutoServiceMandatory.map((s) => s).join(',')}`;
      }
      if (this.listAutoServiceIncompatible.length > 0) {
        if (this.listAutoServiceMandatory.length) {
          newLine = '<br />';
        }
        list += `${newLine}${this.$t(
          'services.listAutoServiceIncompatible'
        )}: ${this.listAutoServiceIncompatible.map((s) => s).join(',')}`;
      }
      if (!list) {
        message = `${this.$t('getparc.actCreation.preactivateActivate.confirmAction')}`;
      } else {
        message = `${this.$t('getparc.actCreation.preactivateActivate.confirmationWarning', {
          list,
        })}`;
      }
      return message;
    },
  },
  async mounted() {
    this.partnerId = this.$loGet(this.synthesis, 'billingAccount.selection.partner.id');
    const billingAccountCode = this.$loGet(
      this.synthesis,
      'billingAccount.selection.billingAccount.code'
    );

    const stateOrder = await fetchOrderState(this.partnerId);

    if (this.$loGet(this.synthesis, 'services.selection')) {
      this.activation = this.$loGet(this.synthesis, 'services.selection.activation', false);
      this.preActivation = this.$loGet(this.synthesis, 'services.selection.preActivation', false);
    } else {
      this.activation = stateOrder.orderActivationMandatory;
      this.preActivation = stateOrder.orderPreactivationMandatory;
    }

    this.orderActivationMandatory = stateOrder.orderActivationMandatory;
    this.orderPreactivationMandatory = stateOrder.orderPreactivationMandatory;

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

    const selectedOffer = this.offers.find(
      (o) => o.initialOffer.code === this.$loGet(this.synthesis, 'services.value.offerCode')
    );

    const previouslyChosenServices = this.$loGet(this.synthesis, 'services.value.servicesChoice');
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
    ...mapMutations(['confirmAction']),
    getOfferServices(selectedOffer) {
      const offerServices = getMarketingOfferServices(selectedOffer.initialOffer);

      if (this.chosenServices) {
        return offerServices.map((os) => this.chosenServices.find((s) => s.code === os.code));
      }

      return offerServices;
    },
    canGoNext() {
      let isDataParamsError = false;

      isDataParamsError =
        !this.servicesChoice ||
        (this.servicesChoice &&
          this.servicesChoice.dataService &&
          this.servicesChoice.dataService.checked &&
          this.servicesChoice.dataService.parameters &&
          this.servicesChoice.dataService.parameters.filter((p) => p.selected).length === 0);

      this.isDataParamsError = isDataParamsError;

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
        if (this.activation && this.changedServices.length > 0) {
          this.$emit('done', {
            needToConfirm: this.changedServices,
            message: this.warningMessage,
            ...this.assembleSynthesis(),
          });
        } else {
          this.$emit('done', this.assembleSynthesis());
        }
      }
    },
    prev() {
      this.$emit('prev', this.assembleSynthesis());
    },

    onServiceChange(services) {
      this.servicesChoice = services;
      if (services.dataService) {
        this.offerServices = [...services.services, services.dataService];
      } else {
        this.offerServices = [...services.services];
      }
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
              `${this.$t('col.offer')}:  ${this.activation ? offerCode : ''}`,
              `${this.$t('col.activationAsked')}: ${
                this.activation ? this.$t('common.YES') : this.$t('common.NO')
              }`,
              `${this.$t('col.preActivationAsked')}: ${
                this.preActivation ? this.$t('common.YES') : this.$t('common.NO')
              }`,
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
      orderActivationMandatory: false,
      orderPreactivationMandatory: false,
      offerServices: undefined,
      initialServices: undefined,
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
