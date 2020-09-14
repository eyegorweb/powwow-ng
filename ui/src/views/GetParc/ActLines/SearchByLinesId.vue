<template>
  <SearchById
    v-if="additionalIds"
    @searchById="searchById"
    :init-value="initValue"
    :additional-ids="additionalIds"
    placeholder="searchLine"
    :disable-when-empty="disableWhenEmpty"
  />
</template>

<script>
import SearchById from '@/components/SearchById';
import { mapGetters } from 'vuex';

export default {
  components: {
    SearchById,
  },
  props: {
    initValue: {
      type: String,
    },
    disableWhenEmpty: Boolean,
  },
  mounted() {
    if (this.userIsBO) {
      this.additionalIds = [
        {
          code: 'c6',
          value: 'accessPointId',
          label: 'AP_ID',
          checkFn: value => {
            if (isNaN(value)) return true;
            return (
              value.length !== 0 &&
              (value.length !== 19 || value.length !== 15 || value.length !== 11)
            );
          },
        },
      ];
    } else {
      this.additionalIds = [];
    }
  },
  data() {
    return {
      additionalIds: undefined,
    };
  },
  methods: {
    ...mapGetters(['userIsBO']),

    searchById(params) {
      this.$emit('searchById', params);
    },
  },
};
</script>

<style lang="scss" scoped></style>
