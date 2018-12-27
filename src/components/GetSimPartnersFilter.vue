<template>
  <MultiSelectSearch
    :items="partners"
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
  async mounted() {
    this.partners = await fetchpartners('', { page: 1, limit: 10 });
  },
  methods: {
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
  data() {
    return {
      lastSearchTerm: '',
      page: 1,
      partners: [],
    };
  },
};
</script>

<style scoped>
</style>
