<template>
  <MultiSelectSearch
    :items="creators"
    :default-selected-items.sync="selectedOrderCreator"
    @update:search="searchValueChanged"
    @scroll:limit="nextPage"
  />
</template>

<script>
import MultiSelectSearch from '@/components/ui/MultiSelectSearch';
import { fetchUsers } from '@/api/users';

export default {
  props: {
    selectedOrderCreatorValues: Array,
    selectedPartnersValues: Array,
  },
  data() {
    return {
      creators: [],
      lastSearchTerm: '',
      canFetchNextPage: true,
      page: 0,
    };
  },

  async mounted() {
    this.creators = await this.fetchFormattedOrderCreatorsForDatatable('', {
      page: 0,
      limit: 10,
    });
  },

  methods: {
    async fetchFormattedOrderCreatorsForDatatable(q, { page, limit }) {
      const data = await fetchUsers(q, this.selectedPartnersValues, { page, limit });
      if (data) {
        return data.map(p => ({
          id: p.id,
          label: `${p.name.firstName || ''} ${p.name.lastName || ''}`,
          partnerId: p.party.id,
        }));
      }
      return undefined;
    },

    async searchValueChanged(q) {
      this.creators = await this.fetchFormattedOrderCreatorsForDatatable(q, {
        page: 0,
        limit: 10,
      });
      this.lastSearchTerm = q;
      this.page = 0;
      this.canFetchNextPage = true;
    },

    async nextPage() {
      if (!this.canFetchNextPage) return;

      this.page += 1;
      const res = await this.fetchFormattedOrderCreatorsForDatatable(this.lastSearchTerm, {
        page: this.page,
        limit: 10,
      });
      if (res && res.length > 0) {
        this.creators = this.creators.concat(res);
      } else {
        this.canFetchNextPage = false;
      }
    },
  },

  computed: {
    selectedOrderCreator: {
      get() {
        return this.selectedOrderCreatorValues;
      },
      set(creators) {
        this.$emit('setOrderCreatorFilter', creators);
      },
    },
  },

  watch: {
    async selectedPartnersValues() {
      this.page = 0;
      this.canFetchNextPage = true;
      this.creators = await this.fetchFormattedOrderCreatorsForDatatable(this.lastSearchTerm, {
        page: this.page,
        limit: 50,
      });
    },
  },

  components: {
    MultiSelectSearch,
  },
};
</script>

<style scoped></style>
