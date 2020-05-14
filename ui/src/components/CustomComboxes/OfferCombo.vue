<template>
  <UiApiAutocomplete
    placeholder="Offre"
    :items="items"
    v-model="selectedValue"
    :disabled="disabled"
    display-results-while-empty
  />
</template>

<script>
import UiApiAutocomplete from '@/components/ui/UiApiAutocomplete';
import { mapState } from 'vuex';
import { fetchOffers } from '@/api/offers';
import uuid from 'uuid/v1';

export default {
  components: {
    UiApiAutocomplete,
  },

  props: {
    value: Object,
    partners: Array,
    disabled: Boolean,
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
  watch: {
    async partners() {
      await this.refreshList();
    },
  },
  methods: {
    async refreshList() {
      const data = await fetchOffers('', this.partners, {
        page: 0,
        limit: 999,
        partnerType: this.contextPartnersType,
      });
      this.items = data.map(p => ({
        key: uuid(),
        id: p.code,
        label: p.workflowDescription,
        meta: p,
      }));
    },
  },
  mounted() {
    this.refreshList();
  },
};
</script>

<style lang="scss" scoped></style>
