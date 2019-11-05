<template>
  <SearchById @searchById="searchById" :additional-ids="additionalIds" :init-value="initValue" />
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
          code: 'c6',
          value: 'unitActionId',
          label: this.$t('getparc.search.act-unit-id'),
          checkFn: value => {
            if (isNaN(value)) return true;
            return (
              value.length !== 0 &&
              (value.length !== 19 || value.length !== 15 || value.length !== 11)
            );
          },
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
