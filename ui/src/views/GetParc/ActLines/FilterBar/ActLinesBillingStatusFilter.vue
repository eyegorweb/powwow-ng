<template>
  <SimpleMultiSelect
    v-if="items"
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
    ...mapGetters(['userIsPartner', 'userIsBO', 'singlePartner']),
  },
  methods: {
    ...mapMutations('actLines', ['setBilligStatusesFilter']),
  },
  mounted() {
    const items = [
      {
        id: 'SUSPENDED',
        label: this.$t('getparc.actLines.simStatuses.SUSPENDED'),
      },
      {
        id: 'ACTIVATED',
        label: this.$t('getparc.actLines.simStatuses.ACTIVATED'),
      },
    ];
    if (this.singlePartner.partyType !== 'MVNO') {
      items.push(
        {
          id: 'CANCELED',
          label: this.$t('getparc.actLines.simStatuses.CANCELED'),
        },
        {
          id: 'TEST',
          label: this.$t('getparc.actLines.simStatuses.TEST'),
        }
      );
    }
    this.items = items;
  },
  data() {
    return {
      items: [],
    };
  },
};
</script>

<style lang="scss" scoped></style>
