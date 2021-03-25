<template>
  <CustomFieldsFilter
    :custom-fields="filterCustomFieldsList"
    :values="selectedValues"
    @updateCustomFields="$emit('change', $event)"
  />
</template>

<script>
import CustomFieldsFilter from '@/components/Filters/CustomFieldsFilter';
import { fetchCustomFields } from '@/api/customFields';

export default {
  components: {
    CustomFieldsFilter,
  },
  props: {
    selectedData: Object,
    getPageContext: Function,
  },

  data() {
    return {
      filterCustomFieldsList: undefined,
    };
  },
  computed: {
    selectedValues() {
      if (!this.selectedData) return [];

      return this.selectedData.values;
    },
    selectedPartnerId() {
      if (!this.getPageContext) return [];
      const pageContext = this.getPageContext();
      if (pageContext && pageContext.partners && pageContext.partners.length === 1) {
        return pageContext.partners[0].id;
      }
      return undefined;
    },
  },

  methods: {
    async refreshCustomFieldsMeta() {
      if (this.selectedPartnerId) {
        const response = await fetchCustomFields(this.selectedPartnerId);
        if (response) {
          this.filterCustomFieldsList = response.customFields;
          return;
        }
      }
      this.filterCustomFieldsList = undefined;
    },
  },

  watch: {
    selectedPartnerId(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.refreshCustomFieldsMeta();
      }
    },
  },

  mounted() {
    this.refreshCustomFieldsMeta();
  },
};
</script>

<style lang="scss" scoped>
</style>
