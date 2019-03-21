<template>
  <MultiSelectSearch
    :items="partners"
    :default-selected-items.sync="selectedPartners"
    @update:search="searchValueChanged"
    @scroll:limit="nextPage"
  />
</template>

<script>
import MultiSelectSearch from '@/components/ui/MultiSelectSearch';
import { fetchpartners } from '@/api/partners';

export default {
  components: {
    MultiSelectSearch,
  },
  props: {
    values: {
      type: Array,
    },
  },
  data() {
    return {
      lastSearchTerm: '',
      page: 0,
      partners: [],
      canGetNextPage: true,
    };
  },
  async mounted() {
    this.partners = await this.fetchFormattedPartnersForDatatable('', { page: 0, limit: 10 });
  },

  methods: {
    async fetchFormattedPartnersForDatatable(q, { page, limit }) {
      const data = await fetchpartners(q, { page, limit });
      if (data) {
        return data.map(p => ({
          id: p.id,
          label: p.name,
        }));
      }
      return undefined;
    },
    async searchValueChanged(q) {
      this.page = 0;
      this.partners = await this.fetchFormattedPartnersForDatatable(q, {
        page: this.page,
        limit: 10,
      });
      this.lastSearchTerm = q;
    },
    async nextPage() {
      if (!this.canGetNextPage) return;
      this.page += 1;
      this.canGetNextPage = false;
      const res = await this.fetchFormattedPartnersForDatatable(this.lastSearchTerm, {
        page: this.page,
        limit: 10,
      });
      this.canGetNextPage = true;
      if (res) {
        this.partners = this.partners.concat(res);
      }
    },
  },
  computed: {
    selectedPartners: {
      get() {
        return this.values;
      },
      set(partners) {
        this.$emit('updatePartners', partners);
      },
    },
  },
};
</script>

<style scoped></style>
