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
import { mapActions, mapGetters } from 'vuex';

export default {
  components: {
    MultiSelectSearch,
  },
  async mounted() {
    this.partners = await this.fetchFormattedPartnersForDatatable('', { page: 0, limit: 10 });
  },
  methods: {
    ...mapActions(['setPartnersFilter']),

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
    ...mapGetters(['selectedPartnersValues']),

    selectedPartners: {
      get() {
        return this.selectedPartnersValues;
      },
      set(partners) {
        this.setPartnersFilter(partners);
      },
    },
  },
  data() {
    return {
      lastSearchTerm: '',
      page: 0,
      partners: [],
      selectedPartnersCol: [],
      canGetNextPage: true,
    };
  },
};
</script>

<style scoped></style>
