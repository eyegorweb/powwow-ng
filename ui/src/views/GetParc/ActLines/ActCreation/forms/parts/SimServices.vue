<template>
  <div>
    <div class="services-container">
      <div :key="service.id" v-for="service in basicServices" class="single-service mt-3 mb-3">
        <UiToggle
          :label="$t('services.' + service.name)"
          :editable="service.editable"
          v-model="service.checked"
        />
      </div>
    </div>
    <div v-if="dataService" class="services-container">
      <div class="single-service mt-3 mb-3">
        <UiToggle
          :label="$t('services.DATA')"
          :editable="dataService.editable"
          v-model="dataService.checked"
        />
      </div>

      <div
        v-if="dataService && dataService.apns && dataService.apns.length"
        class="single-service mt-3 mb-3"
      >
        <span>Apn:</span>
        <MultiChoiceList :items="dataService.apns" @change="toggleApn" />
      </div>
    </div>
  </div>
</template>

<script>
// Deprecated
import UiToggle from '@/components/ui/UiToggle';
import MultiChoiceList from '@/components/ui/MultiChoiceList';
import flatten from 'lodash.flatten';
import get from 'lodash.get';

export default {
  components: {
    UiToggle,
    MultiChoiceList,
  },

  mounted() {
    this.initServicesForOffer();
    this.initDataService();
  },

  watch: {
    offer() {
      this.initServicesForOffer();
      this.initDataService();
    },
  },

  methods: {
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
        if (this.selectedBasicServices) {
          this.basicServices = this.selectedBasicServices;
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

    /**
     * Il faut scanner tout les éléments de nonSystemServiceGroupList > standardAndSemiGlobalCatalogServiceGroups > catalogService pour extraire les données du service
     */
    getServiceData(dependencyCode) {
      const groupServices = this.offer.initialOffer.nonSystemServiceGroupList.map(
        g => g.standardAndSemiGlobalCatalogServiceGroups
      );
      const result = flatten(groupServices).find(s => s.catalogService.code === dependencyCode);
      return result;
    },
  },

  data() {
    return {
      dataService: undefined,
      selectedBasicServices: undefined,

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

  props: {
    offer: Object,
  },
};
</script>

<style lang="scss" scoped>
.services-container {
  display: flex;
  flex-wrap: wrap;
}
.single-service {
  padding-left: 2rem;
  padding-right: 2rem;
  flex-basis: 50%;
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
</style>
