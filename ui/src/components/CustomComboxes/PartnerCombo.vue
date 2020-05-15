<template>
  <UiApiAutocomplete
    placeholder="Partenaire"
    :api-method="!localItems ? searchParty : undefined"
    :items="localItems"
    v-model="selectedValue"
    display-results-while-empty
    :disabled="disabled"
  />
</template>

<script>
import UiApiAutocomplete from '@/components/ui/UiApiAutocomplete';
import { mapState } from 'vuex';
import { fetchpartners } from '@/api/partners';

export default {
  components: {
    UiApiAutocomplete,
  },

  data() {
    return {
      offlineItems: [],
    };
  },

  props: {
    value: Object,
    includeMailingLists: Boolean,
    offline: Boolean,
    disabled: Boolean,
  },

  async mounted() {
    if (this.offline) {
      const data = await fetchpartners('', {
        page: 0,
        limit: 999,
        partnerType: this.contextPartnersType,
        includeMailingLists: this.includeMailingLists,
      });
      this.offlineItems = data.map(p => ({
        id: p.id,
        label: p.name,
        data: p,
      }));
    }
  },
  computed: {
    ...mapState('userContext', [' contextPartnersType', 'contextPartners']),

    localItems() {
      if (this.contextPartners && this.contextPartners.length) {
        return this.contextPartners;
      }

      if (this.offline) {
        return this.offlineItems;
      }

      return undefined;
    },

    selectedValue: {
      get() {
        if (this.offline) {
          if (this.value && this.value.id && this.localItems && this.localItems.length) {
            return this.localItems.find(i => i.id === this.value.id);
          }
        }

        return this.value;
      },
      set(value) {
        if (value && value.label === '') {
          this.$emit('update:value', undefined);
          return;
        }
        this.$emit('update:value', value);
      },
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
        partnerType: this.contextPartnersType,
        includeMailingLists: this.includeMailingLists,
      });
      return data.map(p => ({
        id: p.id,
        label: p.name,
        data: p,
      }));
    },
  },
};
</script>

<style lang="scss" scoped></style>
