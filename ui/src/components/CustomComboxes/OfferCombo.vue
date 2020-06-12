<template>
  <div>
    <div v-if="isLoading" class="skeleton-line"></div>
    <UiApiAutocomplete
      v-else
      placeholder="Offre"
      :items="items"
      v-model="selectedValue"
      :disabled="disabled"
      display-results-while-empty
    />
  </div>
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
      isLoading: false,
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
      if (this.disabled) return;

      this.isLoading = true;
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
      this.isLoading = false;
    },
  },
  mounted() {
    this.refreshList();
  },
};
</script>

<style lang="scss" scoped></style>
