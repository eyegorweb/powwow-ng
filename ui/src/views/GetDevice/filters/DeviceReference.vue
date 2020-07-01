<template>
  <MultiSelectSearch
    :items="items"
    :default-selected-items.sync="selectedValues"
    @update:search="searchValueChanged"
    @scroll:limit="nextPage"
  />
</template>

<script>
import MultiSelectSearch from '@/components/ui/MultiSelectSearch';
import { mapState } from 'vuex';
import { getDeviceReferences } from '@/api/manufacturers.js';

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
      orderBy: {
        key: 'marketingName',
        direction: 'ASC',
      },
    };
  },
  props: {
    selectedData: Object,
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
    onUpdateValue(values) {
      this.$emit('change', values);
    },
    async fetchApi(q, partners, partnerType, pagination) {
      const data = await getDeviceReferences(q, this.orderBy, pagination);
      if (!data) return;
      return data.map(p => ({
        id: `${p}`,
        label: p,
        data: p,
      }));
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

  computed: {
    ...mapState('userContext', ['contextPartnersType', 'contextPartners']),
    selectedValues: {
      get() {
        if (!this.selectedData) return [];
        return this.selectedData.values;
      },
      set(newValues) {
        this.$emit('change', newValues);
      },
    },
  },

  async mounted() {
    this.initComponent();
  },

  watch: {
    contextPartners() {
      this.initComponent();
    },
    contextPartnersType() {
      this.initComponent();
    },
    selectedValues(values) {
      if (!values.length) {
        this.initComponent();
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
