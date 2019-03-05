<template>
  <div class="get-sim-services" :style="{ paddingLeft: 55 + 'px', paddingRight: 55 + 'px' }">
    <div class="panel-vertical-container">
      <div class="main-content">
        <div>
          <h2 class="title">{{ $t('orders.choose-services') }}</h2>
        </div>
        <div class="toggles-container">
          <UiToggle label="Préactivation" v-model="preActivation" />
          <UiToggle label="Activation" v-model="activation" />
        </div>
        <div v-if="activation">
          <div class="row justify-content-center">
            <OffersChoice v-model="selectedOffer" :offers="offers" :partner-id="partnerId" />
          </div>

          <template v-if="selectedOfferData">
            <div>
              <h2 class="title">{{ $t('orders.personalize-services') }}</h2>
            </div>

            <div class="services-container">
              <div :key="service.id" v-for="service in basicServices" class="single-service mt-3 mb-3">
                <BasicService :name="service.name" :dependency-code="service.code" :offer="selectedOfferData" />
              </div>
            </div>

            <DataService :offer="selectedOfferData" />

          </template>
        </div>
      </div>
      <div class="footer-bock">
        <div class="row">
          <div class="col-md-12 mt-5">
            <UiButton
              variant="round-button"
              @click="prev"
              class="float-left ic-Arrow-Previous-Icon"
            />
            <UiButton
              variant="round-button"
              @click="done"
              class="float-right ic-Arrow-Next-Icon"
            />
          </div>
        </div>
      </div>
    </div>


  </div>
</template>

<script>
import UiButton from '@/components/ui/Button';
import UiToggle from '@/components/ui/UiToggle';
// import UiSelect from '@/components/ui/UiSelect';
import OffersChoice from './OffersChoice';
import BasicService from './BasicService';
import DataService from './DataService';

import get from 'lodash.get';
import { fetchOffersForPartnerId } from '@/api/offers';

export default {
  name: 'CreateOrderStepServices',
  components: {
    UiButton,
    UiToggle,
    // UiSelect,
    OffersChoice,
    BasicService,
    DataService,
  },
  props: {
    apn: {
      type: Array,
      required: true,
    },
    synthesis: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      selectedOffer: null,
      selectedApn: this.apn[0],
      activation: false,
      preActivation: false,
      partnerId: undefined,
      offers: [],
      selectedOfferData: undefined,

      basicServices: [
        {
          id: 0,
          name: 'VOIX_ENTRANTE',
          code: '2175',
        },
        {
          id: 1,
          name: 'VOIX_SORTANTE',
          code: '2023',
        },
        {
          id: 2,
          name: 'SMS_ENTRANT',
          code: '2171',
        },
        {
          id: 3,
          name: 'SMS_SORTANT',
          code: '2174',
        },
        {
          id: 4,
          name: 'NUMERO_DATA_CSD',
          code: '2188',
        },
        {
          id: 5,
          name: 'DATA_CSD_ENTRANTE',
          code: '2172',
        },
        {
          id: 6,
          name: 'DATA_CSD_SORTANTE',
          code: '2173',
        },
        {
          id: 7,
          name: 'ROAMING',
          code: '77',
        },
      ],
    };
  },
  async created() {
    this.partnerId = get(this.synthesis, 'billingAccount.selection.partner.id');
    this.activation = get(this.synthesis, 'services.selection.activation', false);
    this.preActivation = get(this.synthesis, 'services.selection.preActivation', false);

    const offers = await fetchOffersForPartnerId(this.partnerId);
    this.offers = offers.map(o => {
      return {
        ...o,
        label: o.workflowDescription,
        value: o.code,
      };
    });
  },
  watch: {
    selectedOffer(selectedValue) {
      this.selectedOfferData = this.offers.find(o => o.value === selectedValue);
    },
  },
  methods: {
    done() {
      this.$emit('done', this.assembleSynthesis());
    },
    prev() {
      this.$emit('prev', this.assembleSynthesis());
    },
    assembleSynthesis() {
      return {
        services: {
          label: 'common.services',
          value: {
            id: 'comon.services',
            content: [
              `Activation: ${this.activation ? 'Oui' : 'Non'}`,
              `Préactivation: ${this.preActivation ? 'Oui' : 'Non'}`,
            ],
            activation: this.activation,
            preActivation: this.preActivation,
          },
          selection: {
            activation: !!this.activation,
            preActivation: !!this.preActivation,
          },
        },
      };
    },
  },
};
</script>

<style lang="scss" scoped>
@media screen and (max-width: 1366px) {
  .services-container {
    width: 100% !important;
  }
}

.services-container {
  display: flex;
  flex-wrap: wrap;
  width: 80%;
  margin: auto;
  .single-service {
    flex-basis: 50%;
  }
}
.get-sim-services {
  .title {
    background-color: transparent;
    color: $dark-gray;
    font-weight: 300;
    font-size: 2rem;
    margin: 50px 0 30px;
    padding: 0;
    text-align: center;
  }

  .toggles-container {
    flex-grow: 1;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 24px;

    .toggle {
      flex-grow: 1;
    }
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
    max-width: 270px;
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
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
}
</style>
