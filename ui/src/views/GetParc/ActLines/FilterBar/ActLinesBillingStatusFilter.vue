<template>
  <SimpleMultiSelect
    :options="items"
    :values="selectedBilligStatusesValues || []"
    @updateValues="setBilligStatusesFilter"
  />
</template>

<script>
import SimpleMultiSelect from '@/components/Filters/SimpleMultiSelect';
import { mapMutations, mapGetters } from 'vuex';

export default {
  name: 'ActLinesBillingStatuses',
  components: {
    SimpleMultiSelect,
  },
  computed: {
    ...mapGetters('actLines', ['selectedBilligStatusesValues']),
  },
  methods: {
    ...mapMutations('actLines', ['setBilligStatusesFilter']),
  },
  data() {
    return {
      items: [
        {
          id: 'SUSPENDED',
          label: this.$t('getparc.actLines.simStatuses.SUSPENDED'),
        },
        {
          id: 'CANCELED',
          label: this.$t('getparc.actLines.simStatuses.CANCELED'),
        },
        {
          id: 'ACTIVATED',
          label: this.$t('getparc.actLines.simStatuses.ACTIVATED'),
        },
        {
          id: 'TEST',
          label: this.$t('getparc.actLines.simStatuses.TEST'),
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped></style>
