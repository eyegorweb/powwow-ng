<template>
  <UiApiAutocomplete :api-method="fetchApi" v-model="selectedValue" display-results-while-empty />
</template>

<script>
import UiApiAutocomplete from '@/components/ui/UiApiAutocomplete';
import { mapState } from 'vuex';
import { fetchOffers } from '@/api/offers';

export default {
  components: {
    UiApiAutocomplete,
  },

  props: {
    value: Object,
    partners: Array,
  },
  computed: {
    ...mapState('userContext', [' contextPartnersType']),

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
    async fetchApi(q, page = 0) {
      const data = await fetchOffers(q, this.partners, {
        page,
        limit: 99,
        partnerType: this.contextPartnersType,
      });
      return data.map(p => ({
        id: p.code,
        label: p.workflowDescription,
        meta: p,
      }));
    },
  },
};
</script>

<style lang="scss" scoped></style>
