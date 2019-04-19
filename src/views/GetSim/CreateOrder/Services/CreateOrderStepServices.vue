<template>
  <div class="get-sim-services">
    <div class="panel-vertical-container">
      <div class="main-content step-content">
        <div>
          <h2 class="title">{{ $t('orders.choose-services') }}</h2>
        </div>
        <div class="toggles-container">
          <UiToggle label="Préactivation" v-model="preActivation" :editable="!activation" />
          <UiToggle label="Activation" v-model="activation" />
        </div>
        <div v-if="activation && offers && offers.length">
          <div class=" ">
            <OffersChoice v-model="selectedOffer" :offers="offers" :partner-id="partnerId" />
          </div>

          <template v-if="selectedOfferData">
            <div>
              <h2 class="title">{{ $t('orders.personalize-services') }}</h2>
            </div>

            <div class="services-container">
              <div
                :key="service.id"
                v-for="service in basicServices"
                class="single-service mt-3 mb-3"
              >
                <UiToggle
                  :label="$t('services.' + service.name)"
                  :editable="service.editable"
                  v-model="service.checked"
                />
              </div>
            </div>

            <div v-if="dataService" class="services-container mt-3">
              <div class="single-service">
                <UiToggle
                  :label="$t('services.DATA')"
                  :editable="dataService.editable"
                  v-model="dataService.checked"
                />
              </div>
              <div
                v-if="dataService && dataService.apns && dataService.apns.length"
                class="single-service"
              >
                <div class="apn-container">
                  <span>Apn:</span>
                  <MultiChoiceList :items="dataService.apns" @change="toggleApn" />
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
      <div class="footer-back">
        <div class="row">
          <div class="col-md-12 mt-5">
            <UiButton
              variant="round-button"
              @click="prev"
              class="float-left ic-Arrow-Previous-Icon"
            />
            <UiButton
              variant="round-button"
              :disabled="activation && !selectedOffer"
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
import OffersChoice from './OffersChoice';
import MultiChoiceList from '@/components/ui/MultiChoiceList';

import get from 'lodash.get';
import { fetchOffersForPartnerId } from '@/api/offers';

export default {
  name: 'CreateOrderStepServices',
  components: {
    UiButton,
    UiToggle,
    // UiSelect,
    OffersChoice,
    MultiChoiceList,
  },
  props: {
    synthesis: {
      type: Object,
      required: true,
    },
  },

  computed: {
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

    const offers = await fetchOffersForPartnerId(this.partnerId);
    this.offers = offers.map(o => {
      return {
        ...o,
        label: o.workflowDescription,
        value: o.code,
      };
    });

    const selectedOffer = get(this.synthesis, 'services.value.selectedOffer');

    if (selectedOffer) {
      this.selectedOffer = selectedOffer;
    }
    // this.preFillServices();
  },
  watch: {
    selectedOffer(selectedValue) {
      this.selectedOfferData = this.offers.find(o => o.value === selectedValue);
      this.initServicesForOffer();
      this.initDataService();
      this.servicesInitialized = true;
    },
  },
  methods: {
    done() {
      this.$emit('done', this.assembleSynthesis());
    },
    prev() {
      this.$emit('prev', this.assembleSynthesis());
    },
    preFillServices() {
      const basicServices = get(this.synthesis, 'services.selection.basicServices');
      const dataService = get(this.synthesis, 'services.selection.dataService');
      if (basicServices) {
        this.basicServices = basicServices;
      }
      if (dataService) {
        this.dataService = dataService;
      }
    },
    /**
     * Il faut scanner tout les éléments de nonSystemServiceGroupList > standardAndSemiGlobalCatalogServiceGroups > catalogService pour extraire les données du service
     */
    getServiceData(dependencyCode) {
      return this.selectedOfferData.initialOffer.nonSystemServiceGroupList
        .map(g => g.standardAndSemiGlobalCatalogServiceGroups)
        .flat()
        .find(s => s.catalogService.code === dependencyCode);
    },
    initServicesForOffer() {
      const initServices = () => {
        this.basicServices = this.defaultBasicServices.map(s => {
          const serviceData = this.getServiceData(s.code);
          if (serviceData) {
            const isEditable = serviceData.partyAccess || false;
            const isChecked = serviceData.activatedByDefault || false;
            return {
              ...s,
              checked: isChecked,
              editable: isEditable,
              data: { ...serviceData },
            };
          }

          return s;
        });
      };

      if (!this.servicesInitialized) {
        const selectedBasicServices = get(this.synthesis, 'services.selection.basicServices');
        if (selectedBasicServices) {
          this.basicServices = selectedBasicServices;
        } else {
          initServices();
        }
      } else {
        initServices();
      }
    },
    initDataService() {
      const initService = () => {
        const data = this.getServiceData('878');
        if (!data) return;
        let serviceParameters = [];
        if (data && data.catalogServiceParameters) {
          serviceParameters = data.catalogServiceParameters;
        }

        const containTestApn = serviceParameters.find(
          s => s.defaultValue.indexOf('testrnis.fr') !== -1
        );
        const isEditable = data.partyAccess || false;
        const isChecked = data && data.activatedByDefault && !containTestApn;

        const dataService = {
          checked: isChecked,
          editable: isEditable,
          apns: [],
          data: { ...data },
        };

        const apns = serviceParameters.map(p => {
          return {
            label: p.defaultValue,
            selectable: p.partyAccess,
            selected: p.setOnActivation,
            id: p.id,
          };
        });

        dataService.apns = apns;

        this.dataService = dataService;
      };

      this.dataService = undefined;

      if (!this.servicesInitialized) {
        const selectedDataService = get(this.synthesis, 'services.selection.dataService');
        if (selectedDataService) {
          this.dataService = selectedDataService;
        } else {
          initService();
        }
      } else {
        initService();
      }
    },
    toggleApn(apn) {
      const apns = this.dataService.apns.map(a => {
        if (a.selectable && a.label === apn.label) {
          a.selected = !a.selected;
        }
        return a;
      });

      this.dataService = { ...this.dataService, apns };
    },
    assembleSynthesis() {
      return {
        services: {
          label: 'common.services',
          value: {
            id: 'common.services',
            content: [
              `Offre:  ${this.selectedOffer}`,
              `Activation: ${this.activation ? 'Oui' : 'Non'}`,
              `Préactivation: ${this.preActivation ? 'Oui' : 'Non'}`,
            ],
            activation: this.activation,
            preActivation: this.preActivation,
            selectedOffer: this.selectedOffer,
          },
          selection: {
            activation: !!this.activation,
            preActivation: !!this.preActivation,
            basicServices: this.basicServices,
            dataService: this.dataService,
            selectedOfferData: this.selectedOfferData,
          },
        },
      };
    },
  },
  data() {
    return {
      selectedOffer: null,
      activation: false,
      preActivationValue: false,
      partnerId: undefined,
      offers: [],
      selectedOfferData: undefined,

      dataService: undefined,
      servicesInitialized: false,
      basicServices: [],
      defaultBasicServices: [
        {
          id: 0,
          name: 'VOIX_ENTRANTE',
          code: '2175',
          checked: false,
          editable: false,
          data: undefined,
        },
        {
          id: 1,
          name: 'VOIX_SORTANTE',
          code: '2023',
          checked: false,
          editable: false,
          data: undefined,
        },
        {
          id: 2,
          name: 'SMS_ENTRANT',
          code: '2171',
          checked: false,
          editable: false,
          data: undefined,
        },
        {
          id: 3,
          name: 'SMS_SORTANT',
          code: '2174',
          checked: false,
          editable: false,
          data: undefined,
        },
        {
          id: 4,
          name: 'NUMERO_DATA_CSD',
          code: '2188',
          checked: false,
          editable: false,
          data: undefined,
        },
        {
          id: 5,
          name: 'DATA_CSD_ENTRANTE',
          code: '2172',
          checked: false,
          editable: false,
          data: undefined,
        },
        {
          id: 6,
          name: 'DATA_CSD_SORTANTE',
          code: '2173',
          checked: false,
          editable: false,
          data: undefined,
        },
        {
          id: 7,
          name: 'ROAMING',
          code: '77',
          checked: false,
          editable: false,
          data: undefined,
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
@media screen and (max-width: 1366px) {
  .services-container {
    width: 100% !important;
  }
}

@media screen and (max-height: 768px) {
  .get-sim-services {
    padding-left: 5px !important;
    padding-right: 5px !important;
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
  padding-left: 55px;
  padding-right: 55px;
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
}

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

.apn-container {
  display: flex;
  flex-direction: row;
  span {
    flex-grow: 0;
  }
  .card {
    max-width: 210px;
    flex-grow: 1;
    margin-left: 10px;
  }
}

@media screen and (max-height: 768px) {
  .panel-vertical-container {
    div.step-content {
      max-height: 75vh;
      min-height: 75vh !important;
    }
  }
}
@media screen and (min-height: 769px) {
  .panel-vertical-container {
    div.step-content {
      min-height: 75vh;
      max-height: 87vh;
    }
  }
}
</style>
