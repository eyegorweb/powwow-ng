<template>
  <div>
    <div v-if="isLoading" class="skeleton-line"></div>
    <UiApiAutocomplete
      v-else
      placeholder="Offre"
      :items="items"
      v-model="selectedLocalValue"
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
      lastPartners: [],
      selectedLocalValue: undefined,
    };
  },
  computed: {
    ...mapState('userContext', [' contextPartnersType']),

    selectedValue: {
      get() {
        if (this.value && this.items && this.items.length) {
          const found = this.items.find(i => i.id === this.value.id);

          if (found) {
            return found;
          }

          return this.value;
        }
        return undefined;
      },
      set(value) {
        this.$emit('update:value', value);
      },
    },
  },
  watch: {
    async partners(partners) {
      if (this.havePartnersChanged(partners)) {
        this.lastPartners = partners;
        await this.refreshList();
      }
    },
    value(newValue) {
      if (newValue && this.items && this.items.length) {
        this.selectedLocalValue = this.items.find(i => i.id === newValue.id);
      }
      if (!newValue) {
        this.selectedLocalValue = undefined;
      }
    },
    selectedLocalValue(value) {
      if (value && value.label === '') {
        this.$emit('update:value', undefined);
        return;
      }
      if (value && value.id) {
        this.$emit('update:value', value);
      }
    },
  },
  methods: {
    havePartnersChanged(partners) {
      if (!partners) return false;
      const lastPartners = this.lastPartners || [];
      const diff = partners.reduce((all, p) => {
        if (p.id) {
          const found = lastPartners.find(f => f.id === p.id);
          if (!found) {
            all.push(found);
          }
        }
        return all;
      }, []);
      return !!diff.length;
    },
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
  async mounted() {
    this.lastPartners = this.partners;
    await this.refreshList();
    if (this.value && this.items && this.items.length) {
      this.selectedLocalValue = this.items.find(i => i.id === this.value.id);
    }
  },
};
</script>

<style lang="scss" scoped></style>
