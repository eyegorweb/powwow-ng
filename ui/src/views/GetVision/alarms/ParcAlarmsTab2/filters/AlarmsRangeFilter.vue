<template>
  <MultiSelectSearch :items="items" :default-selected-items.sync="selectedItems" />
</template>

<script>
import MultiSelectSearch from '@/components/ui/MultiSelectSearch';

export default {
  components: {
    MultiSelectSearch,
  },

  props: {
    selectedData: Object,
  },

  computed: {
    selectedValues() {
      if (this.selectedData) {
        return this.selectedData.values;
      }
      return [];
    },
    selectedItems: {
      get() {
        return this.selectedValues;
      },
      set(countries) {
        this.$emit('change', countries);
      },
    },
  },
  data() {
    return {
      items: [
        {
          id: 'PARTY',
          label: this.$t('col.partner'),
        },
        {
          id: 'CUSTOMER_ACCOUNT',
          label: this.$t('common.billingAccount'),
        },
        {
          id: 'OFFER',
          label: this.$t('getparc.lineDetail.offer'),
        },
        {
          id: 'LINE',
          label: this.$t('common.line'),
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped></style>
