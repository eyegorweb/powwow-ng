<template>
  <UiApiAutocomplete
    :placeholder="$t('col.partner')"
    :api-method="!localItems ? searchParty : undefined"
    :items="localItems"
    v-model="selectedLocalValue"
    display-results-while-empty
    scroll-for-next
    :disabled="disabled"
    search-type="startsWith"
  />
</template>

<script>
import UiApiAutocomplete from '@/components/ui/UiApiAutocomplete';
import { mapState } from 'vuex';
import { fetchpartners } from '@/api/partners';

export default {
  name: 'PartnerCombo',
  components: {
    UiApiAutocomplete,
  },

  data() {
    return {
      offlineItems: [],
      selectedLocalValue: undefined,
    };
  },

  props: {
    value: Object,
    options: Array,
    includeMailingLists: Boolean,
    offline: Boolean,
    disabled: Boolean,
    esim: Boolean,
    partyTypes: {
      type: Array,
      required: false,
    },
    partnerFeature: String,
  },

  watch: {
    value(newValue) {
      if (this.offline) {
        if (newValue && newValue.id && this.localItems && this.localItems.length) {
          this.selectedLocalValue = this.localItems.find((i) => i.id === newValue.id);
        }
        if (!newValue) {
          this.selectedLocalValue = undefined;
        }
      } else {
        this.selectedLocalValue = newValue;
      }
    },
    selectedLocalValue(value) {
      if (!value) {
        this.$emit('update:value', undefined);
        return;
      }
      if (value && value instanceof Object && (value.label === '' || value.label === undefined)) {
        this.$emit('update:value', undefined);
        return;
      }
      if (value && value.id) {
        this.$emit('update:value', value);
      }
    },
  },

  async mounted() {
    if (this.offline) {
      if (this.options) {
        this.offlineItems = this.options;
      } else {
        const data = await fetchpartners('', {
          page: 0,
          limit: 999,
          partnerTypes: this.partnerTypesParam,
          includeMailingLists: this.includeMailingLists,
          esim: this.esim,
        });
        this.offlineItems = data;
      }

      this.offlineItems = this.offlineItems.map((p) => ({
        id: p.id,
        label: p.name,
        data: p,
      }));

      if (this.value && this.value.id && this.localItems && this.localItems.length) {
        this.selectedLocalValue = this.localItems.find((i) => i.id === this.value.id);
      }
    } else if (this.value) {
      this.selectedLocalValue = this.value;
    }
  },
  computed: {
    ...mapState('userContext', [' contextPartnersType', 'contextPartners']),

    partnerTypesParam() {
      let partnerTypesParam = [];

      if (this.partyTypes) {
        partnerTypesParam = this.partyTypes;
      } else if (this.contextPartnersType) {
        partnerTypesParam = [this.contextPartnersType];
      }

      return partnerTypesParam;
    },
    localItems() {
      if (this.contextPartners && this.contextPartners.length) {
        return this.contextPartners;
      }

      if (this.offline) {
        return this.offlineItems;
      }

      return undefined;
    },
  },
  methods: {
    async searchParty(q, page = 0) {
      if (this.contextPartners && this.contextPartners.length) {
        return undefined;
      }

      const data = await fetchpartners(q, {
        page,
        limit: 10,
        partnerTypes: this.partnerTypesParam,
        includeMailingLists: this.includeMailingLists,
        esim: this.esim,
        featureType: this.partnerFeature,
      });
      return data.map((p) => ({
        id: p.id,
        label: p.name,
        data: p,
      }));
    },
  },
};
</script>

<style lang="scss" scoped></style>
