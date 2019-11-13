<template>
  <MultiSelectSearch
    :items="items"
    :default-selected-items.sync="selectedItems"
    @update:search="searchValueChanged"
    @scroll:limit="nextPage"
    :collapsed="collapsed"
  />
</template>

<script>
import MultiSelectSearch from '@/components/ui/MultiSelectSearch';
import { mapState } from 'vuex';

export default {
  components: {
    MultiSelectSearch,
  },
  data() {
    return {
      items: [],
      lastSearchTerm: '',
      canFetchNextPage: true,
      page: 0,
    };
  },
  props: {
    selectedPartnersValues: {
      type: Array,
      required: false,
    },
    values: {
      type: Array,
      required: false,
    },
    fetchApi: Function,
    collapsed: Boolean,
  },

  async mounted() {
    this.initComponent();
  },
  computed: {
    ...mapState('userContext', ['contextPartnersType', 'contextPartners']),
    selectedItems: {
      get() {
        return this.values;
      },
      set(newValues) {
        this.$emit('update:values', newValues);
      },
    },
  },
  watch: {
    async selectedPartnersValues() {
      this.page = 0;
      this.canFetchNextPage = true;
      this.items = await this.fetchFormattedForDatatable(this.lastSearchTerm, {
        page: this.page,
        limit: 50,
      });
    },

    async contextPartners() {
      this.initComponent();
    },
    async contextPartnersType() {
      this.initComponent();
    },
  },
  methods: {
    async initComponent() {
      this.items = await this.fetchFormattedForDatatable('', {
        page: 0,
        limit: 10,
      });
    },
    async fetchFormattedForDatatable(q, { page, limit }) {
      let forPartners = [];
      if (this.selectedPartnersValues && this.selectedPartnersValues.length) {
        forPartners = this.selectedPartnersValues;
      } else if (this.contextPartners && this.contextPartners.length) {
        forPartners = this.contextPartners;
      }

      return await this.fetchApi(q, forPartners, this.contextPartnersType, { page, limit });
    },
    async searchValueChanged(q) {
      this.items = await this.fetchFormattedForDatatable(q, {
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
      const res = await this.fetchFormattedForDatatable(this.lastSearchTerm, {
        page: this.page,
        limit: 10,
      });
      if (res && res.length > 0) {
        this.items = this.items.concat(res);
      } else {
        this.canFetchNextPage = false;
      }
    },
  },
};
</script>

<style scoped></style>
