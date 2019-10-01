<template>
  <MultiSelectSearch
    :items="basicServices"
    :disabled-items="disabledServices"
    :default-selected-items.sync="selectedServices"
  />
</template>

<script>
// import get from 'lodash.get';
import MultiSelectSearch from '@/components/ui/MultiSelectSearch';

import flatten from 'lodash.flatten';

export default {
  props: {
    offer: Object,
    selectedItems: Array,
    ignoredItems: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    MultiSelectSearch,
  },

  mounted() {
    this.initServices();
  },

  data() {
    return {
      disabledServices: [],
      basicServices: [],
      defaultBasicServices: [
        {
          id: 0,
          name: 'VOIX_ENTRANTE',
          code: '2175',
          editable: false,
          data: undefined,
        },
        {
          id: 1,
          name: 'VOIX_SORTANTE',
          code: '2023',
          editable: false,
          data: undefined,
        },
        {
          id: 2,
          name: 'SMS_ENTRANT',
          code: '2171',
          editable: false,
          data: undefined,
        },
        {
          id: 3,
          name: 'SMS_SORTANT',
          code: '2174',
          editable: false,
          data: undefined,
        },
        {
          id: 4,
          name: 'NUMERO_DATA_CSD',
          code: '2188',
          editable: false,
          data: undefined,
        },
        {
          id: 5,
          name: 'DATA_CSD_ENTRANTE',
          code: '2172',
          editable: false,
          data: undefined,
        },
        {
          id: 6,
          name: 'DATA_CSD_SORTANTE',
          code: '2173',
          editable: false,
          data: undefined,
        },
        {
          id: 7,
          name: 'ROAMING',
          code: '77',
          editable: false,
          data: undefined,
        },
      ],
    };
  },

  methods: {
    initServices() {
      if (!this.offer) return;
      this.basicServices = this.defaultBasicServices.map(s => {
        const serviceData = this.getServiceData(s.code);
        s.label = this.$t('services.' + s.name);
        if (serviceData) {
          const isEditable = serviceData.partyAccess || false;
          return {
            ...s,
            editable: isEditable,
            data: { ...serviceData },
          };
        }

        return s;
      });
      this.disabledServices = [
        ...this.basicServices.filter(c => !c.editable),
        ...this.ignoredItems,
      ];
    },
    getServiceData(dependencyCode) {
      const groupServices = this.offer.data.initialOffer.nonSystemServiceGroupList.map(
        g => g.standardAndSemiGlobalCatalogServiceGroups
      );
      const result = flatten(groupServices).find(s => s.catalogService.code === dependencyCode);
      return result;
    },
  },

  watch: {
    offer() {
      this.initServices();
    },
    ignoredItems() {
      this.initServices();
    },
  },

  computed: {
    selectedServices: {
      get() {
        return this.selectedItems;
      },
      set(newValues) {
        this.$emit('update:selectedItems', newValues);
      },
    },
  },
};
</script>

<style lang="scss" scoped></style>
