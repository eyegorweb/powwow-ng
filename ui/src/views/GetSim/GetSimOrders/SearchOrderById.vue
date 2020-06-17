<template>
  <SearchById
    @searchById="searchById"
    :additional-ids="additionalIds"
    :init-value="initValue"
    placeholder="searchOrderById"
  />
</template>

<script>
import SearchById from '@/components/SearchById';

export default {
  components: {
    SearchById,
  },
  props: {
    initValue: {
      type: String,
    },
  },
  data() {
    return {
      additionalIds: [
        {
          code: 'c5',
          value: 'idOrder',
          label: this.$t('orders.search.order-id'),
          checkFn: value =>
            !isNaN(value) &&
            value.length !== 0 &&
            (value.length !== 19 || value.length !== 15 || value.length !== 11),
        },
        {
          code: 'c6',
          value: 'orderReference',
          label: this.$t('orders.search.client-reference'),
          checkFn: value => isNaN(value),
        },
      ],
    };
  },
  methods: {
    searchById(params) {
      this.$emit('searchById', params);
    },
  },
};
</script>

<style lang="scss" scoped></style>
