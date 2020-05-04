<template>
  <UiApiAutocomplete :items="items" v-model="selectedValue" display-results-while-empty />
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
  data() {
    return {
      items: [],
    };
  },
  computed: {
    ...mapState('userContext', [' contextPartnersType']),

    selectedValue: {
      get() {
        if (this.value && this.items && this.items.length) {
          return this.items.find(i => i.id === this.value.id);
        }
        return undefined;
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
  async mounted() {
    const data = await fetchOffers('', this.partners, {
      page: 0,
      limit: 999,
      partnerType: this.contextPartnersType,
    });
    this.items = data.map(p => ({
      id: p.code,
      label: p.workflowDescription,
      meta: p,
    }));
  },
};
</script>

<style lang="scss" scoped></style>
