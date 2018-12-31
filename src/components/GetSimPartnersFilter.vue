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
import { mapMutations, mapGetters } from 'vuex';

export default {
  components: {
    MultiSelectSearch,
  },
  async mounted() {
    this.partners = await fetchpartners('', { page: 1, limit: 10 });
  },
  methods: {
    ...mapMutations(['selectFilterValue']),

    async searchValueChanged(q) {
      this.partners = await fetchpartners(q, { page: 1, limit: 50 });
      this.lastSearchTerm = q;
      this.page = 1;
    },
    async nextPage() {
      this.page += 1;
      const res = await fetchpartners(this.lastSearchTerm, { page: this.page, limit: 50 });
      if (res) {
        this.partners = this.partners.concat(res);
      }
    },
  },
  computed: {
    ...mapGetters(['currentFilters']),

    selectedPartners: {
      get() {
        const foundFilters = this.currentFilters.filter(c => c.id === 'filters.partners');
        if (foundFilters && foundFilters.length) {
          return foundFilters[0].values;
        }
        return [];
      },
      set(partners) {
        this.selectFilterValue({
          id: 'filters.partners',
          name: this.$t('filters.partners'),
          newValue: partners,
        });
      },
    },
  },
  data() {
    return {
      lastSearchTerm: '',
      page: 1,
      partners: [],
      selectedPartnersCol: [],
    };
  },
};
</script>

<style scoped>
</style>
