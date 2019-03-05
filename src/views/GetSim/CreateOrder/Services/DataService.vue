<template>
  <div class="services-container mt-3">
    <div class="single-service">
      <UiToggle :label="$t('services.DATA')" :editable="isEditable" :checked="isChecked" />
    </div>
    <div v-if="apns && apns.length" class="single-service">
      <div class="apn-container">
        <span>Apn:</span>
        <MultiChoiceList :items="apns" @change="toggleApn" />
      </div>
    </div>
  </div>
</template>

<script>
import UiToggle from '@/components/ui/UiToggle';
import MultiChoiceList from '@/components/ui/MultiChoiceList';

export default {
  components: {
    UiToggle,
    MultiChoiceList,
  },
  props: {
    offer: {
      type: Object,
    },
  },
  data() {
    return {
      apns: [],
      DATA_SERVICE_DEINTIFIER: '878',
    };
  },
  mounted() {
    this.apns = this.serviceParameters.map(p => {
      return {
        label: p.defaultValue,
        selectable: p.partyAccess,
        selected: p.setOnActivation,
      };
    });
  },
  watch: {
    offer() {
      this.apns = this.serviceParameters.map(p => {
        return {
          label: p.defaultValue,
          selectable: p.partyAccess,
          selected: p.setOnActivation,
        };
      });
    },
  },
  methods: {
    toggleApn(apn) {
      this.apns = this.apns.map(a => {
        if (a.selectable && a.label === apn.label) {
          a.selected = !a.selected;
        }
        return a;
      });
    },
  },
  computed: {
    isEditable() {
      return this.serviceData ? this.serviceData.partyAccess : false;
    },
    isChecked() {
      const containTestApn = this.serviceParameters.find(
        s => s.defaultValue.indexOf('testrnis.fr') !== -1
      );
      return this.serviceData && this.serviceData.activatedByDefault && !containTestApn;
    },

    /**
     * Il faut scanner tout les éléments de nonSystemServiceGroupList > standardAndSemiGlobalCatalogServiceGroups > catalogService pour extraire les données du service
     */
    serviceData() {
      return this.offer.initialOffer.nonSystemServiceGroupList
        .map(g => g.standardAndSemiGlobalCatalogServiceGroups)
        .flat()
        .find(s => s.catalogService.code === this.DATA_SERVICE_DEINTIFIER);
    },
    serviceParameters() {
      if (!this.serviceData || !this.serviceData.catalogServiceParameters) {
        return [];
      }
      return this.serviceData.catalogServiceParameters;
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
