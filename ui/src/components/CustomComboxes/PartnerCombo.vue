<template>
  <UiApiAutocomplete
    :api-method="contextPartners && contextPartners.length ? undefined : searchParty"
    :items="contextPartners"
    v-model="selectedValue"
    display-results-while-empty
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

  props: {
    value: Object,
    includeMailingLists: Boolean,
  },
  computed: {
    ...mapState('userContext', [' contextPartnersType', 'contextPartners']),

    selectedValue: {
      get() {
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
